"use client";
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export default function Home() {
  const [user, setUser] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [roiCalls, setRoiCalls] = useState(50);
  const [scrolled, setScrolled] = useState(false);
  const [playingDemo, setPlayingDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) setUser(authUser);
    };
    loadUser();

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const demoConversation = [
    { role: 'bot', text: "Thank you for calling Smith Dental. How can I help you today?", time: 0 },
    { role: 'caller', text: "Hi, I'd like to book a cleaning appointment.", time: 1500 },
    { role: 'bot', text: "Of course! I have Tuesday at 10am or Thursday at 2pm available. Which works best?", time: 3000 },
    { role: 'caller', text: "Thursday at 2pm please.", time: 4500 },
    { role: 'bot', text: "Perfect! Booked for Thursday at 2pm. You'll receive a confirmation SMS shortly!", time: 6000 },
  ];

  const startDemo = () => {
    setPlayingDemo(true);
    setDemoStep(0);
    demoConversation.forEach((_, i) => {
      setTimeout(() => setDemoStep(i + 1), demoConversation[i].time + 500);
    });
    setTimeout(() => setPlayingDemo(false), 8000);
  };

  const missedCallsPerMonth = roiCalls * 4;
  const revenuePerClient = 300;
  const potentialRevenue = Math.round(missedCallsPerMonth * 0.3 * revenuePerClient);
  const roi = potentialRevenue - 229;

  const faqs = [
    { q: "How fast does it answer calls?", a: "Under 2 seconds. Your VoiceBot picks up instantly, 24/7 — no hold music, no voicemail." },
    { q: "Do I need to change my phone number?", a: "No. You keep your existing number and simply forward calls to your VoiceBot. Setup takes under 5 minutes." },
    { q: "What if I exceed my monthly minutes?", a: "Your VoiceBot keeps running. You can purchase extra minute packs from your dashboard at any time." },
    { q: "Can I customize what the bot says?", a: "Yes. On Scale and Business plans you can customize the script, business name, tone, services offered, and questions asked." },
    { q: "Is there a free trial?", a: "Yes — 7 days free, Credit card required — cancel anytime. Cancel anytime from your dashboard." },
    { q: "What languages does it support?", a: "English is fully supported. More languages coming soon." },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#0f0f0f', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #e5e7eb' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/pricing" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" style={{ background: '#0f0f0f', color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, padding: '9px 20px', borderRadius: '8px' }}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Sign in</Link>
              <Link href="/register" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, padding: '9px 20px', borderRadius: '8px' }}>Start free trial</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Background gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '6px 16px', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginBottom: '32px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
          7-day free trial — Cancel anytime — Credit card required — cancel anytime
        </div>

        <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.05em', marginBottom: '24px', maxWidth: '900px' }}>
          Stop losing clients<br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>to missed calls.</span>
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#6b7280', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
          VoiceBot AI answers every call in under 2 seconds, books appointments automatically, and never takes a day off — starting at $229/mo.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Link href="/register" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '15px 36px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}>
            Start free trial
          </Link>
          <button onClick={startDemo} style={{ background: '#fff', color: '#0f0f0f', border: '1.5px solid #e5e7eb', fontWeight: 600, fontSize: '1rem', padding: '15px 36px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#6366f1" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Hear it live
          </button>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Trusted by 500+ businesses · 99.9% uptime · Setup in 5 minutes</p>

        {/* DEMO CARD */}
        <div style={{ marginTop: '64px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '28px', maxWidth: '580px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.08)', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f0f0f' }}>Live call — Smith Dental Clinic</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#9ca3af', background: '#f3f4f6', padding: '3px 10px', borderRadius: '100px' }}>AI answering</span>
          </div>

          {demoStep === 0 && !playingDemo && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <button onClick={startDemo} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '50%', width: '64px', height: '64px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </button>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to hear a real VoiceBot call</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {demoConversation.slice(0, demoStep).map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: line.role === 'caller' ? 'row-reverse' : 'row', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: line.role === 'bot' ? '#ede9fe' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: line.role === 'bot' ? '#6366f1' : '#6b7280', flexShrink: 0 }}>
                  {line.role === 'bot' ? 'AI' : 'C'}
                </div>
                <div style={{ background: line.role === 'bot' ? '#ede9fe' : '#f9fafb', border: `1px solid ${line.role === 'bot' ? '#c4b5fd' : '#e5e7eb'}`, borderRadius: '12px', padding: '10px 14px', maxWidth: '75%' }}>
                  <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: 1.5, color: '#0f0f0f' }}>{line.text}</p>
                </div>
              </div>
            ))}
          </div>

          {demoStep >= demoConversation.length && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Appointment added to Google Calendar</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '100px' }}>Booked</span>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* PAIN POINTS */}
      <section style={{ background: '#0f0f0f', color: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Sound familiar?</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '16px' }}>
            Every missed call is<br />a missed client.
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '64px' }}>The average business misses 62% of calls after hours. Each one could be worth $300+.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { icon: '📵', title: 'Calls go to voicemail', desc: '62% of callers never leave a message. They call your competitor instead.' },
              { icon: '💸', title: 'Revenue walks away', desc: 'Each missed call = a lost client. At $300/client, that adds up fast.' },
              { icon: '😤', title: 'Clients get frustrated', desc: 'Nobody wants to wait on hold or call back 3 times to book an appointment.' },
              { icon: '🌙', title: 'You work 9-to-5. Clients dont', desc: 'Most appointment requests happen after hours. You miss them all.' },
            ].map(p => (
              <div key={p.title} style={{ background: '#161616', border: '1px solid #222', borderRadius: '16px', padding: '28px', textAlign: 'left' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: '14px' }}>{p.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>{p.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '80px 24px', borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {[
            { value: '500+', label: 'Businesses using VoiceBot AI' },
            { value: '<2s', label: 'Average answer time' },
            { value: '24/7', label: 'Always available' },
            { value: '99.9%', label: 'Uptime guaranteed' },
            { value: '$300+', label: 'Average value per client saved' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#0f0f0f', marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '96px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Setup</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>Live in 5 minutes.</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '64px', fontSize: '1rem' }}>No developers. No hardware. No training sessions.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { n: '01', title: 'Create your account', desc: 'Sign up in 30 seconds. Choose a plan. Your 7-day free trial — Cancel anytime starts immediately.' },
            { n: '02', title: 'Connect your calendar', desc: 'Link Google Calendar or Calendly. VoiceBot will book appointments directly into it.' },
            { n: '03', title: 'Forward your number', desc: "Redirect your existing business line to your VoiceBot number. You're live. Done." },
          ].map(s => (
            <div key={s.n} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '3rem', fontWeight: 800, color: '#f3f4f6', letterSpacing: '-0.04em' }}>{s.n}</div>
              <div style={{ width: '40px', height: '40px', background: '#ede9fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1' }}>{s.n}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: '#fafafa', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>Everything your receptionist does.</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '64px' }}>Without the salary, sick days, or training.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Answers in under 2 seconds', desc: 'No hold music. No voicemail. Every call answered instantly, day or night.', icon: '⚡' },
              { title: 'Books appointments automatically', desc: 'Syncs directly with Google Calendar or Calendly. No manual entry needed.', icon: '📅' },
              { title: 'Sends SMS confirmations', desc: 'Clients get an instant confirmation text after every booking.', icon: '💬' },
              { title: 'Handles modifications & cancellations', desc: 'Callers can reschedule or cancel without reaching a human.', icon: '🔄' },
              { title: 'AI-generated call summaries', desc: 'Every call is transcribed and summarized in your dashboard.', icon: '📝' },
              { title: 'Call recording', desc: 'Record every call for quality review. Available on Scale and Business plans.', icon: '🎙️' },
              { title: 'Unlimited simultaneous calls', desc: 'Handle 10 calls at once during rush hour. No missed opportunities.', icon: '📞' },
              { title: 'Full script customization', desc: 'Business plan users can fully customize tone, services, and questions asked.', icon: '✏️' },
              { title: 'Analytics dashboard', desc: 'Track calls, conversion rates, peak hours, and ROI in real time.', icon: '📊' },
            ].map(f => (
              <div key={f.title} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '12px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>ROI Calculator</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>How much are you losing?</h2>
          <p style={{ color: '#6b7280', marginBottom: '48px' }}>See exactly what missed calls are costing your business.</p>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f0f0f' }}>Calls per week</label>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6366f1' }}>{roiCalls}</span>
              </div>
              <input type="range" min="10" max="200" value={roiCalls} onChange={e => setRoiCalls(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#6366f1', height: '6px', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: '#9ca3af' }}>
                <span>10</span><span>200</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Missed calls/month', value: missedCallsPerMonth, color: '#ef4444', prefix: '' },
                { label: 'Potential revenue lost', value: potentialRevenue, color: '#f59e0b', prefix: '$' },
                { label: 'Monthly ROI with VoiceBot', value: roi, color: '#16a34a', prefix: '$' },
              ].map(s => (
                <div key={s.label} style={{ background: '#f9fafb', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, letterSpacing: '-0.03em', marginBottom: '4px' }}>{s.prefix}{s.value.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '4px' }}>VoiceBot AI costs you</p>
              <p style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px' }}>$229/month</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', margin: 0 }}>vs ${potentialRevenue.toLocaleString()} in potential lost revenue</p>
            </div>

            <Link href="/register" style={{ display: 'block', background: '#0f0f0f', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
              Start recovering that revenue today
            </Link>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ background: '#fafafa', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '96px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Comparison</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>VoiceBot AI vs. a receptionist</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px' }}>Same job. 93% less cost.</p>

          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ padding: '16px 20px' }} />
              <div style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#6366f1', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>VoiceBot AI</div>
              <div style={{ padding: '16px 20px', textAlign: 'center', color: '#9ca3af', fontWeight: 600, fontSize: '0.9rem' }}>Human receptionist</div>
            </div>
            {[
              { feature: 'Monthly cost', voicebot: 'From $229/mo', human: '$3,000-$5,000/mo' },
              { feature: 'Availability', voicebot: '24/7/365', human: 'Business hours only' },
              { feature: 'Response time', voicebot: '< 2 seconds', human: '1-5 rings' },
              { feature: 'Simultaneous calls', voicebot: 'Unlimited', human: '1 at a time' },
              { feature: 'Setup time', voicebot: '5 minutes', human: 'Weeks of hiring' },
              { feature: 'SMS confirmations', voicebot: 'Automatic', human: 'Manual' },
              { feature: 'Never calls in sick', voicebot: 'Never', human: 'Sometimes' },
            ].map((row, i) => (
              <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < 6 ? '1px solid #e5e7eb' : 'none' }}>
                <div style={{ padding: '14px 20px', color: '#6b7280', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>{row.feature}</div>
                <div style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#16a34a', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.voicebot}</div>
                <div style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.human}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Industries</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>Built for your industry.</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '64px' }}>From solo practitioners to multi-location operations.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🦷', industry: 'Dental Clinics', desc: 'Book cleanings, handle cancellations, and confirm appointments — automatically.', stat: '40+ hrs saved/month' },
              { icon: '⚖️', industry: 'Law Firms', desc: 'Qualify leads and schedule consultations 24/7. Never miss a potential case.', stat: '62% more leads captured' },
              { icon: '🏠', industry: 'Real Estate', desc: 'Answer property inquiries and book viewings around the clock.', stat: '3x more showings booked' },
              { icon: '💆', industry: 'Spas & Salons', desc: 'Let clients book, modify, or cancel anytime. Reduce no-shows with SMS reminders.', stat: '30% fewer no-shows' },
              { icon: '🔧', industry: 'Home Services', desc: 'Capture service requests and dispatch jobs — even on weekends.', stat: 'Zero missed weekend calls' },
              { icon: '🏥', industry: 'Medical Practices', desc: 'Handle scheduling and patient inquiries with professional, compliant AI.', stat: '50% less front desk load' },
            ].map(u => (
              <div key={u.industry} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: '2rem', marginBottom: '14px' }}>{u.icon}</div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{u.industry}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.65, marginBottom: '16px' }}>{u.desc}</p>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', background: '#ede9fe', padding: '4px 12px', borderRadius: '100px' }}>{u.stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: '#0f0f0f', color: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Testimonials</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '48px' }}>Businesses that never miss a call.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
  { stat: '62%', desc: 'of callers never leave a voicemail. They call your competitor instead.' },
  { stat: '$300+', desc: 'average value of each client appointment you could be missing.' },
  { stat: '5 min', desc: 'to set up VoiceBot AI and never miss another call again.' },
].map(t => (
  <div key={t.stat} style={{ background: '#161616', border: '1px solid #222', borderRadius: '20px', padding: '28px' }}>
    <p style={{ fontSize: '3rem', fontWeight: 700, color: '#6366f1', letterSpacing: '-0.04em', marginBottom: '12px' }}>{t.stat}</p>
    <p style={{ fontSize: '0.95rem', color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
  </div>
))}
          </div>
        </div>
      </section>
      {/* PRICING SUMMARY */}
<section style={{ padding: '96px 24px', background: '#fafafa', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
  <div style={{ maxWidth: '960px', margin: '0 auto' }}>
    <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Pricing</p>
    <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>Simple, transparent pricing.</h2>
    <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px' }}>Start free for 7 days. Credit card required — cancel anytime.</p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
      
        {[
  {
    name: 'Starter', price: '$229', desc: 'Perfect for small businesses.',
    features: ['500 call minutes/month', '1 phone number', 'Google Calendar sync', 'AI call summaries', '24/7 availability', 'Instant response (<1s)', 'Email support', 'Extra minutes from $25'],
    popular: false,
  },
  {
    name: 'Scale', price: '$459', desc: 'For growing teams.',
    features: ['2,000 call minutes/month', '1 phone number', 'Google Calendar sync', 'AI call summaries', '24/7 availability', 'Custom business name', 'Call recording', 'Appointment modification & cancellation', 'Calendly integration', 'Analytics dashboard', 'Extra minutes from $25'],
    popular: true,
  },
  {
    name: 'Business', price: '$879', desc: 'For high-volume operations.',
    features: ['6,000 call minutes/month', '1 phone number included', 'Google Calendar sync', 'AI call summaries', '24/7 availability + priority support', 'Custom business name', 'Full script customization', 'SMS confirmation after booking', 'Call recording', 'Advanced analytics dashboard', 'Appointment modification & cancellation', 'Calendly integration', 'Unlimited additional numbers ($15/mo each)', 'Extra minutes from $20'],
    popular: false,
  },
      ].map(plan => (
        <div key={plan.name} style={{ background: '#fff', border: `${plan.popular ? '2px solid #6366f1' : '1px solid #e5e7eb'}`, borderRadius: '20px', padding: '32px', position: 'relative' }}>
          {plan.popular && (
            <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 16px', borderRadius: '100px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>
          )}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</h3>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '16px' }}>{plan.desc}</p>
          <div style={{ fontSize: '2.8rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '4px' }}>{plan.price}<span style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: 400 }}>/mo</span></div>
          <p style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginBottom: '20px' }}>7-day free trial — Cancel anytime — Cancel anytime included</p>
          <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '20px' }} />
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {plan.features.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#374151' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </li>
            ))}
          </ul>
          <Link href="/register" style={{ display: 'block', background: plan.popular ? '#6366f1' : '#0f0f0f', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
            Start free trial
          </Link>
        </div>
      ))}
    </div>

    <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', marginTop: '24px' }}>
      All plans include a 7-day free trial — Cancel anytime — Cancel anytime. Cancel anytime. <Link href="/pricing" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>See full pricing details</Link>
    </p>
  </div>
</section>

      {/* FAQ */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '48px' }}>Questions answered.</h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px', fontFamily: 'inherit' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f0f0f' }}>{faq.q}</span>
                  <span style={{ fontSize: '1.4rem', color: '#9ca3af', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block', lineHeight: 1 }}>+</span>
                </button>
                {openFaq === i && (
                  <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7, paddingBottom: '20px', margin: 0 }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '24px', padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />

          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Start today</p>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '16px', color: '#fff' }}>
  Your phone answers itself.<br />Your calendar fills itself.
</h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '40px', fontSize: '1.05rem' }}>
            Join 500+ businesses. 7-day free trial — Cancel anytime — Cancel anytime. Cancel anytime.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: '#fff', color: '#6366f1', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '15px 36px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              Start free trial
            </Link>
            <Link href="/pricing" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', padding: '15px 36px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)' }}>
              See pricing
            </Link>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', marginTop: '24px', flexWrap: 'wrap' }}>
            {['Credit card required — cancel anytime', '7-day free trial — Cancel anytime', 'Cancel anytime', 'Live in 5 minutes'].map(t => (
              <span key={t} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[
            { label: 'Pricing', href: '/pricing' },
            { label: 'Sign in', href: '/login' },
            { label: 'Sign up', href: '/register' },
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Refund', href: '/refund' },
          ].map(l => (
            <Link key={l.label} href={l.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>{l.label}</Link>
          ))}
        </div>
        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>2026 VoiceBot AI</span>
      </footer>

      {/* STICKY MOBILE CTA */}
      {!user && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, padding: '12px 16px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #e5e7eb', display: 'none' }} className="mobile-cta">
          <Link href="/register" style={{ display: 'block', background: '#6366f1', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
            Start free trial
          </Link>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .mobile-cta { display: block !important; }
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  );
}