import Link from 'next/link';

export default function Refund() {
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '8px', color: '#0f0f0f' }}>Refund Policy</h1>
          <p style={{ color: '#9ca3af', marginBottom: '48px', fontSize: '0.9rem' }}>Last updated: May 21, 2026</p>

          {[
            { title: '1. 7-Day Free Trial', content: 'Every plan includes a 7-day free trial. You will not be charged until day 8. If you cancel before day 8, you will not be billed at all.' },
            { title: '2. Money-Back Guarantee', content: 'If you are not satisfied with VoiceBot AI within the first 7 days of your paid subscription, contact us and we will issue a full refund — no questions asked.' },
            { title: '3. How to Request a Refund', content: 'To request a refund, email us at support@voicebotai.us within 7 days of your first charge. Include your account email and reason for the refund. We process all refunds within 5-7 business days.' },
            { title: '4. After the Trial Period', content: 'After the 7-day trial period, subscription fees are non-refundable. You may cancel your subscription at any time and your service will continue until the end of the current billing period.' },
            { title: '5. Cancellation', content: 'You can cancel your subscription at any time from your dashboard under Billing settings. Cancellation takes effect at the end of your current billing cycle.' },
            { title: '6. Contact Us', content: 'If you have any questions about our refund policy, please contact us at: support@voicebotai.us' },
          ].map(section => (
            <div key={section.title} style={{ marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', color: '#0f0f0f' }}>{section.title}</h2>
              <p style={{ color: '#6b7280', lineHeight: 1.8, fontSize: '0.9rem', margin: 0 }}>{section.content}</p>
            </div>
          ))}

          {/* CTA BAS DE PAGE */}
          <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '16px', padding: '32px', textAlign: 'center', marginTop: '20px' }}>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem', marginBottom: '8px' }}>Try VoiceBot AI risk-free</h3>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem', marginBottom: '20px' }}>7-day free trial. No charge until day 8. Cancel anytime.</p>
            <Link href="/register" style={{ background: '#fff', color: '#6366f1', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', padding: '12px 28px', borderRadius: '10px', display: 'inline-block' }}>
              Start free trial →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}