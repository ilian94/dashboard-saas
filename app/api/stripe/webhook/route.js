import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
        <p style="margin:0;color:#64748b;font-size:15px;line-height:1.6;">Hi ${businessName || 'there'} — your AI receptionist is now answering calls 24/7.</p>
      </td></tr>
      <tr><td style="height:24px;"></td></tr>
      <tr><td align="center"><a href="https://voicebotai.us/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 36px;border-radius:10px;font-weight:800;font-size:15px;">Open Dashboard →</a></td></tr>
      <tr><td style="padding-top:32px;">
        <p style="margin:24px 0 4px;color:#334155;font-size:12px;text-align:center;">VoiceBot AI — Never miss a client call again.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function emailExtraMinutes({ extraMinutes, currentExtra, businessName }) {
  const total = currentExtra + extraMinutes;
  return `<!DOCTYPE html><html><body style="background:#080b12;font-family:sans-serif;padding:40px;">
<h1 style="color:#4ade80;">+${extraMinutes} minutes added</h1>
<p style="color:#64748b;">Hi ${businessName || 'there'} — ${total} extra minutes total available.</p>
<a href="https://voicebotai.us/dashboard" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Open Dashboard</a>
</body></html>`;
}

function emailCancellation() {
  return `<!DOCTYPE html><html><body style="background:#080b12;font-family:sans-serif;padding:40px;">
<h1 style="color:#f8fafc;">We're sorry to see you go.</h1>
<p style="color:#64748b;">Your VoiceBot has been deactivated.</p>
<a href="https://voicebotai.us/pricing" style="background:#6366f1;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Resubscribe →</a>
</body></html>`;
}

// Helper pour update Supabase via REST direct (bypass client JS)
async function supabaseUpdate(table, payload, filterKey, filterValue) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?${filterKey}=eq.${encodeURIComponent(filterValue)}`;
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  return data;
}

// Helper pour select Supabase via REST direct
async function supabaseSelect(table, filterKey, filterValue, columns = '*') {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${table}?${filterKey}=eq.${encodeURIComponent(filterValue)}&select=${columns}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'apikey': process.env.SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    },
  });
  const data = await res.json();
  return data?.[0] || null;
}

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

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
    const customerEmail = session.customer_details?.email || session.customer_email;
    const mode = session.mode;

    if (mode === 'payment') {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const priceId = lineItems.data[0]?.price?.id;
      const extraMinutes = EXTRA_MINUTES_MAP[priceId];

      if (extraMinutes) {
        const client = await supabaseSelect('clients', 'user_id', userId, 'extra_minutes,email,business_name');
        const currentExtra = client?.extra_minutes || 0;
        await supabaseUpdate('clients', { extra_minutes: currentExtra + extraMinutes }, 'user_id', userId);

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
        return NextResponse.json({ received: true });
      }

      const plan = PLAN_MAP[activePriceId] || 'starter';

      // Fetch client par user_id d'abord, sinon par email
      let client = await supabaseSelect('clients', 'user_id', userId, 'twilio_number,email,business_name');
      if (!client && customerEmail) {
        client = await supabaseSelect('clients', 'email', customerEmail, 'twilio_number,email,business_name');
      }

      const updatePayload = {
        plan,
        user_id: userId,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
      };

      // Update par user_id d'abord
      const updateResult = await supabaseUpdate('clients', updatePayload, 'user_id', userId);
      console.log('Update by user_id result:', JSON.stringify(updateResult));

      // Si vide, update par email
      if (!updateResult || updateResult.length === 0) {
        const updateByEmail = await supabaseUpdate('clients', updatePayload, 'email', customerEmail);
        console.log('Update by email result:', JSON.stringify(updateByEmail));
        console.log(`✅ Updated by email: ${customerEmail} — plan: ${plan}`);
      } else {
        console.log(`✅ Updated by user_id: ${userId} — plan: ${plan}`);
      }

      if (client?.email) {
        await resend.emails.send({
          from: 'VoiceBot AI <hello@voicebotai.us>',
          to: client.email,
          subject: 'Your VoiceBot is now active ✅',
          html: emailActivation({ plan, twilioNumber: client?.twilio_number, businessName: client.business_name }),
        });
      }
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object;
    const customerId = subscription.customer;
    const newPriceId = subscription.items.data[0]?.price?.id;
    const newPlan = PLAN_MAP[newPriceId];

    if (newPlan) {
      await supabaseUpdate('clients', { plan: newPlan }, 'stripe_customer_id', customerId);
      console.log(`✅ Plan updated to ${newPlan} for customer ${customerId}`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    const client = await supabaseSelect('clients', 'stripe_customer_id', customerId, 'email');

    if (client?.email) {
      await resend.emails.send({
        from: 'VoiceBot AI <hello@voicebotai.us>',
        to: client.email,
        subject: 'Your VoiceBot subscription has been cancelled',
        html: emailCancellation(),
      });
    }

    await supabaseUpdate('clients', { plan: null, twilio_number: null, twilio_numbers: [], extra_minutes: 0 }, 'stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}