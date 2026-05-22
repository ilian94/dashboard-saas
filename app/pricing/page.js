'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const supabase = createClient();
const C = { bg: '#0f1117', card: '#161b27', cardPopular: '#161b35', border: '#1e2433', borderPopular: '#4f46e5', text: '#6b7280' };

const plans = [
  { name: 'Starter', key: 'starter', price: '$229', desc: 'Perfect for small businesses.', priceId: 'price_1TZI4xFbv1QHIqBxM1ogpacl', features: ['500 call minutes/month', '1 phone number', 'Google Calendar sync', 'AI call summaries', 'Email support'] },
  { name: 'Scale', key: 'scale', price: '$459', desc: 'For growing teams.', priceId: 'price_1TZI51Fbv1QHIqBxfvYIkKRh', features: ['2,000 call minutes/month', '1 phone number', 'Google Calendar sync', 'AI call summaries', 'Custom business name'], popular: true },
  { name: 'Business', key: 'business', price: '$879', desc: 'For high-volume operations.', priceId: 'price_1TZI51Fbv1QHIqBxmfldnApH', features: ['6,000 call minutes/month', '1 phone number', 'Google Calendar sync', 'AI call summaries', 'Full script customization', 'SMS confirmation after booking', 'Call recording'] },
];

const PLAN_RANK = { starter: 1, scale: 2, business: 3 };

export default function PricingPage() {
  const [loading, setLoading] = useState(null);
  const [user, setUser] = useState(null);
  const [clientData, setClientData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data } = await supabase.from('clients').select('business_name, plan').eq('user_id', authUser.id).maybeSingle();
        if (data) setClientData(data);
      }
    };
    loadUser();
  }, []);

  const handleSubscribe = async (priceId, planName) => {
    setLoading(planName);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { router.push('/register'); setLoading(null); return; }
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: authUser.id, userEmail: authUser.email }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Error:', err);
    }
    setLoading(null);
  };

  const getButtonState = (planKey) => {
    if (!clientData?.plan) return { label: 'Get started →', disabled: false, style: 'normal' };
    const currentRank = PLAN_RANK[clientData.plan];
    const targetRank = PLAN_RANK[planKey];
    if (planKey === clientData.plan) return { label: 'Current plan', disabled: true, style: 'current' };
    if (targetRank > currentRank) return { label: 'Upgrade →', disabled: false, style: 'upgrade' };
    return { label: 'Downgrade', disabled: false, style: 'downgrade' };
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: `1px solid ${C.border}` }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', color: 'white', textDecoration: 'none', letterSpacing: '-0.02em' }}>VoiceBot AI</Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: C.text, fontSize: '0.85rem' }}>{clientData?.business_name || user.email}</span>
              <Link href="/dashboard" style={{ background: 'white', color: 'black', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, padding: '8px 18px', borderRadius: '8px' }}>Dashboard →</Link>
            </>
          ) : (
            <Link href="/login" style={{ color: C.text, textDecoration: 'none', fontSize: '0.9rem' }}>Sign in</Link>
          )}
        </div>
      </nav>
      <section style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '16px' }}>Simple, transparent pricing</h1>
        <p style={{ color: C.text, fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>No hidden fees. Cancel anytime. Start handling every call automatically.</p>
      </section>
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto', padding: '0 20px 100px' }}>
        {plans.map((plan) => {
          const btn = getButtonState(plan.key);
          const isCurrent = btn.style === 'current';

          const buttonBg = isCurrent ? 'transparent'
            : btn.style === 'upgrade' ? '#4f46e5'
            : btn.style === 'downgrade' ? 'transparent'
            : plan.popular ? '#4f46e5' : C.bg;

          const buttonColor = isCurrent ? C.text
            : btn.style === 'downgrade' ? C.text
            : 'white';

          const buttonBorder = isCurrent ? `1px solid ${C.border}`
            : btn.style === 'downgrade' ? `1px solid ${C.border}`
            : btn.style === 'upgrade' ? 'none'
            : plan.popular ? 'none' : `1px solid ${C.border}`;

          return (
            <div key={plan.name} style={{ background: isCurrent ? C.bg : plan.popular ? C.cardPopular : C.card, border: `1px solid ${isCurrent ? '#4ade80' : plan.popular ? C.borderPopular : C.border}`, borderRadius: '20px', padding: '40px', width: '300px', position: 'relative', display: 'flex', flexDirection: 'column', opacity: btn.style === 'downgrade' ? 0.6 : 1 }}>
              {isCurrent && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#4ade80', color: 'black', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>CURRENT PLAN</div>}
              {!isCurrent && plan.popular && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#4f46e5', color: 'white', fontSize: '0.75rem', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', letterSpacing: '-0.01em' }}>{plan.name}</h2>
                <p style={{ fontSize: '0.85rem', color: C.text, marginBottom: '16px' }}>{plan.desc}</p>
                <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1 }}>{plan.price}<span style={{ fontSize: '1rem', color: C.text, fontWeight: 400 }}>/mo</span></div>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: '0.875rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isCurrent ? '#4ade80' : '#4f46e5'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => !btn.disabled && handleSubscribe(plan.priceId, plan.name)}
                disabled={btn.disabled || loading === plan.name}
                style={{ width: '100%', padding: '13px', background: buttonBg, color: buttonColor, border: buttonBorder, borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: btn.disabled ? 'default' : 'pointer' }}
              >
                {loading === plan.name ? 'Loading...' : btn.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}