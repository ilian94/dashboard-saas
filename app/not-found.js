import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 24px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em', marginBottom: '48px', display: 'block' }}>VoiceBot AI</span>

      <div style={{ fontSize: '6rem', fontWeight: 800, letterSpacing: '-0.05em', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '16px' }}>404</div>

      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#0f0f0f', marginBottom: '12px' }}>Page not found</h1>
      <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '40px', maxWidth: '380px', lineHeight: 1.6 }}>The page you're looking for doesn't exist or has been moved.</p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px' }}>
          Go home
        </Link>
        <Link href="/pricing" style={{ background: '#f9fafb', color: '#0f0f0f', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem', padding: '13px 28px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
          See pricing
        </Link>
      </div>
    </div>
  );
}