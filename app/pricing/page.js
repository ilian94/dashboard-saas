'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const supabase = createClient();

const C = {
  bg: '#ffffff',
  bgSecondary: '#f9fafb',
  bgCard: '#ffffff',
  border: '#e5e7eb',
  text: '#0f0f0f',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  accent: '#6366f1',
};

const plans = [
  {
    name: 'Starter',
    key: 'starter',
    price: '$229',
    desc: 'Perfect for small businesses.',
    priceId: 'price_1TZI4xFbv1QHIqBxM1ogpacl',
    features: [
      '500 call minutes/month',
      '1 phone number',
      'Google Calendar sync',
      'AI call summaries',
      '24/7 availability',
      'Instant response (<1s)',
      'Email support',
      'Extra minutes from $25',
    ],
  },
  {
    name: 'Scale',
    key: 'scale',
    price: '$459',
    desc: 'For growing teams.',
    priceId: 'price_1TZI51Fbv1QHIqBxfvYIkKRh',
    popular: true,
    features: [
      '2,000 call minutes/month',
      '1 phone number',
      'Google Calendar sync',
      'AI call summaries',
      '24/7 availability',
      'Instant response (<1s)',
      'Custom business name',
      'Call recording',
      'Appointment modification & cancellation',
      'Calendly integration',
      'Analytics dashboard',
      'Extra minutes from $25',
    ],
  },
  {
    name: 'Business',
    key: 'business',
    price: '$879',
    desc: 'For high-volume operations.',
    priceId: 'price_1TZI51Fbv1QHIqBxmfldnApH',
    features: [
      '6,000 call minutes/month',
      '1 phone number included',
      'Google Calendar sync',
      'AI call summaries',
      '24/7 availability + priority support',
      'Instant response (<1s)',
      'Custom business name',
      'Full script customization',
      'SMS confirmation after booking',
      'Call recording',
      'Advanced analytics dashboard',
      'Appointment modification & cancellation',
      'Calendly integration',
      'Unlimited additional numbers ($15/mo each)',
      'Extra minutes from $20',
    ],
  },
];

const faqs = [
  { q: 'What is a call minute?', a: 'A call minute is 60 seconds of active call time between your AI agent and a caller. Minutes are counted only during live calls, not during setup or idle time.' },
  { q: 'Can I cancel anytime?', a: 'Yes. There are no long-term commitments. You can cancel your subscription at any time from your billing dashboard, effective at the end of your billing period.' },
  { q: 'What happens if I exceed my monthly minutes?', a: 'Your AI agent keeps running. You can purchase extra minute packs directly from your Billing page. Business plan members get the best per-minute rates.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the start of your next billing cycle.' },
  { q: 'Does the AI really answer 24/7?', a: 'Yes. Your VoiceBot AI agent is always on. It handles calls during nights, weekends, and holidays with the same quality as business hours, with an average response time under 1 second.' },
  { q: 'Do you offer a free trial?', a: "Yes! Every plan includes a 7-day free trial. No charge until day 8. Cancel anytime before and you won't be billed." },
];

const PLAN_RANK = { starter: 1, scale: 2, business: 3 };

function RoiCalculator({ router, C }) {
  const [calls, setCalls] = useState(30);
  const [clientValue, setClientValue] = useState(200);
  const missed = Math.round(calls * 4 * 0.35);
  const lostRevenue = missed * clientValue;
  const recommended = lostRevenue < 5000 ? 'Starter' : lostRevenue < 15000 ? 'Scale' : 'Business';
  const recommendedPrice = lostRevenue < 5000 ? '$229' : lostRevenue < 15000 ? '$459' : '$879';

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto 64px', padding: '0 20px' }}>
      <div style={{ background: '#f9f8ff', border: '1px solid #e0e7ff', borderRadius: '20px', padding: '40px' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Find your plan</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px', color: C.text, textAlign: 'center' }}>How much are you losing?</h2>
        <p style={{ color: C.textMuted, fontSize: '0.875rem', marginBottom: '32px', textAlign: 'center' }}>Answer 2 questions. We'll recommend the right plan.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: C.text }}>Calls per week</label>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: C.accent }}>{calls}</span>
            </div>
            <input type="range" min="5" max="200" value={calls} onChange={e => setCalls(Number(e.target.value))} style={{ width: '100%', accentColor: C.accent, height: '6px', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', color: C.textMuted }}><span>5</span><span>200</span></div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: C.text }}>Average client value</label>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: C.accent }}>${clientValue}</span>
            </div>
            <input type="range" min="50" max="1000" step="50" value={clientValue} onChange={e => setClientValue(Number(e.target.value))} style={{ width: '100%', accentColor: C.accent, height: '6px', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', color: C.textMuted }}><span>$50</span><span>$1,000</span></div>
          </div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e0e7ff', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fff5f5', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>{missed}</div>
              <div style={{ fontSize: '0.72rem', color: C.textMuted, marginTop: '4px' }}>Missed calls/month</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fff5f5', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>${lostRevenue.toLocaleString()}</div>
              <div style={{ fontSize: '0.72rem', color: C.textMuted, marginTop: '4px' }}>Lost revenue/month</div>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', marginBottom: '4px' }}>Recommended plan for you</p>
            <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 2px' }}>{recommended} — {recommendedPrice}/mo</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: 0 }}>vs ${lostRevenue.toLocaleString()} in lost revenue</p>
          </div>
        </div>
        <button onClick={() => router.push('/register')} style={{ width: '100%', padding: '13px', background: C.accent, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Get started with {recommended} →
        </button>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [loading, setLoading] = useState(null);
  const [user, setUser] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
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
    if (!clientData?.plan) return { label: 'Get started', disabled: false, style: 'normal' };
    const currentRank = PLAN_RANK[clientData.plan];
    const targetRank = PLAN_RANK[planKey];
    if (planKey === clientData.plan) return { label: 'Current plan', disabled: true, style: 'current' };
    if (targetRank > currentRank) return { label: 'Upgrade', disabled: false, style: 'upgrade' };
    return { label: 'Downgrade', disabled: false, style: 'downgrade' };
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: '1.05rem', color: C.text, textDecoration: 'none', letterSpacing: '-0.02em' }}>VoiceBot AI</Link>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: C.textMuted, fontSize: '0.85rem' }}>{clientData?.business_name || user.email}</span>
              <Link href="/dashboard" style={{ background: C.text, color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '8px 16px', borderRadius: '8px' }}>Dashboard</Link>
            </>
          ) : (
            <Link href="/login" style={{ color: C.textSecondary, textDecoration: 'none', fontSize: '0.85rem' }}>Sign in</Link>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '72px 20px 48px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: '100px', padding: '5px 16px', fontSize: '0.78rem', color: C.accent, fontWeight: 600, marginBottom: '24px' }}>
          <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
          Simple, transparent pricing
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '14px', color: C.text }}>
          The AI that answers every call,<br />automatically.
        </h1>
        <p style={{ color: C.textSecondary, fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto' }}>No hidden fees. No long-term contracts. Cancel anytime.</p>
      </section>

      {/* STATS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', padding: '24px 20px 56px', flexWrap: 'wrap', borderBottom: `1px solid ${C.border}`, background: C.bgSecondary, marginBottom: '56px' }}>
        {[
          { value: '99.9%', label: 'Uptime SLA' },
          { value: '<1s', label: 'Response time' },
          { value: '24/7', label: 'Always available' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: C.text, letterSpacing: '-0.03em' }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: C.textMuted, marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* ROI CALCULATOR */}
{(() => {
  const [calls, setCalls] = useState(30);
  const [clientValue, setClientValue] = useState(200);
  const missed = Math.round(calls * 4 * 0.35);
  const lostRevenue = missed * clientValue;
  const recommended = lostRevenue < 5000 ? 'Starter' : lostRevenue < 15000 ? 'Scale' : 'Business';
  const recommendedPrice = lostRevenue < 5000 ? '$229' : lostRevenue < 15000 ? '$459' : '$879';

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto 64px', padding: '0 20px' }}>
      <div style={{ background: '#f9f8ff', border: '1px solid #e0e7ff', borderRadius: '20px', padding: '40px' }}>
        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>Find your plan</p>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px', color: C.text, textAlign: 'center' }}>How much are you losing?</h2>
        <p style={{ color: C.textMuted, fontSize: '0.875rem', marginBottom: '32px', textAlign: 'center' }}>Answer 2 questions. We'll recommend the right plan.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: C.text }}>Calls per week</label>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: C.accent }}>{calls}</span>
            </div>
            <input type="range" min="5" max="200" value={calls} onChange={e => setCalls(Number(e.target.value))}
              style={{ width: '100%', accentColor: C.accent, height: '6px', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', color: C.textMuted }}>
              <span>5</span><span>200</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: C.text }}>Average client value</label>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: C.accent }}>${clientValue}</span>
            </div>
            <input type="range" min="50" max="1000" step="50" value={clientValue} onChange={e => setClientValue(Number(e.target.value))}
              style={{ width: '100%', accentColor: C.accent, height: '6px', cursor: 'pointer' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.72rem', color: C.textMuted }}>
              <span>$50</span><span>$1,000</span>
            </div>
          </div>
        </div>

<RoiCalculator router={router} C={C} />

        <div style={{ background: '#fff', border: '1px solid #e0e7ff', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fff5f5', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>{missed}</div>
              <div style={{ fontSize: '0.72rem', color: C.textMuted, marginTop: '4px' }}>Missed calls/month</div>
            </div>
            <div style={{ textAlign: 'center', padding: '16px', background: '#fff5f5', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>${lostRevenue.toLocaleString()}</div>
              <div style={{ fontSize: '0.72rem', color: C.textMuted, marginTop: '4px' }}>Lost revenue/month</div>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.78rem', marginBottom: '4px' }}>Recommended plan for you</p>
            <p style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, margin: '0 0 2px' }}>{recommended} — {recommendedPrice}/mo</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', margin: 0 }}>vs ${lostRevenue.toLocaleString()} in lost revenue</p>
          </div>
        </div>

        <button onClick={() => router.push('/register')} style={{ width: '100%', padding: '13px', background: C.accent, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
          Get started with {recommended} →
        </button>
      </div>
    </div>
  );
})()}

      {/* PLANS */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '1060px', margin: '0 auto', padding: '0 20px 64px' }}>
        {plans.map((plan) => {
          const btn = getButtonState(plan.key);
          const isCurrent = btn.style === 'current';
          const isPopular = plan.popular && !isCurrent;
          const btnBg = isCurrent ? C.bgSecondary : btn.style === 'upgrade' ? C.accent : btn.style === 'downgrade' ? C.bg : isPopular ? C.accent : C.text;
          const btnColor = (isCurrent || btn.style === 'downgrade') ? C.textMuted : '#fff';
          const btnBorder = (isCurrent || btn.style === 'downgrade') ? `1px solid ${C.border}` : 'none';

          return (
            <div key={plan.name} style={{ background: C.bgCard, border: isCurrent ? '2px solid #22c55e' : isPopular ? `2px solid ${C.accent}` : `1px solid ${C.border}`, borderRadius: '16px', padding: '32px 28px', width: '300px', position: 'relative', display: 'flex', flexDirection: 'column', opacity: btn.style === 'downgrade' ? 0.55 : 1 }}>
              {isCurrent && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#22c55e', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', whiteSpace: 'nowrap' }}>CURRENT PLAN</div>}
              {isPopular && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: C.accent, color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 14px', borderRadius: '100px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}

              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: C.text }}>{plan.name}</h2>
              <p style={{ fontSize: '0.82rem', color: C.textMuted, marginBottom: '14px' }}>{plan.desc}</p>
              <div style={{ fontSize: '2.8rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: C.text, marginBottom: '20px' }}>
                {plan.price}<span style={{ fontSize: '0.9rem', color: C.textMuted, fontWeight: 400 }}>/mo</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginBottom: '16px' }}>
  7-day free trial · No charge until day 8
</p>

              <div style={{ height: '1px', background: C.border, margin: '0 0 20px' }} />

              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ fontSize: '0.85rem', color: C.textSecondary, display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: 1.4 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: isPopular ? '#ede9fe' : '#f0fdf4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={isPopular ? C.accent : '#16a34a'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <button onClick={() => !btn.disabled && handleSubscribe(plan.priceId, plan.name)} disabled={btn.disabled || loading === plan.name} style={{ width: '100%', padding: '12px', background: btnBg, color: btnColor, border: btnBorder, borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: btn.disabled ? 'default' : 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                {loading === plan.name ? 'Loading...' : btn.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* EXTRA MINUTES */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px 80px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Add-ons</p>
        <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px', color: C.text }}>Need more minutes?</h2>
        <p style={{ textAlign: 'center', color: C.textMuted, fontSize: '0.9rem', marginBottom: '32px' }}>Buy extra anytime from your dashboard. Business plan gets the best rates.</p>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 24px', borderBottom: `1px solid ${C.border}`, background: C.bgSecondary }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pack</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Starter & Scale</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Business</span>
              <span style={{ fontSize: '0.65rem', background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a', padding: '2px 7px', borderRadius: '100px', fontWeight: 700 }}>BEST PRICE</span>
            </div>
          </div>
          {[
            { label: '500 minutes', starter: '$25', business: '$20', saving: 'Save $5' },
            { label: '1,000 minutes', starter: '$45', business: '$35', saving: 'Save $10' },
            { label: '2,000 minutes', starter: '$70', business: '$60', saving: 'Save $10' },
          ].map((pack, i) => (
            <div key={pack.label} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 24px', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: C.text }}>{pack.label}</span>
              <span style={{ fontSize: '0.9rem', color: C.textMuted, textAlign: 'center', fontWeight: 500 }}>{pack.starter}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: '#d97706', fontWeight: 700 }}>{pack.business}</span>
                <span style={{ fontSize: '0.7rem', color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 7px', borderRadius: '100px', fontWeight: 600 }}>{pack.saving}</span>
              </div>
            </div>
          ))}
          <div style={{ padding: '14px 24px', background: '#f9f8ff', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: C.textMuted }}>Available from your <span style={{ color: C.text, fontWeight: 600 }}>Billing</span> page after subscribing.</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 24px 80px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>FAQ</p>
        <h2 style={{ textAlign: 'center', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px', color: C.text }}>Common questions</h2>
        <p style={{ textAlign: 'center', color: C.textMuted, fontSize: '0.9rem', marginBottom: '36px' }}>Everything you need to know before getting started.</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: C.text }}>{faq.q}</span>
                <span style={{ fontSize: '1.2rem', color: C.textMuted, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: '0.875rem', color: C.textSecondary, lineHeight: 1.7, paddingBottom: '20px', margin: 0 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA FINAL */}
      <div style={{ margin: '0 auto 80px', background: C.text, borderRadius: '20px', textAlign: 'center', padding: '64px 40px', maxWidth: '1060px' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px', color: '#fff' }}>Ready to never miss a call again?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '28px', fontSize: '0.9rem' }}>Start free for 7 days. No charge until day 8. Cancel anytime.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/register')} style={{ background: '#fff', color: C.text, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>Start now</button>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #333', fontWeight: 500, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>Sign in</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
          {['7-day free trial', 'No charge until day 8', 'Cancel anytime'].map(t => (
            <span key={t} style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: C.text }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Sign in', href: '/login' },
            { label: 'Sign up', href: '/register' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>{l.label}</Link>
          ))}
        </div>
        <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>2026 VoiceBot AI</span>
      </footer>

    </div>
  );
}