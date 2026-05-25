import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const TRIAL_EMAILS = [
  // Ajoute ici l'email du client test
  'maisonlni30@gmail.com',
];

export async function POST(req) {
  try {
    const { priceId, userId, userEmail } = await req.json();

    console.log('Checkout attempt:', { priceId, userId, userEmail });

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing priceId or userId' }, { status: 400 });
    }

    const isTrial = userEmail && TRIAL_EMAILS.includes(userEmail.toLowerCase());

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      ...(userEmail && { customer_email: userEmail }),
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: isTrial ? { trial_period_days: 7 } : undefined,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: { userId },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}