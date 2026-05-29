import Link from 'next/link';

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', color: '#0f0f0f', fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* BANDEAU CTA */}
      <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>
          VoiceBot AI — Your AI receptionist, live in 5 minutes.
        </p>
        <Link href="/register" style={{ background: '#fff', color: '#6366f1', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem', padding: '8px 20px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
          Start free trial →
        </Link>
      </div>

      <div style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: '40px' }}>← Back</Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px', color: '#0f0f0f' }}>Privacy Policy</h1>
          <p style={{ color: '#9ca3af', marginBottom: '48px', fontSize: '0.9rem' }}>Last updated: May 21, 2026</p>

          {[
            { title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as your name, email address, and company name when you create an account. We also collect call data including caller numbers, call duration, and AI-generated summaries of calls handled by your VoiceBot.' },
            { title: '2. How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.' },
            { title: '3. Data Storage', content: 'Your data is stored securely using Supabase infrastructure. Call recordings are not stored — only AI-generated summaries are retained. We retain your data for as long as your account is active.' },
            { title: '4. Third-Party Services', content: 'We use the following third-party services: Twilio (phone infrastructure), Anthropic Claude AI (call processing), Google Calendar (appointment booking), and Stripe (payment processing). Each service has its own privacy policy.' },
            { title: '5. Data Security', content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
            { title: '6. Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. You can do so by contacting us at the email address below or through your account settings.' },
            { title: '7. California Privacy Rights (CCPA)', content: 'California residents have the right to know what personal data we collect, the right to delete personal data, and the right to opt-out of the sale of personal data. We do not sell personal data.' },
            { title: '8. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at: privacy@voicebotai.us' },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#0f0f0f' }}>{section.title}</h2>
              <p style={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>{section.content}</p>
            </div>
          ))}

          {/* CTA BAS DE PAGE */}
          <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '16px', padding: '32px', textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>Ready to never miss a call again?</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginBottom: '20px' }}>Start free for 7 days. No charge until day 8.</p>
            <Link href="/register" style={{ background: '#fff', color: '#6366f1', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', padding: '12px 28px', borderRadius: '10px', display: 'inline-block' }}>
              Start free trial →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}