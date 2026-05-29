import Link from 'next/link';

export default function Terms() {
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px', color: '#0f0f0f' }}>Terms of Service</h1>
          <p style={{ color: '#9ca3af', marginBottom: '48px', fontSize: '0.9rem' }}>Last updated: May 21, 2026</p>

          {[
            { title: '1. Acceptance of Terms', content: 'By accessing or using VoiceBot AI, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.' },
            { title: '2. Description of Service', content: 'VoiceBot AI provides an AI-powered voice answering service that handles incoming calls, books appointments via Google Calendar, and qualifies leads for businesses.' },
            { title: '3. Account Registration', content: 'You must create an account to use our service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.' },
            { title: '4. Subscription and Billing', content: 'VoiceBot AI offers monthly subscription plans. You will be billed on a recurring monthly basis. You may cancel your subscription at any time, and your service will continue until the end of the current billing period.' },
            { title: '5. Refund Policy', content: 'We offer a 7-day money-back guarantee for first-time subscribers. After 7 days, subscription fees are non-refundable. To request a refund, contact us within 7 days of your initial purchase.' },
            { title: '6. Acceptable Use', content: 'You agree not to use VoiceBot AI for any unlawful purpose, to harass or harm others, to send spam or unsolicited communications, or to violate any applicable laws or regulations.' },
            { title: '7. Call Recording and AI Processing', content: 'By using our service, you acknowledge that calls handled by your VoiceBot are processed by AI. You are responsible for ensuring compliance with applicable call recording laws in your jurisdiction.' },
            { title: '8. Service Availability', content: 'We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We are not liable for any damages resulting from service interruptions.' },
            { title: '9. Intellectual Property', content: 'VoiceBot AI and its original content, features, and functionality are owned by VoiceBot AI and are protected by international copyright, trademark, and other intellectual property laws.' },
            { title: '10. Limitation of Liability', content: 'VoiceBot AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.' },
            { title: '11. Termination', content: 'We reserve the right to terminate or suspend your account at any time for violations of these Terms of Service. You may also terminate your account at any time through your account settings.' },
            { title: '12. Changes to Terms', content: 'We reserve the right to modify these terms at any time. We will notify you of significant changes via email. Your continued use of the service after changes constitutes acceptance of the new terms.' },
            { title: '13. Contact Us', content: 'If you have any questions about these Terms of Service, please contact us at: legal@voicebotai.us' },
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