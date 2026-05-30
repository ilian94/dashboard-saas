import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* NAV */}
      <nav style={{ padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', color: '#0f0f0f', textDecoration: 'none' }}>VoiceBot AI</Link>
      </nav>

      {/* CONTENT */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ maxWidth: '480px', width: '100%' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ede9fe', border: '1px solid #c4b5fd', borderRadius: '100px', padding: '5px 14px', fontSize: '0.78rem', color: '#6366f1', fontWeight: 600, marginBottom: '32px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            Error 404
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.05em', color: '#0f0f0f', lineHeight: 1.05, marginBottom: '20px' }}>
            This page<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>doesn't exist.</span>
          </h1>

          <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.7, marginBottom: '40px' }}>
            The page you're looking for has been moved or never existed. Let's get you back on track.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '48px' }}>
            <Link href="/" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', boxShadow: '0 4px 16px rgba(99,102,241,0.3)' }}>
              Back to home
            </Link>
            <Link href="/pricing" style={{ background: '#f9fafb', color: '#0f0f0f', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
              See pricing
            </Link>
          </div>

          <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '32px' }} />

          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Homepage', href: '/' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Sign in', href: '/login' },
              { label: 'Contact', href: 'mailto:support@voicebotai.us' },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}