export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: 'white', fontFamily: 'system-ui, sans-serif', padding: '80px 20px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <a href="/" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: '40px' }}>← Back</a>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#6b7280', marginBottom: '48px', fontSize: '0.9rem' }}>Last updated: May 21, 2026</p>

        {[
          { title: '1. Information We Collect', content: 'We collect information you provide directly to us, such as your name, email address, and company name when you create an account. We also collect call data including caller numbers, call duration, and AI-generated summaries of calls handled by your VoiceBot.' },
          { title: '2. How We Use Your Information', content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.' },
          { title: '3. Data Storage', content: 'Your data is stored securely using Supabase infrastructure. Call recordings are not stored — only AI-generated summaries are retained. We retain your data for as long as your account is active.' },
          { title: '4. Third-Party Services', content: 'We use the following third-party services: Twilio (phone infrastructure), Anthropic Claude AI (call processing), Google Calendar (appointment booking), and Stripe (payment processing). Each service has its own privacy policy.' },
          { title: '5. Data Security', content: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
          { title: '6. Your Rights', content: 'You have the right to access, correct, or delete your personal data at any time. You can do so by contacting us at the email address below or through your account settings.' },
          { title: '7. California Privacy Rights (CCPA)', content: 'California residents have the right to know what personal data we collect, the right to delete personal data, and the right to opt-out of the sale of personal data. We do not sell personal data.' },
          { title: '8. Contact Us', content: 'If you have any questions about this Privacy Policy, please contact us at: privacy@voicebotai.com' },
        ].map(section => (
          <div key={section.title} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px', color: 'white' }}>{section.title}</h2>
            <p style={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.95rem' }}>{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}