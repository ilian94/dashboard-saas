import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', color: '#0f0f0f', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <p style={{ fontSize: '0.8rem', color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>Error 404</p>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '16px', color: '#0f0f0f' }}>
          Page not found
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: 1.7, marginBottom: '40px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" style={{ background: '#0f0f0f', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', padding: '12px 28px', borderRadius: '10px' }}>
            Go home
          </Link>
          <Link href="/dashboard" style={{ background: 'transparent', color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: '0.95rem', padding: '12px 28px', borderRadius: '10px', border: '1px solid #e5e7eb' }}>
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}