'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    fetch(`/api/stripe/session?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => { setSession(data); setLoading(false); });
  }, [sessionId]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#080b12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const plan = session?.plan || 'starter';
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const planMinutes = plan === 'starter' ? '500' : plan === 'scale' ? '2,000' : '6,000';
  const planPrice = plan === 'starter' ? '$229' : plan === 'scale' ? '$459' : '$879';

  return (
    <div style={{ minHeight: '100vh', background: '#080b12', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ maxWidth: 560, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <img src="/favicon.png" width={32} height={32} style={{ borderRadius: 8 }} alt="VoiceBot AI" />
            <span style={{ color: '#e2e8f0', fontSize: 15, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>VoiceBot AI</span>
          </div>
          <div style={{ width: 72, height: 72, background: 'rgba(99,102,241,0.15)', border: '2px solid rgba(99,102,241,0.4)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ margin: '0 0 12px', color: '#f8fafc', fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>You're all set!</h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 16, lineHeight: 1.6 }}>Your VoiceBot is being activated. Check your email for setup instructions.</p>
        </div>

        <div style={{ background: 'linear-gradient(135deg,#0f1420,#13192b)', border: '1px solid #1e2a3a', borderRadius: 16, padding: '28px 32px', marginBottom: 12 }}>
          <p style={{ margin: '0 0 16px', color: '#475569', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your subscription</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ margin: '0 0 4px', color: '#f8fafc', fontSize: 24, fontWeight: 800 }}>{planLabel} Plan</p>
              <p style={{ margin: 0, color: '#6366f1', fontSize: 14, fontWeight: 600 }}>{planMinutes} min/month included</p>
            </div>
            <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: 13, fontWeight: 700, padding: '6px 16px', borderRadius: 20 }}>{planPrice}/mo</span>
          </div>
          <div style={{ height: 1, background: '#1e2a3a', margin: '0 0 20px' }} />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Google Calendar', 'AI summaries', 'Call recording', '24/7 answering'].map(f => (
              <span key={f} style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: '#4ade80', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20 }}>✓ {f}</span>
            ))}
          </div>
        </div>

        <div style={{ background: '#0f1420', border: '1px solid #1e2a3a', borderRadius: 16, padding: '28px 32px', marginBottom: 24 }}>
          <p style={{ margin: '0 0 20px', color: '#f8fafc', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Next steps</p>
          {[
            { n: 1, title: 'Check your email', desc: 'Your VoiceBot number and setup instructions have been sent.' },
            { n: 2, title: 'Connect Google Calendar', desc: 'So your VoiceBot can book appointments automatically.' },
            { n: 3, title: 'Forward your business number', desc: 'Redirect calls to your VoiceBot number to go live.' },
          ].map(step => (
            <div key={step.n} style={{ display: 'flex', gap: 14, marginBottom: step.n < 3 ? 16 : 0 }}>
              <div style={{ width: 28, height: 28, minWidth: 28, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', marginTop: 2 }}>{step.n}</div>
              <div>
                <p style={{ margin: '0 0 3px', color: '#f8fafc', fontSize: 14, fontWeight: 700 }}>{step.title}</p>
                <p style={{ margin: 0, color: '#64748b', fontSize: 13, lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          style={{ width: '100%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', padding: '16px 36px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer' }}
        >
          Go to Dashboard →
        </button>

        <p style={{ textAlign: 'center', color: '#334155', fontSize: 12, marginTop: 20 }}>Questions? Email us at support@voicebot.ai</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#080b12', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}