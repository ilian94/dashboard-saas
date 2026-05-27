"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const supabase = createClient();

const C = {
  bg: '#f9fafb',
  card: '#ffffff',
  border: '#e5e7eb',
  input: '#f9fafb',
  text: '#6b7280',
  label: '#9ca3af',
  textPrimary: '#0f0f0f',
  accent: '#6366f1',
};

const EyeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EyeOffIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (err) { setError(err.message); setLoading(false); return; }
    window.location.href = "/dashboard";
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    const { error: err } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setForgotLoading(false);
    if (err) { setForgotError(err.message); return; }
    setForgotSent(true);
  };

  if (showForgot) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '32px', textAlign: 'center' }}>
            <Link href="/" style={{ fontWeight: 700, fontSize: '1rem', color: C.textPrimary, textDecoration: 'none', letterSpacing: '-0.02em' }}>VoiceBot AI</Link>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div>
              <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotError(""); }} style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', fontSize: '0.85rem', padding: 0, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                Back to sign in
              </button>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.03em', marginBottom: '6px' }}>Reset password</h1>
              <p style={{ fontSize: '0.875rem', color: C.text }}>Enter your email and we'll send you a reset link.</p>
            </div>
            {forgotSent ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px' }}>
                <p style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Email sent</p>
                <p style={{ color: '#15803d', fontSize: '0.85rem' }}>Check your inbox and follow the link to reset your password.</p>
              </div>
            ) : (
              <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email</label>
                  <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="you@company.com" required
                    style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: C.textPrimary, fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                </div>
                {forgotError && <p style={{ fontSize: '0.85rem', color: '#ef4444', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>{forgotError}</p>}
                <button type="submit" disabled={forgotLoading} style={{ padding: '13px', background: C.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                  {forgotLoading ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: '1rem', color: C.textPrimary, textDecoration: 'none', letterSpacing: '-0.02em' }}>VoiceBot AI</Link>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.03em', marginBottom: '6px' }}>Sign in</h1>
            <p style={{ fontSize: '0.875rem', color: C.text }}>Welcome back to VoiceBot AI.</p>
          </div>

          <button onClick={handleGoogle} disabled={googleLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: '#fff', color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ color: C.label, fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required
                style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: C.textPrimary, fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
                  style={{ padding: '12px 16px', paddingRight: '44px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: C.textPrimary, fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.label, padding: '4px' }}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button type="button" onClick={() => setShowForgot(true)} style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', fontSize: '0.82rem', padding: 0 }}>
                Forgot password?
              </button>
            </div>
            {error && <p style={{ fontSize: '0.85rem', color: '#ef4444', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: '13px', background: C.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '4px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p style={{ fontSize: '0.85rem', textAlign: 'center', color: C.text }}>
            No account?{' '}<Link href="/register" style={{ color: C.accent, textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}