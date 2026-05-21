import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const PLAN_MAP = {
  'price_1TZI4xFbv1QHIqBxM1ogpacl': 'starter',
  'price_1TZI51Fbv1QHIqBxfvYIkKRh': 'scale',
  'price_1TZI51Fbv1QHIqBxmfldnApH': 'business',
};

async function buyTwilioNumber() {
  try {
    // Chercher un numéro US disponible
    const available = await twilioClient.availablePhoneNumbers('US')
      .local
      .list({ voiceEnabled: true, limit: 1 });

    if (!available.length) {
      console.error('No US numbers available');
      return null;
    }

    // Acheter le numéro
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
      .select('twilio_number')
      .eq('user_id', userId)
      .maybeSingle();

    let twilioNumber = client?.twilio_number;

    // Acheter un numéro si pas encore assigné
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

    console.log(`✅ Client ${userId} assigned plan ${plan} with number ${twilioNumber}`);
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object;
    const customerId = subscription.customer;

    // Récupérer le numéro du client pour le libérer
    const { data: client } = await supabase
      .from('clients')
      .select('twilio_number')
      .eq('stripe_customer_id', customerId)
      .maybeSingle();

    if (client?.twilio_number) {
      await releaseTwilioNumber(client.twilio_number);
    }

    await supabase
      .from('clients')
      .update({ plan: null, twilio_number: null })
      .eq('stripe_customer_id', customerId);
  }

  return NextResponse.json({ received: true });
}