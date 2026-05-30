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

function RoiCalculator({ router }) {
  const [calls, setCalls] = useState(30);
  const [clientValue, setClientValue] = useState(200);

  const missed = Math.round(calls * 4 * 0.35);
  const lostRevenue = missed * clientValue;
  const recommended = lostRevenue < 5000 ? 'Starter' : lostRevenue < 15000 ? 'Scale' : 'Business';
  const recommendedPrice = lostRevenue < 5000 ? '$229' : lostRevenue < 15000 ? '$459' : '$879';

  return (
    <div className="roi-wrap">
      <div className="roi-card">
        <p className="eyebrow">Find your plan</p>
        <h2 className="section-title">How much are you losing?</h2>
        <p className="section-subtitle">Answer 2 questions. We'll recommend the right plan.</p>

        <div className="slider-group">
          <div>
            <div className="slider-label-row">
              <label>Calls per week</label>
              <span>{calls}</span>
            </div>
            <input type="range" min="5" max="200" value={calls} onChange={(e) => setCalls(Number(e.target.value))} />
            <div className="range-values"><span>5</span><span>200</span></div>
          </div>

          <div>
            <div className="slider-label-row">
              <label>Average client value</label>
              <span>${clientValue}</span>
            </div>
            <input type="range" min="50" max="1000" step="50" value={clientValue} onChange={(e) => setClientValue(Number(e.target.value))} />
            <div className="range-values"><span>$50</span><span>$1,000</span></div>
          </div>
        </div>

        <div className="roi-result-card">
          <div className="roi-result-grid">
            <div className="loss-box">
              <div>{missed}</div>
              <span>Missed calls/month</span>
            </div>
            <div className="loss-box">
              <div>${lostRevenue.toLocaleString()}</div>
              <span>Lost revenue/month</span>
            </div>
          </div>

          <div className="recommended-box">
            <p>Recommended plan for you</p>
            <strong>{recommended} — {recommendedPrice}/mo</strong>
            <span>vs ${lostRevenue.toLocaleString()} in lost revenue</span>
          </div>
        </div>

        <button className="primary-btn" onClick={() => router.push('/register')}>
          Get started with {recommended} →
        </button>
      </div>
    </div>
  );
}

function PlanCarousel({ plans, getButtonState, handleSubscribe, loading, C }) {
  const [current, setCurrent] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [slide, setSlide] = useState('');

  const go = (dir) => {
    if (animating) return;
    const next = current + dir;
    if (next < 0 || next >= plans.length) return;
    setSlide(dir > 0 ? 'slide-left' : 'slide-right');
    setAnimating(true);
    setTimeout(() => {
      setCurrent(next);
      setSlide('');
      setAnimating(false);
    }, 300);
  };

  const plan = plans[current];
  const btn = getButtonState(plan.key);
  const isCurrent = btn.style === 'current';
  const isPopular = plan.popular && !isCurrent;
  const btnBg = isCurrent ? C.bgSecondary : btn.style === 'upgrade' ? C.accent : btn.style === 'downgrade' ? C.bg : isPopular ? C.accent : C.text;
  const btnColor = (isCurrent || btn.style === 'downgrade') ? C.textMuted : '#fff';
  const btnBorder = (isCurrent || btn.style === 'downgrade') ? `1px solid ${C.border}` : 'none';

  return (
    <>
      {/* DESKTOP */}
      <div className="plans">
        {plans.map((p) => {
          const b = getButtonState(p.key);
          const isc = b.style === 'current';
          const isp = p.popular && !isc;
          const bg = isc ? C.bgSecondary : b.style === 'upgrade' ? C.accent : b.style === 'downgrade' ? C.bg : isp ? C.accent : C.text;
          const col = (isc || b.style === 'downgrade') ? C.textMuted : '#fff';
          const bor = (isc || b.style === 'downgrade') ? `1px solid ${C.border}` : 'none';
          return (
            <div key={p.name} className="plan-card" style={{ border: isc ? '2px solid #22c55e' : isp ? `2px solid ${C.accent}` : `1px solid ${C.border}`, opacity: b.style === 'downgrade' ? 0.55 : 1 }}>
              {isc && <div className="plan-tag" style={{ background: '#22c55e' }}>CURRENT PLAN</div>}
              {isp && <div className="plan-tag" style={{ background: C.accent }}>MOST POPULAR</div>}
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: C.text }}>{p.name}</h2>
              <p style={{ fontSize: '0.82rem', color: C.textMuted, marginBottom: '14px' }}>{p.desc}</p>
              <div style={{ fontSize: '2.8rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: C.text, marginBottom: '20px' }}>{p.price}<span style={{ fontSize: '0.9rem', color: C.textMuted, fontWeight: 400 }}>/mo</span></div>
              <p style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginBottom: '16px' }}>7-day free trial · No charge until day 8</p>
              <div style={{ height: '1px', background: C.border, margin: '0 0 20px' }} />
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {p.features.map((f) => (
                  <li key={f} style={{ fontSize: '0.85rem', color: C.textSecondary, display: 'flex', alignItems: 'flex-start', gap: '10px', lineHeight: 1.4 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: isp ? '#ede9fe' : '#f0fdf4', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={isp ? C.accent : '#16a34a'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => !b.disabled && handleSubscribe(p.priceId, p.name)} disabled={b.disabled || loading === p.name} style={{ width: '100%', padding: '12px', background: bg, color: col, border: bor, borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: b.disabled ? 'default' : 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                {loading === p.name ? 'Loading...' : b.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* MOBILE CAROUSEL */}
      <div className="plans-carousel">
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {plans.map((_, i) => (
            <button key={i} onClick={() => { if (i !== current) go(i > current ? 1 : -1); }} style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '100px', background: i === current ? C.accent : '#e5e7eb', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', padding: 0 }} />
          ))}
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div className={`carousel-inner ${slide}`}>
            <div className="plan-card" style={{ width: '100%', border: isCurrent ? '2px solid #22c55e' : isPopular ? `2px solid ${C.accent}` : `1px solid ${C.border}`, opacity: btn.style === 'downgrade' ? 0.55 : 1 }}>
              {isCurrent && <div className="plan-tag" style={{ background: '#22c55e' }}>CURRENT PLAN</div>}
              {isPopular && <div className="plan-tag" style={{ background: C.accent }}>MOST POPULAR</div>}
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px', color: C.text }}>{plan.name}</h2>
              <p style={{ fontSize: '0.82rem', color: C.textMuted, marginBottom: '14px' }}>{plan.desc}</p>
              <div style={{ fontSize: '2.8rem', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, color: C.text, marginBottom: '20px' }}>{plan.price}<span style={{ fontSize: '0.9rem', color: C.textMuted, fontWeight: 400 }}>/mo</span></div>
              <p style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginBottom: '16px' }}>7-day free trial · No charge until day 8</p>
              <div style={{ height: '1px', background: C.border, margin: '0 0 20px' }} />
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '24px' }}>
          <button onClick={() => go(-1)} disabled={current === 0} style={{ width: '44px', height: '44px', borderRadius: '50%', background: current === 0 ? '#f3f4f6' : C.accent, border: 'none', cursor: current === 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={current === 0 ? '#9ca3af' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text, minWidth: '80px', textAlign: 'center' }}>{plan.name}</span>
          <button onClick={() => go(1)} disabled={current === plans.length - 1} style={{ width: '44px', height: '44px', borderRadius: '50%', background: current === plans.length - 1 ? '#f3f4f6' : C.accent, border: 'none', cursor: current === plans.length - 1 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={current === plans.length - 1 ? '#9ca3af' : '#fff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <style>{`
        .plans-carousel { display: none; padding: 0 16px 48px; }
        .carousel-inner { transition: transform 0.3s ease, opacity 0.3s ease; }
        .slide-left { transform: translateX(-30px); opacity: 0; }
        .slide-right { transform: translateX(30px); opacity: 0; }
        @media (max-width: 640px) {
          .plans { display: none; }
          .plans-carousel { display: block; }
        }
      `}</style>
    </>
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
        const { data } = await supabase
          .from('clients')
          .select('business_name, plan')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (data) setClientData(data);
      }
    };

    loadUser();
  }, []);

  const handleSubscribe = async (priceId, planName) => {
    setLoading(planName);

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/register');
        setLoading(null);
        return;
      }

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
    <div className="pricing-page">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          overflow-x: hidden;
        }

        .pricing-page {
          min-height: 100vh;
          background: ${C.bg};
          color: ${C.text};
          font-family: 'DM Sans', system-ui, sans-serif;
          overflow-x: hidden;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 48px;
          border-bottom: 1px solid ${C.border};
          position: sticky;
          top: 0;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
          z-index: 100;
        }

        .brand {
          font-weight: 700;
          font-size: 1.05rem;
          color: ${C.text};
          text-decoration: none;
          letter-spacing: -0.02em;
        }

        .nav-right {
          display: flex;
          gap: 8px;
          align-items: center;
          min-width: 0;
        }

        .nav-user {
          color: ${C.textMuted};
          font-size: 0.85rem;
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .nav-btn {
          background: ${C.text};
          color: #fff;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          white-space: nowrap;
        }

        .signin-link {
          color: ${C.textSecondary};
          text-decoration: none;
          font-size: 0.85rem;
        }

        .hero {
          text-align: center;
          padding: 72px 20px 48px;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ede9fe;
          border: 1px solid #c4b5fd;
          border-radius: 100px;
          padding: 5px 16px;
          font-size: 0.78rem;
          color: ${C.accent};
          font-weight: 600;
          margin-bottom: 24px;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
        }

        .hero h1 {
          font-size: clamp(2rem, 4.5vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.04em;
          margin: 0 0 14px;
        }

        .hero p,
        .section-subtitle {
          color: ${C.textSecondary};
          font-size: 0.95rem;
          max-width: 460px;
          margin: 0 auto;
        }

        .stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          padding: 24px 20px 56px;
          flex-wrap: wrap;
          border-bottom: 1px solid ${C.border};
          background: ${C.bgSecondary};
          margin-bottom: 56px;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.03em;
        }

        .stat-label {
          font-size: 0.78rem;
          color: ${C.textMuted};
          margin-top: 2px;
        }

        .roi-wrap {
          max-width: 680px;
          margin: 0 auto 64px;
          padding: 0 20px;
        }

        .roi-card {
          background: #f9f8ff;
          border: 1px solid #e0e7ff;
          border-radius: 20px;
          padding: 40px;
        }

        .eyebrow {
          font-size: 0.78rem;
          font-weight: 700;
          color: ${C.accent};
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0 0 8px;
          text-align: center;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.03em;
          margin: 0 0 8px;
          color: ${C.text};
          text-align: center;
        }

        .slider-group {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin: 32px 0;
        }

        .slider-label-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 10px;
        }

        .slider-label-row label {
          font-size: 0.875rem;
          font-weight: 600;
        }

        .slider-label-row span {
          font-size: 0.875rem;
          font-weight: 700;
          color: ${C.accent};
        }

        input[type='range'] {
          width: 100%;
          accent-color: ${C.accent};
          height: 6px;
          cursor: pointer;
        }

        .range-values {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          font-size: 0.72rem;
          color: ${C.textMuted};
        }

        .roi-result-card {
          background: #fff;
          border: 1px solid #e0e7ff;
          border-radius: 14px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .roi-result-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }

        .loss-box {
          text-align: center;
          padding: 16px;
          background: #fff5f5;
          border-radius: 10px;
          min-width: 0;
        }

        .loss-box div {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ef4444;
          word-break: break-word;
        }

        .loss-box span {
          display: block;
          font-size: 0.72rem;
          color: ${C.textMuted};
          margin-top: 4px;
        }

        .recommended-box {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }

        .recommended-box p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.78rem;
          margin: 0 0 4px;
        }

        .recommended-box strong {
          display: block;
          color: #fff;
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .recommended-box span {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
        }

        .primary-btn {
          width: 100%;
          padding: 13px;
          background: ${C.accent};
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .plans {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 20px 64px;
        }

        .plan-card {
          background: ${C.bgCard};
          border-radius: 16px;
          padding: 32px 28px;
          width: 300px;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .plan-tag {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          color: #fff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 4px 14px;
          border-radius: 100px;
          white-space: nowrap;
        }

        .addons,
        .faq {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        .faq {
          max-width: 680px;
          padding-inline: 24px;
        }

        .final-cta {
  margin: 0 auto 80px;
  background: ${C.text};
  border-radius: 20px;
  text-align: center;
  padding: 64px 40px;
  max-width: 1060px;
  width: calc(100% - 40px);
}

        .footer {
          border-top: 1px solid ${C.border};
          padding: 32px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .nav {
            padding: 14px 16px;
            gap: 12px;
          }

          .brand {
            font-size: 1rem;
            max-width: 118px;
            line-height: 1.05;
          }

          .nav-user {
            max-width: 96px;
            font-size: 0.78rem;
          }

          .nav-btn {
            padding: 8px 12px;
            font-size: 0.8rem;
          }

          .hero {
            padding: 42px 16px 34px;
          }

          .hero h1 {
            font-size: 2rem;
            line-height: 1.08;
          }

          .hero p,
          .section-subtitle {
            font-size: 0.88rem;
          }

          .stats {
            gap: 18px;
            padding: 20px 12px 36px;
            margin-bottom: 40px;
          }

          .stat {
            flex: 1 1 80px;
          }

          .stat-value {
            font-size: 1.35rem;
          }

          .roi-wrap {
            padding: 0 14px;
            margin-bottom: 48px;
          }

          .roi-card {
            padding: 24px 16px;
            border-radius: 18px;
          }

          .section-title {
            font-size: 1.35rem;
          }

          .slider-label-row {
            align-items: flex-start;
          }

          .slider-label-row label {
            max-width: 62%;
            line-height: 1.3;
          }

          .roi-result-card {
            padding: 14px;
          }

          .roi-result-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .loss-box {
            padding: 18px 12px;
          }

          .loss-box div {
            font-size: 2rem;
          }

          .recommended-box {
            padding: 18px 14px;
          }

          .recommended-box strong {
            font-size: 1.45rem;
            line-height: 1.2;
          }

          .plans {
            padding: 0 14px 56px;
          }

          .plan-card {
            width: 100%;
            max-width: 380px;
            padding: 30px 22px;
          }

          .addons {
            padding: 0 14px 64px;
          }

          .addons-table {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .addons-grid {
  min-width: unset;
  grid-template-columns: 1fr 1fr 1fr;
  font-size: 0.8rem;
}

          .faq {
            padding: 0 18px 64px;
          }

          .final-cta {
  margin: 0 14px 64px;
  padding: 42px 22px;
  border-radius: 18px;
  width: auto;
}

          .footer {
            padding: 28px 18px;
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>

      <nav className="nav">
        <Link href="/" className="brand">VoiceBot AI</Link>

        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">{clientData?.business_name || user.email}</span>
              <Link href="/dashboard" className="nav-btn">Dashboard</Link>
            </>
          ) : (
            <Link href="/login" className="signin-link">Sign in</Link>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="badge">
          <span className="badge-dot" />
          Simple, transparent pricing
        </div>

        <h1>
          The AI that answers every call,<br />automatically.
        </h1>

        <p>No hidden fees. No long-term contracts. Cancel anytime.</p>
      </section>

      <div className="stats">
        {[
          { value: '99.9%', label: 'Uptime SLA' },
          { value: '<1s', label: 'Response time' },
          { value: '24/7', label: 'Always available' },
        ].map((s) => (
          <div key={s.label} className="stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <RoiCalculator router={router} />

      <div className="plans-wrapper">
<PlanCarousel plans={plans} getButtonState={getButtonState} handleSubscribe={handleSubscribe} loading={loading} C={C} />
</div>

      <div className="addons">
        <p className="eyebrow">Add-ons</p>
        <h2 className="section-title">Need more minutes?</h2>
        <p className="section-subtitle" style={{ marginBottom: '32px' }}>
          Buy extra anytime from your dashboard. Business plan gets the best rates.
        </p>

        <div className="addons-table" style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div className="addons-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '14px 24px', borderBottom: `1px solid ${C.border}`, background: C.bgSecondary }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pack</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Starter & Scale</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Business</span>
          </div>

          {[
            { label: '500 minutes', starter: '$25', business: '$20', saving: 'Save $5' },
            { label: '1,000 minutes', starter: '$45', business: '$35', saving: 'Save $10' },
            { label: '2,000 minutes', starter: '$70', business: '$60', saving: 'Save $10' },
          ].map((pack, i) => (
            <div key={pack.label} className="addons-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', padding: '16px 24px', borderBottom: i < 2 ? `1px solid ${C.border}` : 'none', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{pack.label}</span>
              <span style={{ fontSize: '0.9rem', color: C.textMuted, textAlign: 'center', fontWeight: 500 }}>{pack.starter}</span>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: '#d97706', fontWeight: 700 }}>{pack.business}</span>
                <span style={{ fontSize: '0.7rem', color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '2px 7px', borderRadius: '100px', fontWeight: 600 }}>{pack.saving}</span>
              </div>
            </div>
          ))}

          <div style={{ padding: '14px 24px', background: '#f9f8ff', borderTop: `1px solid ${C.border}`, textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: C.textMuted, margin: 0 }}>
              Available from your <span style={{ color: C.text, fontWeight: 600 }}>Billing</span> page after subscribing.
            </p>
          </div>
        </div>
      </div>

      <div className="faq">
        <p className="eyebrow">FAQ</p>
        <h2 className="section-title">Common questions</h2>
        <p className="section-subtitle" style={{ marginBottom: '36px' }}>
          Everything you need to know before getting started.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
              >
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

      <div className="final-cta">
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px', color: '#fff' }}>
          Ready to never miss a call again?
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: '28px', fontSize: '0.9rem' }}>
          Start free for 7 days. No charge until day 8. Cancel anytime.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => router.push('/register')} style={{ background: '#fff', color: C.text, border: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            Start now
          </button>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', color: '#9ca3af', border: '1px solid #333', fontWeight: 500, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            Sign in
          </button>
        </div>
      </div>

      <footer className="footer">
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: C.text }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Home', href: '/' },
            { label: 'Sign in', href: '/login' },
            { label: 'Sign up', href: '/register' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
          ].map((l) => (
            <Link key={l.label} href={l.href} style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>{l.label}</Link>
          ))}
        </div>
        <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>2026 VoiceBot AI</span>
      </footer>
    </div>
  );
}