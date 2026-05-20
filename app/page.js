import Link from 'next/link';

const features = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    title: 'Instant Answer',
    desc: 'Your VoiceBot picks up in under 2 seconds, 24/7, including holidays.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: 'Automatic Booking',
    desc: 'Direct sync with Google Calendar. Appointments are booked in real time.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    title: 'Conversational AI',
    desc: 'Powered by Claude AI, the bot understands context and qualifies every lead intelligently.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Call Summaries',
    desc: 'Every call is transcribed and summarized in your dashboard. Nothing slips through.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    title: 'Real-time Alerts',
    desc: 'Get notified instantly when an appointment is booked or a priority lead calls back.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    title: '5-Minute Setup',
    desc: 'Connect your calendar, activate your number, done. No technical skills required.',
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem', padding: '8px 16px' }}>Sign in</Link>
          <Link href="/pricing" style={{ background: 'white', color: 'black', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, padding: '8px 18px', borderRadius: '8px' }}>Get started</Link>
        </div>
      </nav>

      <section style={{ textAlign: 'center', padding: '120px 20px 100px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#111', border: '1px solid #222', borderRadius: '100px', padding: '6px 16px', fontSize: '0.8rem', color: '#888', marginBottom: '32px', letterSpacing: '0.02em' }}>
          ✦ Powered by Claude AI
        </div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px', background: 'linear-gradient(135deg, #ffffff 0%, #666 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Never miss a client call again
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#555', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
          VoiceBot AI answers your calls 24/7, books appointments on Google Calendar, and qualifies your leads — automatically.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: 'white', color: 'black', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', letterSpacing: '-0.01em' }}>
            Start for free →
          </Link>
          <Link href="/pricing" style={{ background: 'transparent', color: '#666', textDecoration: 'none', fontWeight: 500, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', border: '1px solid #222' }}>
            See pricing
          </Link>
        </div>
      </section>

      <section style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '40px 60px', display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
        {[
          { value: '24/7', label: 'Always available' },
          { value: '< 2s', label: 'Response time' },
          { value: '100%', label: 'Calls handled' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>{s.value}</div>
            <div style={{ fontSize: '0.85rem', color: '#444', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>Everything you need</h2>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '64px', fontSize: '1rem' }}>An AI voice assistant that handles your calls like a real team member.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '40px', height: '40px', background: '#161616', border: '1px solid #222', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '80px 20px 120px', borderTop: '1px solid #111' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '16px' }}>Ready to automate<br />your calls?</h2>
        <p style={{ color: '#555', marginBottom: '40px', fontSize: '1rem' }}>Join professionals who never miss a client again.</p>
        <Link href="/register" style={{ background: 'white', color: 'black', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 36px', borderRadius: '10px' }}>
          Get started now →
        </Link>
      </section>

      <footer style={{ borderTop: '1px solid #111', padding: '32px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/pricing" style={{ color: '#444', textDecoration: 'none', fontSize: '0.85rem' }}>Pricing</Link>
          <Link href="/login" style={{ color: '#444', textDecoration: 'none', fontSize: '0.85rem' }}>Sign in</Link>
          <Link href="/register" style={{ color: '#444', textDecoration: 'none', fontSize: '0.85rem' }}>Sign up</Link>
        </div>
        <span style={{ color: '#333', fontSize: '0.8rem' }}>© 2026 VoiceBot AI</span>
      </footer>

    </div>
  );
}