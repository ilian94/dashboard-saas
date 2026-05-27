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

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
);

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", company: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

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
    const { data, error: err } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (err) { setError(err.message); setLoading(false); return; }
    if (data.user) {
      await supabase.from("clients").insert([{ user_id: data.user.id, email: form.email, business_name: form.company }]);
      await fetch('/api/email/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, businessName: form.company }),
      });
      window.location.href = "/dashboard";
    } else { setError("Check your email to confirm your account."); setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <Link href="/" style={{ fontWeight: 700, fontSize: '1rem', color: C.textPrimary, textDecoration: 'none', letterSpacing: '-0.02em' }}>VoiceBot AI</Link>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>

          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.03em', marginBottom: '6px' }}>Create your account</h1>
            <p style={{ fontSize: '0.875rem', color: C.text }}>Get started in minutes. No credit card required.</p>
          </div>

          <button onClick={handleGoogle} disabled={googleLoading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '12px', background: '#fff', color: C.textPrimary, border: `1px solid ${C.border}`, borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
            <GoogleIcon />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ color: C.label, fontSize: '0.8rem' }}>or</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'company', label: 'Company name', type: 'text', placeholder: 'Acme Inc.' },
              { name: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters', minLength: 6 },
            ].map(field => (
              <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{field.label}</label>
                <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} required minLength={field.minLength}
                  style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: C.textPrimary, fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
              </div>
            ))}
            {error && <p style={{ fontSize: '0.85rem', color: '#ef4444', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: '13px', background: C.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '4px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p style={{ fontSize: '0.85rem', textAlign: 'center', color: C.text }}>
            Already have an account?{' '}<Link href="/login" style={{ color: C.accent, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>

          <p style={{ fontSize: '0.78rem', textAlign: 'center', color: C.label, lineHeight: 1.5 }}>
            By creating an account, you agree to our{' '}
            <Link href="/terms" style={{ color: C.text, textDecoration: 'underline' }}>Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" style={{ color: C.text, textDecoration: 'underline' }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}