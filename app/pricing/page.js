'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const plans = [
  {
    name: 'Starter',
    price: '$229',
    desc: 'Perfect for small businesses.',
    priceId: 'price_1TZI4xFbv1QHIqBxM1ogpacl',
    features: ['500 call minutes/month', '1 phone number', 'Google Calendar sync', 'AI call summaries', 'Email support'],
  },
  {
    name: 'Scale',
    price: '$459',
    desc: 'For growing teams.',
    priceId: 'price_1TZI51Fbv1QHIqBxfvYIkKRh',
    features: ['2,000 call minutes/month', '3 phone numbers', 'Google Calendar sync', 'AI call summaries', 'Priority support'],
    popular: true,
  },
  {
    name: 'Business',
    price: '$879',
    desc: 'For high-volume operations.',
    priceId: 'price_1TZI51Fbv1QHIqBxmfldnApH',
    features: ['6,000 call minutes/month', '10 phone numbers', 'Google Calendar sync', 'AI call summaries', 'Dedicated account manager', 'Advanced analytics'],
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
    <div style={{ minHeight: '100vh', background: '#080808', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: '1px solid #1a1a1a' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white', textDecoration: 'none', letterSpacing: '-0.02em' }}>VoiceBot AI</Link>
        <Link href="/login" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>Sign in</Link>
      </nav>

      <section style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '16px' }}>Simple, transparent pricing</h1>
        <p style={{ color: '#555', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>No hidden fees. Cancel anytime. Start handling every call automatically.</p>
      </section>

      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto', padding: '0 20px 100px' }}>
        {plans.map((plan) => (
          <div key={plan.name} style={{ background: plan.popular ? '#0f0f1a' : '#0d0d0d', border: plan.popular ? '1px solid #4f46e5' : '1px solid #1a1a1a', borderRadius: '20px', padding: '40px', width: '300px', position: 'relative', display: 'flex', flexDirection: 'column' }}>
            {plan.popular && (
              <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#4f46e5', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                MOST POPULAR
              </div>
            )}
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.01em' }}>{plan.name}</h2>
              <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '16px' }}>{plan.desc}</p>
              <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{plan.price}<span style={{ fontSize: '1rem', color: '#555', fontWeight: 400 }}>/mo</span></div>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              {plan.features.map((f) => (
                <li key={f} style={{ fontSize: '0.875rem', color: '#888', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <button onClick={() => handleSubscribe(plan.priceId, plan.name)} disabled={loading === plan.name}
              style={{ width: '100%', padding: '13px', background: plan.popular ? '#4f46e5' : '#161616', color: 'white', border: plan.popular ? 'none' : '1px solid #2a2a2a', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
              {loading === plan.name ? 'Loading...' : 'Get started →'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}