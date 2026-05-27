"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const C = {
  bg: '#ffffff',
  bgSecondary: '#f9fafb',
  bgCard: '#ffffff',
  border: '#e5e7eb',
  borderStrong: '#d1d5db',
  text: '#0f0f0f',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  accent: '#6366f1',
};

const features = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    title: 'Instant Answer',
    desc: 'Your VoiceBot picks up in under 2 seconds, 24/7, including holidays.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: 'Automatic Booking',
    desc: 'Direct sync with Google Calendar. Appointments are booked in real time.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    title: 'Conversational AI',
    desc: 'Powered by Claude AI, the bot understands context and qualifies every lead intelligently.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Call Summaries',
    desc: 'Every call is transcribed and summarized in your dashboard. Nothing slips through.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    title: 'Real-time Alerts',
    desc: 'Get notified instantly when an appointment is booked or a priority lead calls back.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    title: '5-Minute Setup',
    desc: 'Connect your calendar, activate your number, done. No technical skills required.',
  },
];

const faqs = [
  { q: 'How does VoiceBot AI work?', a: 'VoiceBot AI uses Claude AI to answer your incoming calls in real time. When a client calls your number, the bot picks up instantly, understands what they need, and books appointments directly into your Google Calendar.' },
  { q: 'Does it work with my existing phone number?', a: 'Yes. You keep your existing business number and simply forward calls to your VoiceBot number. Setup takes less than 5 minutes â€” no porting required.' },
  { q: 'What languages does it support?', a: 'VoiceBot AI currently supports English. Additional languages are coming soon.' },
  { q: 'What happens when I exceed my monthly minutes?', a: 'When your monthly minutes are used up, the VoiceBot will stop answering calls until the next billing cycle. You can upgrade your plan at any time to get more minutes.' },
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time from your dashboard. Your service will remain active until the end of the current billing period.' },
  { q: 'How long does setup take?', a: 'Most businesses are live within 5 minutes. You just need to connect your Google Calendar, receive your dedicated number, and forward your existing business line to it.' },
  { q: 'Is there a money-back guarantee?', a: 'Yes. We offer a 7-day money-back guarantee for all first-time subscribers. No questions asked.' },
  { q: 'Can I customize what the bot says?', a: "Yes. Scale plan users can customize the business name used in the greeting. Business plan users can fully customize the script, services, questions asked, and the bot's tone and personality â€” all from the dashboard." },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        const { data } = await supabase.from('clients').select('business_name').eq('user_id', authUser.id).maybeSingle();
        if (data) setClientData(data);
      }
    };
    loadUser();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', color: C.text }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {user ? (
            <>
              <Link href="/dashboard" style={{ background: C.text, color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '8px 16px', borderRadius: '8px', whiteSpace: 'nowrap' }}>Dashboard â†’</Link>
              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} style={{ background: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, fontSize: '0.85rem', fontWeight: 500, padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: C.textSecondary, textDecoration: 'none', fontSize: '0.85rem', padding: '8px 12px', whiteSpace: 'nowrap' }}>Sign in</Link>
              <Link href="/pricing" style={{ background: C.text, color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '8px 16px', borderRadius: '8px', whiteSpace: 'nowrap' }}>Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '100px 20px 80px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ede9fe', border: `1px solid #c4b5fd`, borderRadius: '100px', padding: '5px 16px', fontSize: '0.78rem', color: C.accent, fontWeight: 600, marginBottom: '28px', letterSpacing: '0.02em' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
          Powered by Claude AI
        </div>
        <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.04em', marginBottom: '24px', color: C.text }}>
          Never miss a client<br />call again
        </h1>
        <p style={{ fontSize: '1.1rem', color: C.textSecondary, lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 44px' }}>
          VoiceBot AI answers your calls 24/7, books appointments on Google Calendar, and qualifies your leads â€” automatically.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: C.text, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', letterSpacing: '-0.01em' }}>Start for free â†’</Link>
          <Link href="/pricing" style={{ background: 'transparent', color: C.textSecondary, textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', border: `1px solid ${C.border}` }}>See pricing</Link>
        </div>
        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: C.textMuted }}>7-day money-back guarantee Â· No credit card required</p>
      </section>

      {/* STATS */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '36px 60px', display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap', background: C.bgSecondary }}>
        {[
          { value: '24/7', label: 'Always available' },
          { value: '< 2s', label: 'Response time' },
          { value: '100%', label: 'Calls handled' },
          { value: '500+', label: 'Businesses served' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', color: C.text }}>{s.value}</div>
            <div style={{ fontSize: '0.82rem', color: C.textMuted, marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '96px 40px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>How it works</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Up and running in 3 steps</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '56px', fontSize: '0.95rem' }}>No developers needed. No complex setup.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {[
            { step: '01', title: 'Create your account', desc: 'Sign up in 30 seconds. Choose a plan that fits your call volume.' },
            { step: '02', title: 'Connect Google Calendar', desc: 'Link your calendar so the bot can book appointments in real time â€” automatically.' },
            { step: '03', title: "Forward your number", desc: "Redirect your existing business number to your VoiceBot. Done. You're live." },
          ].map(s => (
            <div key={s.step} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '14px' }}>Step {s.step}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em', color: C.text }}>{s.title}</h3>
              <p style={{ fontSize: '0.875rem', color: C.textSecondary, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 96px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Everything you need</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '56px', fontSize: '0.95rem' }}>An AI voice assistant that handles your calls like a real team member.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: '#ede9fe', border: `1px solid #c4b5fd`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', letterSpacing: '-0.01em', color: C.text }}>{f.title}</h3>
              <p style={{ fontSize: '0.85rem', color: C.textSecondary, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px 96px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Comparison</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>VoiceBot AI vs. a receptionist</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '48px', fontSize: '0.95rem' }}>Same job. A fraction of the cost.</p>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${C.border}`, background: C.bgSecondary }}>
            <div style={{ padding: '14px 20px', color: C.textMuted, fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}></div>
            <div style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: C.accent, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>VoiceBot AI</div>
            <div style={{ padding: '14px 20px', textAlign: 'center', color: C.textMuted, fontWeight: 600, fontSize: '0.85rem' }}>Human receptionist</div>
          </div>
          {[
            { feature: 'Monthly cost', voicebot: 'From $229/mo', human: '$3,000â€“$5,000/mo' },
            { feature: 'Availability', voicebot: '24/7/365', human: 'Business hours only' },
            { feature: 'Response time', voicebot: '< 2 seconds', human: '1â€“5 rings' },
            { feature: 'Simultaneous calls', voicebot: 'Unlimited', human: '1 at a time' },
            { feature: 'Calendar booking', voicebot: 'Automatic', human: 'Manual' },
            { feature: 'Call summaries', voicebot: 'AI-generated', human: 'Manual notes' },
            { feature: 'Setup time', voicebot: '5 minutes', human: 'Weeks of hiring' },
          ].map((row, i) => (
            <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < 6 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ padding: '14px 20px', color: C.textSecondary, fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>{row.feature}</div>
              <div style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.85rem', fontWeight: 700, color: '#16a34a', borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.voicebot}</div>
              <div style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.85rem', color: C.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.human}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA INTERMÃ‰DIAIRE */}
      <section style={{ textAlign: 'center', padding: '60px 20px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.bgSecondary }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Start handling every call automatically</h2>
        <p style={{ color: C.textSecondary, marginBottom: '28px', fontSize: '0.95rem' }}>7-day money-back guarantee. No credit card required to sign up.</p>
        <Link href="/register" style={{ background: C.text, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px' }}>Start for free â†’</Link>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '96px 40px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Frequently asked questions</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '48px', fontSize: '0.95rem' }}>Everything you need to know about VoiceBot AI.</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
              >
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: C.text }}>{faq.q}</span>
                <span style={{ fontSize: '1.2rem', color: C.textMuted, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
              </button>
              {openFaq === i && (
                <p style={{ fontSize: '0.875rem', color: C.textSecondary, lineHeight: 1.7, paddingBottom: '20px', margin: 0 }}>{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ margin: '0 24px 80px', background: C.text, borderRadius: '20px', textAlign: 'center', padding: '72px 40px', maxWidth: '1060px', marginLeft: 'auto', marginRight: 'auto' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '14px', color: '#fff' }}>Ready to automate<br />your calls?</h2>
        <p style={{ color: '#9ca3af', marginBottom: '36px', fontSize: '0.95rem' }}>Join professionals who never miss a client again.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#fff', color: C.text, textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px' }}>Get started now â†’</Link>
          <Link href="/pricing" style={{ background: 'transparent', color: '#9ca3af', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', border: '1px solid #333' }}>See pricing</Link>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
          {['No credit card required', 'Cancel anytime', 'Setup in 5 minutes'].map(t => (
            <span key={t} style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: C.text }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Pricing', href: '/pricing' },
            { label: 'Sign in', href: '/login' },
            { label: 'Sign up', href: '/register' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Refund', href: '/refund' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>{l.label}</Link>
          ))}
        </div>
        <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>Â© 2026 VoiceBot AI</span>
      </footer>

    </div>
  );
}