"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const C = {
  bg: '#ffffff',
  bgSecondary: '#f9fafb',
  border: '#e5e7eb',
  text: '#0f0f0f',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  accent: '#6366f1',
};

const useCases = [
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    industry: 'Dental Clinics',
    desc: 'Book cleanings, confirm appointments, handle cancellations — without lifting a finger.',
    stat: 'Avg. 40 hours/month saved',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    industry: 'Law Firms',
    desc: 'Qualify leads, schedule consultations, and capture every potential client after hours.',
    stat: 'Never miss a case again',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    industry: 'Real Estate',
    desc: 'Answer property inquiries 24/7 and book viewings directly into your calendar.',
    stat: 'Convert more leads',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
    industry: 'Spas & Salons',
    desc: 'Let clients book, reschedule, or cancel appointments anytime — no hold music.',
    stat: '30% fewer no-shows',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    industry: 'Home Services',
    desc: 'Capture service requests and dispatch efficiently, even on weekends and holidays.',
    stat: 'Always on call',
  },
  {
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    industry: 'Medical Practices',
    desc: 'Handle appointment scheduling and patient inquiries with HIPAA-conscious AI.',
    stat: 'Reduce front desk load',
  },
];

const featuresList = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    title: 'Instant Answer',
    desc: 'Picks up in under 2 seconds, 24/7, including weekends and holidays.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: 'Automatic Booking',
    desc: 'Direct sync with Google Calendar and Calendly. Real-time appointment booking.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    title: 'Conversational AI',
    desc: 'Powered by Claude AI — understands context, qualifies leads, handles objections.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Call Summaries',
    desc: 'Every call transcribed and summarized in your dashboard. Nothing slips through.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: 'SMS Confirmations',
    desc: 'Automatically sends SMS booking confirmations to callers after every appointment.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    title: '5-Minute Setup',
    desc: 'Connect your calendar, activate your number, forward your line. Done.',
  },
];

const faqs = [
  { q: 'How does VoiceBot AI work?', a: 'VoiceBot AI uses Claude AI to answer your incoming calls in real time. When a client calls your number, the bot picks up instantly, understands what they need, and books appointments directly into your Google Calendar.' },
  { q: 'Does it work with my existing phone number?', a: 'Yes. You keep your existing business number and simply forward calls to your VoiceBot number. Setup takes less than 5 minutes — no porting required.' },
  { q: 'What languages does it support?', a: 'VoiceBot AI currently supports English. Additional languages are coming soon.' },
  { q: 'What happens when I exceed my monthly minutes?', a: 'When your monthly minutes are used up, the VoiceBot will stop answering calls until the next billing cycle. You can upgrade your plan at any time to get more minutes.' },
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time from your dashboard. Your service will remain active until the end of the current billing period.' },
  { q: 'How long does setup take?', a: 'Most businesses are live within 5 minutes. You just need to connect your Google Calendar, receive your dedicated number, and forward your existing business line to it.' },
  { q: 'Is there a money-back guarantee?', a: 'Yes. We offer a 7-day money-back guarantee for all first-time subscribers. No questions asked.' },
  { q: 'Can I customize what the bot says?', a: "Yes. Scale plan users can customize the business name used in the greeting. Business plan users can fully customize the script, services, questions asked, and the bot's tone and personality." },
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
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', color: C.text }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/pricing" style={{ color: C.textSecondary, textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</Link>
          {user ? (
            <>
              <Link href="/dashboard" style={{ background: C.text, color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '8px 16px', borderRadius: '8px' }}>Dashboard</Link>
              <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }} style={{ background: 'transparent', color: C.textSecondary, border: `1px solid ${C.border}`, fontSize: '0.85rem', fontWeight: 500, padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: C.textSecondary, textDecoration: 'none', fontSize: '0.875rem' }}>Sign in</Link>
              <Link href="/register" style={{ background: C.accent, color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '8px 16px', borderRadius: '8px' }}>Start for free</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '120px 20px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: '100px', padding: '5px 16px', fontSize: '0.78rem', color: C.accent, fontWeight: 600, marginBottom: '32px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
          Trusted by 500+ businesses
        </div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 700, lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '24px', color: C.text }}>
          Your AI receptionist.<br />Available 24/7.
        </h1>
        <p style={{ fontSize: '1.15rem', color: C.textSecondary, lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 48px' }}>
          VoiceBot AI answers every call, books appointments automatically, and never lets a lead slip through — even at 3am.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: C.accent, color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px' }}>Start for free</Link>
          <Link href="/pricing" style={{ background: 'transparent', color: C.textSecondary, textDecoration: 'none', fontWeight: 500, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', border: `1px solid ${C.border}` }}>See pricing</Link>
        </div>
        <p style={{ marginTop: '20px', fontSize: '0.8rem', color: C.textMuted }}>7-day money-back guarantee</p>
      </section>

      {/* STATS */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '40px 60px', display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap', background: C.bgSecondary }}>
        {[
          { value: '500+', label: 'Businesses served' },
          { value: '24/7', label: 'Always available' },
          { value: '<2s', label: 'Avg. response time' },
          { value: '99.9%', label: 'Uptime SLA' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', color: C.text }}>{s.value}</div>
            <div style={{ fontSize: '0.82rem', color: C.textMuted, marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* USE CASES */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 40px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Use cases</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Built for every business</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '56px', fontSize: '0.95rem' }}>From solo practitioners to multi-location teams.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {useCases.map(u => (
            <div key={u.industry} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ width: '40px', height: '40px', background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{u.icon}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: C.text }}>{u.industry}</h3>
              <p style={{ fontSize: '0.85rem', color: C.textSecondary, lineHeight: 1.65, marginBottom: '16px' }}>{u.desc}</p>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: C.accent, background: '#ede9fe', padding: '4px 12px', borderRadius: '100px' }}>{u.stat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section style={{ background: C.bgSecondary, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '96px 40px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Live demo</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Hear it in action</h2>
          <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '48px', fontSize: '0.95rem' }}>A real conversation between VoiceBot AI and a caller booking an appointment.</p>
          <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '20px', padding: '32px', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: C.text }}>Live call transcript</span>
              <span style={{ fontSize: '0.75rem', color: C.textMuted, marginLeft: 'auto' }}>Duration: 1m 23s</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { role: 'bot', msg: "Thank you for calling Smith Dental. This is your AI assistant. How can I help you today?" },
                { role: 'caller', msg: "Hi, I'd like to book a cleaning appointment for next week." },
                { role: 'bot', msg: "Of course! I can see availability on Tuesday at 10am or Thursday at 2pm. Which works best for you?" },
                { role: 'caller', msg: "Thursday at 2pm sounds great." },
                { role: 'bot', msg: "Perfect! I've booked your cleaning for Thursday at 2pm. You'll receive a confirmation shortly. Is there anything else I can help you with?" },
                { role: 'caller', msg: "No, that's all. Thanks!" },
                { role: 'bot', msg: "Have a great day! We look forward to seeing you Thursday." },
              ].map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: line.role === 'caller' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: line.role === 'bot' ? '#ede9fe' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: line.role === 'bot' ? C.accent : C.textSecondary, flexShrink: 0 }}>
                    {line.role === 'bot' ? 'AI' : 'C'}
                  </div>
                  <div style={{ background: line.role === 'bot' ? '#ede9fe' : '#f9fafb', border: `1px solid ${line.role === 'bot' ? '#c4b5fd' : C.border}`, borderRadius: '12px', padding: '10px 14px', maxWidth: '80%' }}>
                    <p style={{ fontSize: '0.875rem', color: C.text, margin: 0, lineHeight: 1.5 }}>{line.msg}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: C.textMuted }}>Appointment booked automatically in Google Calendar</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '100px' }}>Booked</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '96px 40px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>How it works</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Live in 3 steps</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '56px', fontSize: '0.95rem' }}>No developers. No complex setup. Just results.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {[
            { step: '01', title: 'Create your account', desc: 'Sign up in 30 seconds. Choose a plan that fits your call volume.' },
            { step: '02', title: 'Connect Google Calendar', desc: 'Link your calendar so the bot books appointments in real time, automatically.' },
            { step: '03', title: 'Forward your number', desc: "Redirect your existing business number to your VoiceBot. You're live." },
          ].map(s => (
            <div key={s.step} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', border: '1px solid #c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: C.accent }}>{s.step}</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: C.text }}>{s.title}</h3>
              <p style={{ fontSize: '0.875rem', color: C.textSecondary, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: C.bgSecondary, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '96px 40px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Testimonials</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '48px', color: C.text }}>What our customers say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { name: 'Dr. Sarah M.', role: 'Dentist, New York', quote: 'We used to miss 15-20 calls a week after hours. VoiceBot AI handles them all now. Our bookings went up 30% in the first month.', stars: 5 },
              { name: 'James T.', role: 'Real Estate Agent, Miami', quote: "I close deals while I sleep. VoiceBot qualifies leads and books viewings automatically. It's the best $229 I spend each month.", stars: 5 },
              { name: 'Maria L.', role: 'Spa Owner, Los Angeles', quote: "Setup took 4 minutes. Now my clients can book 24/7 and I stopped losing appointments to voicemail. Game changer.", stars: 5 },
            ].map(t => (
              <div key={t.name} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '16px', padding: '28px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  ))}
                </div>
                <p style={{ fontSize: '0.9rem', color: C.text, lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: C.text, marginBottom: '2px' }}>{t.name}</p>
                  <p style={{ fontSize: '0.8rem', color: C.textMuted, margin: 0 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 40px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Everything your front desk does, automated</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '56px', fontSize: '0.95rem' }}>Without the salary, sick days, or training.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {featuresList.map(f => (
            <div key={f.title} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '14px', padding: '24px' }}>
              <div style={{ width: '40px', height: '40px', background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{f.icon}</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px', color: C.text }}>{f.title}</h3>
              <p style={{ fontSize: '0.85rem', color: C.textSecondary, lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ maxWidth: '860px', margin: '0 auto', padding: '0 20px 96px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Comparison</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>VoiceBot AI vs. a receptionist</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '48px', fontSize: '0.95rem' }}>Same job. A fraction of the cost.</p>
        <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: `1px solid ${C.border}`, background: C.bgSecondary }}>
            <div style={{ padding: '14px 20px' }}></div>
            <div style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, fontSize: '0.85rem', color: C.accent, borderLeft: `1px solid ${C.border}`, borderRight: `1px solid ${C.border}` }}>VoiceBot AI</div>
            <div style={{ padding: '14px 20px', textAlign: 'center', color: C.textMuted, fontWeight: 600, fontSize: '0.85rem' }}>Human receptionist</div>
          </div>
          {[
            { feature: 'Monthly cost', voicebot: 'From $229/mo', human: '$3,000-$5,000/mo' },
            { feature: 'Availability', voicebot: '24/7/365', human: 'Business hours only' },
            { feature: 'Response time', voicebot: '< 2 seconds', human: '1-5 rings' },
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

      {/* CTA FINAL */}
      <section style={{ margin: '0 auto 80px', background: C.text, borderRadius: '20px', textAlign: 'center', padding: '80px 40px', maxWidth: '1060px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '14px', color: '#fff' }}>Your AI receptionist<br />starts today.</h2>
        <p style={{ color: '#9ca3af', marginBottom: '36px', fontSize: '0.95rem' }}>Join 500+ businesses that never miss a call. 7-day money-back guarantee.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: '#fff', color: C.text, textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px' }}>Start for free</Link>
          <Link href="/pricing" style={{ background: 'transparent', color: '#9ca3af', textDecoration: 'none', fontWeight: 500, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', border: '1px solid #333' }}>See pricing</Link>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ maxWidth: '680px', margin: '0 auto', padding: '96px 40px' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '12px', color: C.text }}>Frequently asked questions</h2>
        <p style={{ textAlign: 'center', color: C.textSecondary, marginBottom: '48px', fontSize: '0.95rem' }}>Everything you need to know about VoiceBot AI.</p>
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
        <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>2026 VoiceBot AI</span>
      </footer>

    </div>
  );
}