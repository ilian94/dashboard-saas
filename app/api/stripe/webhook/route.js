import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

const PLAN_MAP = {
  'price_1TZI4xFbv1QHIqBxM1ogpacl': 'starter',
  'price_1TZI51Fbv1QHIqBxfvYIkKRh': 'scale',
  'price_1TZI51Fbv1QHIqBxmfldnApH': 'business',
};

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
    const priceId = session.line_items?.data[0]?.price?.id;

    // Récupérer le priceId depuis la subscription
    const subscription = await stripe.subscriptions.retrieve(session.subscription, {
      expand: ['items.data.price'],
    });
    const activePriceId = subscription.items.data[0].price.id;
    const plan = PLAN_MAP[activePriceId] || 'starter';

    await supabase
      .from('clients')
      .update({ plan, stripe_customer_id: session.customer, stripe_subscription_id: session.subscription })
      .eq('user_id', userId);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    await supabase
      .from('clients')
      .update({ plan: null })
      .eq('stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}