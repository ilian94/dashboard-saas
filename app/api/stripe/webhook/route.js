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
  'price_1Tb2jVFbv1QHIqBxpPYETYKS': 500,
  'price_1Tb2lMFbv1QHIqBxTbNNU8FK': 1000,
  'price_1Tb2lmFbv1QHIqBxjHqbrZbr': 2000,
};

const ADDITIONAL_NUMBER_PRICE_ID = 'price_1Ta0HrFbv1QHIqBx45XsDToe';

const LOGO = `<img src="https://voicebotai.us/favicon.png" width="28" height="28" style="border-radius:8px;vertical-align:middle;display:inline-block;" alt="VoiceBot AI">`;

function emailActivation({ plan, twilioNumber, businessName }) {
  const planMinutes = plan === 'starter' ? '500' : plan === 'scale' ? '2,000' : '6,000';
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const number = twilioNumber || 'Being assigned — check your dashboard';
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080b12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080b12;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <tr><td style="padding-bottom:32px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>${LOGO}&nbsp;<span style="color:#e2e8f0;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;">VoiceBot AI</span></td>
          <td align="right"><span style="background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#818cf8;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:0.08em;">${planLabel} Plan</span></td>
        </tr></table>
      </td></tr>

      <tr><td style="background:linear-gradient(135deg,#0f1420 0%,#13192b 100%);border:1px solid #1e2a3a;border-radius:16px;padding:40px 36px 36px;">
        <p style="margin:0 0 20px;color:#6366f1;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Welcome aboard</p>
        <h1 style="margin:0 0 12px;color:#f8fafc;font-size:32px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;">Your VoiceBot<br>is live ✅</h1>
        <p style="margin:0;color:#64748b;font-size:15px;line-height:1.6;">Hi ${businessName || 'there'} — your AI receptionist is now answering calls 24/7. Here's everything you need to get started.</p>
      </td></tr>

      <tr><td style="height:12px;"></td></tr>

      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td width="48%" style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:20px 24px;vertical-align:top;">
            <p style="margin:0 0 6px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Your plan</p>
            <p style="margin:0 0 4px;color:#f8fafc;font-size:20px;font-weight:800;">${planLabel}</p>
            <p style="margin:0;color:#6366f1;font-size:13px;font-weight:600;">${planMinutes} min/month</p>
          </td>
          <td width="4%"></td>
          <td width="48%" style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:20px 24px;vertical-align:top;">
            <p style="margin:0 0 6px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Your number</p>
            <p style="margin:0 0 4px;color:#f8fafc;font-size:18px;font-weight:800;font-family:'Courier New',monospace;">${number}</p>
            <p style="margin:0;color:#64748b;font-size:12px;">Forward calls here</p>
          </td>
        </tr></table>
      </td></tr>

      <tr><td style="height:12px;"></td></tr>

      <tr><td style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:28px 32px;">
        <p style="margin:0 0 24px;color:#f8fafc;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">3 steps to go live</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
          <td width="36" style="vertical-align:top;padding-top:2px;"><div style="width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#fff;">1</div></td>
          <td style="padding-left:14px;vertical-align:top;">
            <p style="margin:0 0 4px;color:#f8fafc;font-size:14px;font-weight:700;">Connect Google Calendar</p>
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">So your VoiceBot books appointments automatically — no manual work.</p>
          </td>
        </tr></table>
        <div style="height:1px;background:#1e2a3a;margin-bottom:20px;"></div>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;"><tr>
          <td width="36" style="vertical-align:top;padding-top:2px;"><div style="width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#fff;">2</div></td>
          <td style="padding-left:14px;vertical-align:top;">
            <p style="margin:0 0 4px;color:#f8fafc;font-size:14px;font-weight:700;">Forward your business number</p>
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">Redirect calls to <span style="color:#818cf8;font-family:'Courier New',monospace;">${number}</span> — your VoiceBot answers instantly.</p>
          </td>
        </tr></table>
        <div style="height:1px;background:#1e2a3a;margin-bottom:20px;"></div>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td width="36" style="vertical-align:top;padding-top:2px;"><div style="width:28px;height:28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#fff;">3</div></td>
          <td style="padding-left:14px;vertical-align:top;">
            <p style="margin:0 0 4px;color:#f8fafc;font-size:14px;font-weight:700;">Call your number and test it</p>
            <p style="margin:0;color:#64748b;font-size:13px;line-height:1.5;">Have a full conversation with your VoiceBot. Make sure everything sounds right.</p>
          </td>
        </tr></table>
      </td></tr>

      <tr><td style="height:24px;"></td></tr>
      <tr><td align="center"><a href="https://voicebotai.us/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 36px;border-radius:10px;font-weight:800;font-size:15px;">Open Dashboard →</a></td></tr>

      <tr><td style="padding-top:32px;border-top:1px solid #1e2a3a;margin-top:32px;">
        <p style="margin:24px 0 4px;color:#334155;font-size:12px;text-align:center;">VoiceBot AI — Never miss a client call again.</p>
        <p style="margin:0;color:#1e293b;font-size:12px;text-align:center;">Questions? Reply to this email.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

function emailExtraMinutes({ extraMinutes, currentExtra, businessName }) {
  const total = currentExtra + extraMinutes;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080b12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080b12;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <tr><td style="padding-bottom:32px;">
        ${LOGO}&nbsp;<span style="color:#e2e8f0;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;">VoiceBot AI</span>
      </td></tr>

      <tr><td style="background:linear-gradient(135deg,#0a1a12 0%,#0f2018 100%);border:1px solid #1a3a28;border-radius:16px;padding:40px 36px 36px;">
        <p style="margin:0 0 16px;color:#4ade80;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Minutes added</p>
        <h1 style="margin:0 0 4px;color:#f8fafc;font-size:56px;font-weight:900;letter-spacing:-0.04em;line-height:1;">+${extraMinutes}</h1>
        <p style="margin:0 0 20px;color:#4ade80;font-size:20px;font-weight:700;">minutes</p>
        <p style="margin:0;color:#64748b;font-size:15px;line-height:1.6;">Hi ${businessName || 'there'} — your extra minutes are ready to use right now.</p>
      </td></tr>

      <tr><td style="height:12px;"></td></tr>

      <tr><td style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:28px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:top;">
            <p style="margin:0 0 6px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Total extra minutes available</p>
            <p style="margin:0;color:#f8fafc;font-size:32px;font-weight:800;letter-spacing:-0.03em;">${total} min</p>
            <p style="margin:6px 0 0;color:#64748b;font-size:13px;">In addition to your monthly plan minutes</p>
          </td>
          <td align="right" style="vertical-align:middle;">
            <div style="width:56px;height:56px;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);border-radius:50%;text-align:center;line-height:56px;font-size:24px;">⚡</div>
          </td>
        </tr></table>
      </td></tr>

      <tr><td style="height:24px;"></td></tr>
      <tr><td align="center"><a href="https://voicebotai.us/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 36px;border-radius:10px;font-weight:800;font-size:15px;">Open Dashboard →</a></td></tr>

      <tr><td style="padding-top:32px;">
        <p style="margin:24px 0 4px;color:#334155;font-size:12px;text-align:center;">VoiceBot AI — Never miss a client call again.</p>
        <p style="margin:0;color:#1e293b;font-size:12px;text-align:center;">Questions? Reply to this email.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

function emailAdditionalNumber({ newNumber, businessName }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080b12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080b12;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <tr><td style="padding-bottom:32px;">
        ${LOGO}&nbsp;<span style="color:#e2e8f0;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;">VoiceBot AI</span>
      </td></tr>

      <tr><td style="background:linear-gradient(135deg,#0f1420 0%,#13192b 100%);border:1px solid #1e2a3a;border-radius:16px;padding:40px 36px 36px;">
        <p style="margin:0 0 20px;color:#6366f1;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">New number active</p>
        <h1 style="margin:0 0 12px;color:#f8fafc;font-size:32px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;">Additional number<br>ready ✅</h1>
        <p style="margin:0;color:#64748b;font-size:15px;line-height:1.6;">Hi ${businessName || 'there'} — your new VoiceBot line is active and ready to take calls.</p>
      </td></tr>

      <tr><td style="height:12px;"></td></tr>

      <tr><td style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:32px;text-align:center;">
        <p style="margin:0 0 12px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Your new number</p>
        <p style="margin:0 0 12px;color:#f8fafc;font-size:36px;font-weight:800;font-family:'Courier New',monospace;letter-spacing:0.04em;">${newNumber}</p>
        <span style="display:inline-block;background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);color:#4ade80;font-size:11px;font-weight:700;padding:4px 14px;border-radius:20px;letter-spacing:0.06em;text-transform:uppercase;">● Active</span>
      </td></tr>

      <tr><td style="height:12px;"></td></tr>

      <tr><td style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:28px 32px;">
        <p style="margin:0 0 12px;color:#f8fafc;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;">Next step</p>
        <p style="margin:0;color:#64748b;font-size:14px;line-height:1.7;">Forward any of your business lines to <span style="color:#818cf8;font-family:'Courier New',monospace;">${newNumber}</span> — your VoiceBot will answer automatically, just like your main number.</p>
      </td></tr>

      <tr><td style="height:24px;"></td></tr>
      <tr><td align="center"><a href="https://voicebotai.us/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 36px;border-radius:10px;font-weight:800;font-size:15px;">View all my numbers →</a></td></tr>

      <tr><td style="padding-top:32px;">
        <p style="margin:24px 0 4px;color:#334155;font-size:12px;text-align:center;">VoiceBot AI — Never miss a client call again.</p>
        <p style="margin:0;color:#1e293b;font-size:12px;text-align:center;">Questions? Reply to this email.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

function emailCancellation() {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080b12;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080b12;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <tr><td style="padding-bottom:32px;">
        ${LOGO}&nbsp;<span style="color:#e2e8f0;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;">VoiceBot AI</span>
      </td></tr>

      <tr><td style="background:linear-gradient(135deg,#12100f 0%,#1a1412 100%);border:1px solid #2a2018;border-radius:16px;padding:40px 36px 36px;">
        <p style="margin:0 0 20px;color:#94a3b8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Subscription ended</p>
        <h1 style="margin:0 0 12px;color:#f8fafc;font-size:32px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;">We're sorry<br>to see you go.</h1>
        <p style="margin:0;color:#64748b;font-size:15px;line-height:1.6;">Your VoiceBot has been deactivated and your phone numbers have been released.</p>
      </td></tr>

      <tr><td style="height:12px;"></td></tr>

      <tr><td style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:28px 32px;">
        <p style="margin:0 0 16px;color:#94a3b8;font-size:14px;line-height:1.8;">Your AI receptionist is no longer active. Any calls forwarded to your VoiceBot number will no longer be answered automatically.</p>
        <p style="margin:0;color:#64748b;font-size:14px;line-height:1.8;">If this was a mistake — or if you ever want to come back — reactivating takes less than 5 minutes. Everything is ready for you.</p>
      </td></tr>

      <tr><td style="height:24px;"></td></tr>
      <tr><td align="center"><a href="https://voicebotai.us/pricing" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 36px;border-radius:10px;font-weight:800;font-size:15px;">Resubscribe →</a></td></tr>

      <tr><td style="height:24px;"></td></tr>

      <tr><td style="background:#0a0d14;border:1px solid #141b26;border-radius:10px;padding:20px 24px;text-align:center;">
        <p style="margin:0 0 4px;color:#475569;font-size:13px;">Still have questions about why you cancelled?</p>
        <p style="margin:0;color:#334155;font-size:12px;">Reply to this email — we read every message.</p>
      </td></tr>

      <tr><td style="padding-top:32px;">
        <p style="margin:24px 0 4px;color:#334155;font-size:12px;text-align:center;">VoiceBot AI — Never miss a client call again.</p>
        <p style="margin:0;color:#1e293b;font-size:12px;text-align:center;">You can unsubscribe from transactional emails by replying to this message.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;
}

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
            from: 'VoiceBot AI <hello@voicebotai.us>',
            to: client.email,
            subject: `+${extraMinutes} minutes added to your account ✅`,
            html: emailExtraMinutes({ extraMinutes, currentExtra, businessName: client.business_name }),
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
              from: 'VoiceBot AI <hello@voicebotai.us>',
              to: client.email,
              subject: 'Your new VoiceBot number is active ✅',
              html: emailAdditionalNumber({ newNumber, businessName: client.business_name }),
            });
          }
          console.log(`✅ New number ${newNumber} added for ${userId}`);
        }
        return NextResponse.json({ received: true });
      }

      const plan = PLAN_MAP[activePriceId] || 'starter';
const customerEmail = session.customer_details?.email || session.customer_email;

// Fetch client by email (more reliable than user_id)
const { data: client } = await supabase
  .from('clients')
  .select('twilio_number, email, business_name')
  .eq('email', customerEmail)
  .maybeSingle();

let twilioNumber = client?.twilio_number;
if (!twilioNumber) {
  twilioNumber = await buyTwilioNumber();
}

const { data: updateData, error: updateError } = await supabase
  .from('clients')
  .update({
    plan,
    user_id: userId,
    stripe_customer_id: session.customer,
    stripe_subscription_id: session.subscription,
    ...(twilioNumber && { twilio_number: twilioNumber }),
  })
  .eq('email', customerEmail);

console.log('Update result:', JSON.stringify({ updateData, updateError, customerEmail, plan }));

if (client?.email) {
        await resend.emails.send({
          from: 'VoiceBot AI <hello@voicebotai.us>',
          to: client.email,
          subject: 'Your VoiceBot is now active ✅',
          html: emailActivation({ plan, twilioNumber, businessName: client.business_name }),
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
        from: 'VoiceBot AI <hello@voicebotai.us>',
        to: client.email,
        subject: 'Your VoiceBot subscription has been cancelled',
        html: emailCancellation(),
      });
    }

    await supabase
      .from('clients')
      .update({ plan: null, twilio_number: null, twilio_numbers: [], extra_minutes: 0 })
      .eq('stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}