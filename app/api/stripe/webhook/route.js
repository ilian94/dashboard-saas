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

    const subscription = await stripe.subscriptions.retrieve(session.subscription, {
      expand: ['items.data.price'],
    });
    const activePriceId = subscription.items.data[0].price.id;
    const plan = PLAN_MAP[activePriceId] || 'starter';

    // Vérifier si le client a déjà un numéro
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

    // Email de confirmation de paiement
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

            <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
              Go to dashboard →
            </a>

            <p style="color: #374151; font-size: 0.85rem; margin-top: 32px;">VoiceBot AI — Never miss a client call again.</p>
          </div>
        `,
      });
    }

    console.log(`✅ Client ${userId} — plan: ${plan} — number: ${twilioNumber}`);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    const { data: client } = await supabase
      .from('clients')
      .select('twilio_number, email')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    if (client?.twilio_number) {
      await releaseTwilioNumber(client.twilio_number);
    }

    // Email d'annulation
    if (client?.email) {
      await resend.emails.send({
        from: 'VoiceBot AI <onboarding@resend.dev>',
        to: client.email,
        subject: 'Your VoiceBot subscription has been cancelled',
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: white; padding: 40px; border-radius: 16px;">
            <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">Subscription cancelled</h1>
            <p style="color: #6b7280; margin-bottom: 32px;">Your VoiceBot subscription has been cancelled. Your phone number has been released.</p>
            <a href="https://dashboard-saas-nine.vercel.app/pricing" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
              Resubscribe →
            </a>
            <p style="color: #374151; font-size: 0.85rem; margin-top: 32px;">VoiceBot AI — Never miss a client call again.</p>
          </div>
        `,
      });
    }

    await supabase
      .from('clients')
      .update({ plan: null, twilio_number: null })
      .eq('stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}