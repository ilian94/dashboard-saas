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
                <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">${extraMinutes} minutes added ✅</h1>
                <p style="color: #6b7280; margin-bottom: 32px;">Hi ${client.business_name || 'there'}, your extra minutes are now available.</p>
                <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Go to dashboard →</a>
                <p style="color: #374151; font-size: 0.85rem; margin-top: 32px;">VoiceBot AI — Never miss a client call again.</p>
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
                  <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">New number added ✅</h1>
                  <p style="color: #6b7280; margin-bottom: 32px;">Hi ${client.business_name || 'there'}, your new number is ready.</p>
                  <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <p style="color: #9ca3af; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Your new number</p>
                    <p style="font-size: 1.5rem; font-weight: 700; font-family: monospace; color: white;">${newNumber}</p>
                  </div>
                  <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Go to dashboard →</a>
                  <p style="color: #374151; font-size: 0.85rem; margin-top: 32px;">VoiceBot AI — Never miss a client call again.</p>
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
              <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">Your VoiceBot is active ✅</h1>
              <p style="color: #6b7280; margin-bottom: 32px;">Hi ${client.business_name || 'there'}, your ${plan} plan is now live.</p>
              <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <p style="color: #9ca3af; margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em;">Your dedicated number</p>
                <p style="font-size: 1.5rem; font-weight: 700; font-family: monospace; color: white;">${twilioNumber || 'Being assigned — check your dashboard'}</p>
              </div>
              <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="font-size: 1rem; margin-bottom: 16px;">What's next:</h2>
                <ol style="color: #9ca3af; padding-left: 20px; line-height: 2;">
                  <li>Connect your Google Calendar in the dashboard</li>
                  <li>Forward your business number to ${twilioNumber || 'your VoiceBot number'}</li>
                  <li>Test your VoiceBot by calling the number</li>
                </ol>
              </div>
              <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Go to dashboard →</a>
              <p style="color: #374151; font-size: 0.85rem; margin-top: 32px;">VoiceBot AI — Never miss a client call again.</p>
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
            <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">Subscription cancelled</h1>
            <p style="color: #6b7280; margin-bottom: 32px;">Your VoiceBot subscription has been cancelled. Your phone numbers have been released.</p>
            <a href="https://dashboard-saas-nine.vercel.app/pricing" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Resubscribe →</a>
            <p style="color: #374151; font-size: 0.85rem; margin-top: 32px;">VoiceBot AI — Never miss a client call again.</p>
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