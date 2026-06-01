import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_MAP = {
  'price_1TZI4xFbv1QHIqBxM1ogpacl': 'starter',
  'price_1TZI51Fbv1QHIqBxfvYIkKRh': 'scale',
  'price_1TZI51Fbv1QHIqBxmfldnApH': 'business',
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription.items.data.price'],
    });

    const priceId = session.subscription?.items?.data[0]?.price?.id;
    const plan = PLAN_MAP[priceId] || 'starter';

    return NextResponse.json({ plan });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}