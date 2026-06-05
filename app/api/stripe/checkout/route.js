import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PLAN_PRICE_IDS = [
  'price_1TZI4xFbv1QHIqBxM1ogpacl',
  'price_1TZI51Fbv1QHIqBxfvYIkKRh',
  'price_1TZI51Fbv1QHIqBxmfldnApH',
];

export async function POST(req) {
  try {
    const { priceId, userId, userEmail, mode = 'subscription' } = await req.json();

    console.log('Checkout attempt:', { priceId, userId, userEmail, mode });

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing priceId or userId' }, { status: 400 });
    }

    // Bloquer les doublons uniquement pour un nouveau plan principal
    if (mode === 'subscription' && PLAN_PRICE_IDS.includes(priceId)) {
      const { data: existingClient } = await supabase
        .from('clients')
        .select('plan, stripe_subscription_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingClient?.plan && existingClient?.stripe_subscription_id) {
        return NextResponse.json({ error: 'Already subscribed' }, { status: 400 });
      }
    }

    const sessionConfig = {
      payment_method_types: ['card'],
      mode,
      ...(userEmail && { customer_email: userEmail }),
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { userId },
    };

    // Trial seulement pour les plans principaux
    if (mode === 'subscription' && PLAN_PRICE_IDS.includes(priceId)) {
      sessionConfig.subscription_data = { trial_period_days: 7 };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}