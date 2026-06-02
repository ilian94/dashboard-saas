"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const supabase = createClient();

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

const IconBolt = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconMessage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const features = [
  { icon: <IconBolt />, title: 'Answers in under 2 seconds', desc: '24/7, even at 3am' },
  { icon: <IconCalendar />, title: 'Books appointments automatically', desc: 'Syncs with Google Calendar & Calendly' },
  { icon: <IconMessage />, title: 'Sends SMS confirmations', desc: 'Instant confirmation after every booking' },
];

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const { data, error: err } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
  options: {
    emailRedirectTo: `${window.location.origin}/dashboard`,
  }
});
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      await supabase.from("clients").insert([{ user_id: data.user.id, email: form.email, business_name: form.company }]);
      await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, businessName: form.company }),
      });
      setConfirmed(true);
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: '1rem', color: '#0f0f0f', textDecoration: 'none', display: 'block', marginBottom: '40px' }}>VoiceBot AI</Link>
          <div style={{ width: 72, height: 72, background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0f0f0f', letterSpacing: '-0.03em', marginBottom: '12px' }}>Check your email</h1>
          <p style={{ fontSize: '0.95rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '32px' }}>
            We sent a confirmation link to <strong style={{ color: '#0f0f0f' }}>{form.email}</strong>.<br />
            Click the link to verify your account and get started.
          </p>
          <p style={{ fontSize: '0.82rem', color: '#9ca3af' }}>
            Already confirmed?{' '}
            <Link href="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', position: 'relative', overflow: 'hidden' }}>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="left-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />

        <Link href="/" style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', textDecoration: 'none', letterSpacing: '-0.02em', marginBottom: '60px', display: 'block' }}>VoiceBot AI</Link>

        <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '20px' }}>
          Your phone answers itself.<br />Your calendar fills itself.
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '48px', maxWidth: '380px' }}>
          Set up in 5 minutes. No code required.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {features.map(f => (
            <div key={f.title} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', margin: '0 0 2px' }}>{f.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', marginBottom: '12px' }}>TRUSTED BY BUSINESSES IN</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['Dental', 'Medical', 'Legal', 'Real Estate'].map(t => (
              <span key={t} style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', padding: '4px 12px', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 500 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', minHeight: '100vh' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>

          <div className="mobile-logo" style={{ marginBottom: '24px', textAlign: 'center' }}>
            <Link href="/" style={{ fontWeight: 700, fontSize: '1rem', color: '#0f0f0f', textDecoration: 'none' }}>VoiceBot AI</Link>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {['7-day free trial', 'No charge until day 8', 'Cancel anytime'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: '#16a34a', fontWeight: 600 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {t}
              </span>
            ))}
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f0f0f', letterSpacing: '-0.03em', marginBottom: '6px' }}>Create your account</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '28px' }}>Start free for 7 days. No charge until day 8.</p>

          <button onClick={handleGoogle} disabled={googleLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px', background: '#fff', color: '#0f0f0f', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', system-ui, sans-serif", boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <GoogleIcon />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
            <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
            {[
              { name: 'company', label: 'Business name', type: 'text', placeholder: 'Smith Dental Clinic' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters', minLength: 6 },
            ].map(field => (
              <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{field.label}</label>
                <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} required minLength={field.minLength}
                  style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f9fafb', color: '#0f0f0f', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            ))}
          </div>

          {error && <p style={{ fontSize: '0.85rem', color: '#ef4444', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca', marginBottom: '16px' }}>{error}</p>}

          <button onClick={handleSubmit} disabled={loading} style={{ padding: '14px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', system-ui, sans-serif", boxShadow: '0 4px 14px rgba(99,102,241,0.35)', marginBottom: '20px' }}>
            {loading ? 'Creating account...' : 'Start free trial →'}
          </button>

          <p style={{ fontSize: '0.85rem', textAlign: 'center', color: '#6b7280', marginBottom: '16px' }}>
            Already have an account?{' '}<Link href="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>

          <p style={{ fontSize: '0.72rem', textAlign: 'center', color: '#9ca3af', lineHeight: 1.5 }}>
            By creating an account, you agree to our{' '}
            <Link href="/terms" style={{ color: '#6b7280', textDecoration: 'underline' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: '#6b7280', textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .left-panel { display: none !important; }
          .mobile-logo { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-logo { display: none !important; }
        }
      `}</style>
    </div>
  );
}