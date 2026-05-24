import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PLAN_PRICES = {
  starter: { priceId: 'price_1TZI4xFbv1QHIqBxM1ogpacl' },
  scale: { priceId: 'price_1TZI51Fbv1QHIqBxfvYIkKRh' },
  business: { priceId: 'price_1TZI51Fbv1QHIqBxmfldnApH' },
};

const PLAN_RANK = { starter: 1, scale: 2, business: 3 };

export async function POST(req) {
  try {
    const { userId, targetPlan } = await req.json();

    const { data: client } = await supabase
      .from('clients')
      .select('stripe_subscription_id, plan')
      .eq('user_id', userId)
      .maybeSingle();

    if (!client?.stripe_subscription_id) {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(client.stripe_subscription_id);
    const targetPriceId = PLAN_PRICES[targetPlan].priceId;
    const isUpgrade = PLAN_RANK[targetPlan] > PLAN_RANK[client.plan];

    await stripe.subscriptions.update(client.stripe_subscription_id, {
      items: [{
        id: subscription.items.data[0].id,
        price: targetPriceId,
      }],
      proration_behavior: isUpgrade ? 'create_prorations' : 'none',
      billing_cycle_anchor: isUpgrade ? 'now' : undefined,
      ...(isUpgrade ? {} : { cancel_at_period_end: false }),
    });

    // Mise à jour immédiate du plan dans Supabase pour l'upgrade
    if (isUpgrade) {
      await supabase
        .from('clients')
        .update({ plan: targetPlan })
        .eq('user_id', userId);
    }
    // Pour le downgrade, le webhook customer.subscription.updated s'en charge à la fin de période

    return NextResponse.json({ success: true, isUpgrade });
  } catch (err) {
    console.error('Change plan error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}