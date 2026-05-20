'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const plans = [
  {
    name: 'Starter Plan',
    price: '$229',
    priceId: 'price_1TZI4xFbv1QHIqBxM1ogpacl',
    features: ['500 call minutes/month', '1 Twilio number', 'Google Calendar integration', 'AI call summary', 'Email support'],
  },
  {
    name: 'Scale Plan',
    price: '$459',
    priceId: 'price_1TZI51Fbv1QHIqBxfvYIkKRh',
    features: ['2000 call minutes/month', '3 Twilio numbers', 'Google Calendar integration', 'AI call summary', 'Priority support'],
  },
  {
    name: 'Business Plan',
    price: '$879',
    priceId: 'price_1TZI51Fbv1QHIqBxmfldnApH',
    features: ['6000 call minutes/month', '10 Twilio numbers', 'Google Calendar integration', 'AI call summary', 'Dedicated account manager', 'Advanced analytics'],
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState(null);
  const router = useRouter();

  const handleSubscribe = async (priceId, planName) => {
    setLoading(planName);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId: user.id, userEmail: user.email }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '60px 20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '10px' }}>Choose Your Plan</h1>
      <p style={{ textAlign: 'center', color: '#888', marginBottom: '50px' }}>Scale your business with AI-powered voice automation</p>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto' }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{ background: '#111', border: '1px solid #222', borderRadius: '16px', padding: '40px', width: '300px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '10px' }}>{plan.name}</h2>
            <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '30px' }}>{plan.price}<span style={{ fontSize: '1rem', color: '#888' }}>/mo</span></p>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '30px' }}>
              {plan.features.map((f) => (
                <li key={f} style={{ marginBottom: '10px', color: '#ccc' }}>✓ {f}</li>
              ))}
            </ul>
            <button
              onClick={() => handleSubscribe(plan.priceId, plan.name)}
              disabled={loading === plan.name}
              style={{ width: '100%', padding: '14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer' }}
            >
              {loading === plan.name ? 'Loading...' : 'Get Started'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}