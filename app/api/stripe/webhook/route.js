import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const resend = new Resend(process.env.RESEND_API_KEY);

const PLAN_MAP = {
  'price_1TZI4xFbv1QHIqBxM1ogpacl': 'starter',
  'price_1TZI51Fbv1QHIqBxfvYIkKRh': 'scale',
  'price_1TZI51Fbv1QHIqBxmfldnApH': 'business',
};

const EXTRA_MINUTES_MAP = {
  'price_1Ta0IaFbv1QHIqBxbXgAGIlo': 500,
  'price_1Ta0J4Fbv1QHIqBxJDgDXSxx': 1000,
  'price_1Ta0JIFbv1QHIqBxWJHkMI3w': 2000,
};

const ADDITIONAL_NUMBER_PRICE_ID = 'price_1Ta0HrFbv1QHIqBx45XsDToe';

async function buyTwilioNumber() {
  try {
    const available = await twilioClient.availablePhoneNumbers('US')
      .local
      .list({ voiceEnabled: true, limit: 1 });
    if (!available.length) return null;
    const purchased = await twilioClient.incomingPhoneNumbers.create({
      phoneNumber: available[0].phoneNumber,
      voiceUrl: 'https://voice-bot-saas.onrender.com/voice',
      voiceMethod: 'POST',
      statusCallback: 'https://voice-bot-saas.onrender.com/voice-status',
      statusCallbackMethod: 'POST',
    });
    return purchased.phoneNumber;
  } catch (err) {
    console.error('Twilio buy number error:', err.message);
    return null;
  }
}

async function releaseTwilioNumber(phoneNumber) {
  try {
    const numbers = await twilioClient.incomingPhoneNumbers.list({ phoneNumber });
    if (numbers.length > 0) {
      await twilioClient.incomingPhoneNumbers(numbers[0].sid).remove();
    }
  } catch (err) {
    console.error('Twilio release number error:', err.message);
  }
}

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const mode = session.mode;

    if (mode === 'payment') {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;
      const extraMinutes = EXTRA_MINUTES_MAP[priceId];

      if (extraMinutes) {
        const { data: client } = await supabase
          .from('clients')
          .select('extra_minutes, email, business_name')
          .eq('user_id', userId)
          .maybeSingle();

        const currentExtra = client?.extra_minutes || 0;
        await supabase
          .from('clients')
          .update({ extra_minutes: currentExtra + extraMinutes })
          .eq('user_id', userId);

        if (client?.email) {
          await resend.emails.send({
            from: 'VoiceBot AI <onboarding@resend.dev>',
            to: client.email,
            subject: `${extraMinutes} extra minutes added ✅`,
            html: `
              <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: white; padding: 40px; border-radius: 16px;">
                <div style="margin-bottom: 32px;">
                  <p style="color: #4f46e5; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">VoiceBot AI</p>
                  <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em;">${extraMinutes} minutes added ✅</h1>
                  <p style="color: #6b7280; font-size: 1rem; line-height: 1.6;">Hi ${client.business_name || 'there'}, your extra minutes are ready to use.</p>
                </div>
                <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
                  <p style="color: #9ca3af; margin-bottom: 4px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em;">Minutes added</p>
                  <p style="font-size: 2rem; font-weight: 800; color: #4ade80; letter-spacing: -0.03em;">+${extraMinutes} min</p>
                </div>
                <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <p style="color: #9ca3af; margin-bottom: 4px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em;">Total extra minutes available</p>
                  <p style="font-size: 1.3rem; font-weight: 700; color: white;">${currentExtra + extraMinutes} minutes</p>
                  <p style="color: #6b7280; font-size: 0.82rem; margin-top: 4px;">In addition to your monthly plan minutes.</p>
                </div>
                <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.95rem;">Go to dashboard →</a>
                <p style="color: #374151; font-size: 0.8rem; margin-top: 32px; border-top: 1px solid #1e2433; padding-top: 24px;">VoiceBot AI — Never miss a client call again.<br/>Questions? Reply to this email.</p>
              </div>
            `,
          });
        }
        console.log(`✅ ${extraMinutes} extra minutes added for ${userId}`);
      }
      return NextResponse.json({ received: true });
    }

    if (mode === 'subscription') {
      const subscription = await stripe.subscriptions.retrieve(session.subscription, {
        expand: ['items.data.price'],
      });
      const activePriceId = subscription.items.data[0].price.id;

      if (activePriceId === ADDITIONAL_NUMBER_PRICE_ID) {
        const { data: client } = await supabase
          .from('clients')
          .select('twilio_numbers, email, business_name')
          .eq('user_id', userId)
          .maybeSingle();

        const newNumber = await buyTwilioNumber();
        if (newNumber) {
          const currentNumbers = client?.twilio_numbers || [];
          await supabase
            .from('clients')
            .update({ twilio_numbers: [...currentNumbers, newNumber] })
            .eq('user_id', userId);

          if (client?.email) {
            await resend.emails.send({
              from: 'VoiceBot AI <onboarding@resend.dev>',
              to: client.email,
              subject: 'New phone number added ✅',
              html: `
                <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: white; padding: 40px; border-radius: 16px;">
                  <div style="margin-bottom: 32px;">
                    <p style="color: #4f46e5; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">VoiceBot AI</p>
                    <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em;">New number ready ✅</h1>
                    <p style="color: #6b7280; font-size: 1rem; line-height: 1.6;">Hi ${client.business_name || 'there'}, your additional VoiceBot number is active.</p>
                  </div>
                  <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
                    <p style="color: #9ca3af; margin-bottom: 4px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em;">Your new number</p>
                    <p style="font-size: 1.5rem; font-weight: 700; font-family: monospace; color: white;">${newNumber}</p>
                  </div>
                  <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <p style="font-size: 0.875rem; color: #9ca3af; line-height: 1.7;">This number is now active and handled by your VoiceBot. Forward any business line to this number to start receiving calls automatically.</p>
                  </div>
                  <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.95rem;">View all my numbers →</a>
                  <p style="color: #374151; font-size: 0.8rem; margin-top: 32px; border-top: 1px solid #1e2433; padding-top: 24px;">VoiceBot AI — Never miss a client call again.<br/>Questions? Reply to this email.</p>
                </div>
              `,
            });
          }
          console.log(`✅ New number ${newNumber} added for ${userId}`);
        }
        return NextResponse.json({ received: true });
      }

      const plan = PLAN_MAP[activePriceId] || 'starter';
      const { data: client } = await supabase
        .from('clients')
        .select('twilio_number, email, business_name')
        .eq('user_id', userId)
        .maybeSingle();

      let twilioNumber = client?.twilio_number;
      if (!twilioNumber) {
        twilioNumber = await buyTwilioNumber();
      }

      await supabase
        .from('clients')
        .update({
          plan,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          ...(twilioNumber && { twilio_number: twilioNumber }),
        })
        .eq('user_id', userId);

      if (client?.email) {
        await resend.emails.send({
          from: 'VoiceBot AI <onboarding@resend.dev>',
          to: client.email,
          subject: 'Your VoiceBot is now active ✅',
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: white; padding: 40px; border-radius: 16px;">
              <div style="margin-bottom: 32px;">
                <p style="color: #4f46e5; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">VoiceBot AI</p>
                <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em;">Your VoiceBot is live ✅</h1>
                <p style="color: #6b7280; font-size: 1rem; line-height: 1.6;">Hi ${client.business_name || 'there'}, welcome aboard. Your VoiceBot is now answering calls 24/7.</p>
              </div>
              <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
                <p style="color: #9ca3af; margin-bottom: 4px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em;">Your plan</p>
                <p style="font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 4px; text-transform: capitalize;">${plan} Plan</p>
                <p style="color: #6b7280; font-size: 0.85rem;">${plan === 'starter' ? '500' : plan === 'scale' ? '2,000' : '6,000'} minutes/month included</p>
              </div>
              <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 16px;">
                <p style="color: #9ca3af; margin-bottom: 4px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em;">Your dedicated number</p>
                <p style="font-size: 1.5rem; font-weight: 700; font-family: monospace; color: white;">${twilioNumber || 'Being assigned — check your dashboard'}</p>
                <p style="color: #6b7280; font-size: 0.82rem; margin-top: 8px;">Forward your existing business number to this number to activate your VoiceBot.</p>
              </div>
              <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="font-size: 0.9rem; font-weight: 700; margin-bottom: 16px;">3 steps to go live:</p>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                      <div style="width: 24px; height: 24px; background: rgba(79,70,229,0.15); border: 1px solid rgba(79,70,229,0.3); border-radius: 50%; text-align: center; line-height: 24px; font-size: 0.7rem; font-weight: 700; color: #818cf8;">1</div>
                    </td>
                    <td style="padding: 8px 0 8px 12px; vertical-align: top;">
                      <p style="font-weight: 600; font-size: 0.875rem; margin-bottom: 2px; color: white;">Connect Google Calendar</p>
                      <p style="color: #6b7280; font-size: 0.8rem;">So your VoiceBot can book appointments automatically.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                      <div style="width: 24px; height: 24px; background: rgba(79,70,229,0.15); border: 1px solid rgba(79,70,229,0.3); border-radius: 50%; text-align: center; line-height: 24px; font-size: 0.7rem; font-weight: 700; color: #818cf8;">2</div>
                    </td>
                    <td style="padding: 8px 0 8px 12px; vertical-align: top;">
                      <p style="font-weight: 600; font-size: 0.875rem; margin-bottom: 2px; color: white;">Forward your business number</p>
                      <p style="color: #6b7280; font-size: 0.8rem;">Redirect calls to ${twilioNumber || 'your VoiceBot number'}.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; vertical-align: top; width: 32px;">
                      <div style="width: 24px; height: 24px; background: rgba(79,70,229,0.15); border: 1px solid rgba(79,70,229,0.3); border-radius: 50%; text-align: center; line-height: 24px; font-size: 0.7rem; font-weight: 700; color: #818cf8;">3</div>
                    </td>
                    <td style="padding: 8px 0 8px 12px; vertical-align: top;">
                      <p style="font-weight: 600; font-size: 0.875rem; margin-bottom: 2px; color: white;">Test your VoiceBot</p>
                      <p style="color: #6b7280; font-size: 0.8rem;">Call the number and have a conversation.</p>
                    </td>
                  </tr>
                </table>
              </div>
              <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.95rem;">Go to dashboard →</a>
              <p style="color: #374151; font-size: 0.8rem; margin-top: 32px; border-top: 1px solid #1e2433; padding-top: 24px;">VoiceBot AI — Never miss a client call again.<br/>Questions? Reply to this email.</p>
            </div>
          `,
        });
      }
      console.log(`✅ Client ${userId} — plan: ${plan} — number: ${twilioNumber}`);
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const newPriceId = subscription.items.data[0]?.price?.id;
    const newPlan = PLAN_MAP[newPriceId];

    if (newPlan) {
      await supabase
        .from('clients')
        .update({ plan: newPlan })
        .eq('stripe_customer_id', customerId);
      console.log(`✅ Plan updated to ${newPlan} for customer ${customerId}`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const priceId = subscription.items.data[0]?.price?.id;

    const { data: client } = await supabase
      .from('clients')
      .select('twilio_number, twilio_numbers, email')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    if (priceId === ADDITIONAL_NUMBER_PRICE_ID) {
      const numbers = client?.twilio_numbers || [];
      if (numbers.length > 0) {
        const numberToRelease = numbers[numbers.length - 1];
        await releaseTwilioNumber(numberToRelease);
        await supabase
          .from('clients')
          .update({ twilio_numbers: numbers.slice(0, -1) })
          .eq('stripe_customer_id', customerId);
      }
      return NextResponse.json({ received: true });
    }

    if (client?.twilio_number) {
      await releaseTwilioNumber(client.twilio_number);
    }
    if (client?.twilio_numbers?.length > 0) {
      for (const num of client.twilio_numbers) {
        await releaseTwilioNumber(num);
      }
    }

    if (client?.email) {
      await resend.emails.send({
        from: 'VoiceBot AI <onboarding@resend.dev>',
        to: client.email,
        subject: 'Your VoiceBot subscription has been cancelled',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: white; padding: 40px; border-radius: 16px;">
            <div style="margin-bottom: 32px;">
              <p style="color: #4f46e5; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">VoiceBot AI</p>
              <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.02em;">Subscription cancelled</h1>
              <p style="color: #6b7280; font-size: 1rem; line-height: 1.6;">We're sorry to see you go.</p>
            </div>
            <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <p style="font-size: 0.875rem; color: #9ca3af; line-height: 1.7; margin-bottom: 12px;">Your dedicated phone numbers have been released and your VoiceBot is no longer active. Any calls to your forwarded number will no longer be handled automatically.</p>
              <p style="font-size: 0.875rem; color: #9ca3af; line-height: 1.7;">If this was a mistake or you'd like to come back, you can resubscribe at any time — setup takes less than 5 minutes.</p>
            </div>
            <a href="https://dashboard-saas-nine.vercel.app/pricing" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 0.95rem;">Resubscribe →</a>
            <p style="color: #374151; font-size: 0.8rem; margin-top: 32px; border-top: 1px solid #1e2433; padding-top: 24px;">VoiceBot AI — Never miss a client call again.<br/>Questions? Reply to this email.</p>
          </div>
        `,
      });
    }

    await supabase
      .from('clients')
      .update({ plan: null, twilio_number: null, twilio_numbers: [], extra_minutes: 0 })
      .eq('stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}