"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const C = { bg: '#0f1117', card: '#161b27', border: '#1e2433', text: '#6b7280', textMuted: '#374151' };

const features = [
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>, title: 'Instant Answer', desc: 'Your VoiceBot picks up in under 2 seconds, 24/7, including holidays.' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title: 'Automatic Booking', desc: 'Direct sync with Google Calendar. Appointments are booked in real time.' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>, title: 'Conversational AI', desc: 'Powered by Claude AI, the bot understands context and qualifies every lead intelligently.' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, title: 'Call Summaries', desc: 'Every call is transcribed and summarized in your dashboard. Nothing slips through.' },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>, title: 'Real-time Alerts', desc: "Get notified instantly when an appointment is booked or a priority lead calls back." },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>, title: '5-Minute Setup', desc: "Connect your calendar, activate your number, done. No technical skills required." },
];

const faqs = [
  { q: 'How does VoiceBot AI work?', a: 'VoiceBot AI uses Claude AI to answer your incoming calls in real time. When a client calls your number, the bot picks up instantly, understands what they need, and books appointments directly into your Google Calendar.' },
  { q: 'Does it work with my existing phone number?', a: 'Yes. You keep your existing business number and simply forward calls to your VoiceBot number. Setup takes less than 5 minutes — no porting required.' },
  { q: 'What languages does it support?', a: 'VoiceBot AI currently supports English. Additional languages are coming soon.' },
  { q: 'What happens when I exceed my monthly minutes?', a: 'When your monthly minutes are used up, the VoiceBot will stop answering calls until the next billing cycle. You can upgrade your plan at any time to get more minutes.' },
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time from your dashboard. Your service will remain active until the end of the current billing period.' },
  { q: 'How long does setup take?', a: 'Most businesses are live within 5 minutes. You just need to connect your Google Calendar, receive your dedicated number, and forward your existing business line to it.' },
  { q: 'Is there a money-back guarantee?', a: 'Yes. We offer a 7-day money-back guarantee for all first-time subscribers. No questions asked.' },
  { q: 'Can I customize what the bot says?', a: 'Yes. Scale plan users can customize the business name used in the greeting. Business plan users can fully customize the script, services, questions asked, and the bot\'s tone and personality — all from the dashboard.' },
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [clientData, setClientData] = useState(null);

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
    <div style={{ minHeight: '100vh', background: C.bg, color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: `rgba(15,17,23,0.85)`, backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: C.text, fontSize: '0.85rem' }}>{clientData?.business_name || user.email}</span>
              <Link href="/dashboard" style={{ background: 'white', color: 'black', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, padding: '8px 18px', borderRadius: '8px' }}>Dashboard →</Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: C.text, textDecoration: 'none', fontSize: '0.9rem', padding: '8px 16px' }}>Sign in</Link>
              <Link href="/pricing" style={{ background: 'white', color: 'black', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, padding: '8px 18px', borderRadius: '8px' }}>Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '120px 20px 100px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: C.card, border: `1px solid ${C.border}`, borderRadius: '100px', padding: '6px 16px', fontSize: '0.8rem', color: C.text, marginBottom: '32px', letterSpacing: '0.02em' }}>
          ✦ Powered by Claude AI
        </div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.04em', marginBottom: '24px', background: 'linear-gradient(135deg, #ffffff 0%, #6b7280 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Never miss a client call again
        </h1>
        <p style={{ fontSize: '1.15rem', color: C.text, lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
          VoiceBot AI answers your calls 24/7, books appointments on Google Calendar, and qualifies your leads — automatically.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: 'white', color: 'black', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', letterSpacing: '-0.01em' }}>Start for free →</Link>
          <Link href="/pricing" style={{ background: 'transparent', color: C.text, textDecoration: 'none', fontWeight: 500, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', border: `1px solid ${C.border}` }}>See pricing</Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '40px 60px', display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
        {[{ value: '24/7', label: 'Always available' }, { value: '< 2s', label: 'Response time' }, { value: '100%', label: 'Calls handled' }].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>{s.value}</div>
            <div style={{ fontSize: '0.85rem', color: C.textMuted, marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>Up and running in 3 steps</h2>
        <p style={{ textAlign: 'center', color: C.text, marginBottom: '64px', fontSize: '1rem' }}>No developers needed. No complex setup.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {[
            { step: '01', title: 'Create your account', desc: 'Sign up in 30 seconds. Choose a plan that fits your call volume.' },
            { step: '02', title: 'Connect Google Calendar', desc: 'Link your calendar so the bot can book appointments in real time — automatically.' },
            { step: '03', title: 'Forward your number', desc: 'Redirect your existing business number to your VoiceBot. Done. You\'re live.' },
          ].map(s => (
            <div key={s.step} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '32px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4f46e5', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Step {s.step}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em' }}>{s.title}</h3>
              <p style={{ fontSize: '0.875rem', color: C.text, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px 100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>Everything you need</h2>
        <p style={{ textAlign: 'center', color: C.text, marginBottom: '64px', fontSize: '1rem' }}>An AI voice assistant that handles your calls like a real team member.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
              <div style={{ width: '40px', height: '40px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: C.text, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>VoiceBot AI vs. a receptionist</h2>
        <p style={{ textAlign: 'center', color: C.text, marginBottom: '48px', fontSize: '1rem' }}>Same job. A fraction of the cost.</p>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 12px', color: C.text, fontSize: '0.8rem', fontWeight: 600 }}></div>
            <div style={{ padding: '14px 12px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>VoiceBot AI</div>
            <div style={{ padding: '14px 12px', textAlign: 'center', color: C.text, fontWeight: 600, fontSize: '0.9rem' }}>Human receptionist</div>
          </div>
          {[
            { feature: 'Monthly cost', voicebot: 'From $229/mo', human: '$3,000–$5,000/mo' },
            { feature: 'Availability', voicebot: '24/7/365', human: 'Business hours only' },
            { feature: 'Response time', voicebot: '< 2 seconds', human: '1–5 rings' },
            { feature: 'Simultaneous calls', voicebot: 'Unlimited', human: '1 at a time' },
            { feature: 'Calendar booking', voicebot: 'Automatic', human: 'Manual' },
            { feature: 'Call summaries', voicebot: 'AI-generated', human: 'Manual notes' },
            { feature: 'Setup time', voicebot: '5 minutes', human: 'Weeks of hiring' },
          ].map((row, i) => (
            <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < 6 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ padding: '14px 12px', color: C.text, fontSize: '0.82rem', display: 'flex', alignItems: 'center' }}>{row.feature}</div>
              <div style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 700, color: '#4ade80', borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.voicebot}</div>
              <div style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.82rem', color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.human}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA INTERMÉDIAIRE */}
      <section style={{ textAlign: 'center', padding: '60px 20px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.card }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '12px' }}>Start handling every call automatically</h2>
        <p style={{ color: C.text, marginBottom: '32px', fontSize: '1rem' }}>7-day money-back guarantee. No credit card required to sign up.</p>
        <Link href="/register" style={{ background: 'white', color: 'black', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px' }}>Start for free →</Link>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: '720px', margin: '0 auto', padding: '100px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>Frequently asked questions</h2>
        <p style={{ textAlign: 'center', color: C.text, marginBottom: '64px', fontSize: '1rem' }}>Everything you need to know about VoiceBot AI.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em' }}>{faq.q}</h3>
              <p style={{ fontSize: '0.875rem', color: C.text, lineHeight: 1.7 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ textAlign: 'center', padding: '80px 20px 120px', borderTop: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '16px' }}>Ready to automate<br />your calls?</h2>
        <p style={{ color: C.text, marginBottom: '40px', fontSize: '1rem' }}>Join professionals who never miss a client again.</p>
        <Link href="/register" style={{ background: 'white', color: 'black', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 36px', borderRadius: '10px' }}>Get started now →</Link>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '32px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link href="/pricing" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>Pricing</Link>
          <Link href="/login" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>Sign in</Link>
          <Link href="/register" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>Sign up</Link>
          <Link href="/privacy" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>Privacy</Link>
          <Link href="/terms" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>Terms</Link>
          <Link href="/refund" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.85rem' }}>Refund</Link>
        </div>
        <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>© 2026 VoiceBot AI</span>
      </footer>

    </div>
  );
}