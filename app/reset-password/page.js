"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

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

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setSuccess(true);
    setTimeout(() => { window.location.href = "/login"; }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <a href="/" style={{ fontWeight: 700, fontSize: '1rem', color: C.textPrimary, textDecoration: 'none', letterSpacing: '-0.02em' }}>VoiceBot AI</a>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: C.textPrimary, letterSpacing: '-0.03em', marginBottom: '6px' }}>New password</h1>
            <p style={{ fontSize: '0.875rem', color: C.text }}>Enter your new password below.</p>
          </div>

          {success ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px' }}>
              <p style={{ color: '#16a34a', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Password updated</p>
              <p style={{ color: '#15803d', fontSize: '0.85rem' }}>Redirecting to login...</p>
            </div>
          ) : !ready ? (
            <p style={{ color: C.text, fontSize: '0.9rem' }}>Verifying...</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>New password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" required
                    style={{ padding: '12px 16px', paddingRight: '44px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: C.textPrimary, fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.label, padding: '4px' }}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Confirm password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required
                    style={{ padding: '12px 16px', paddingRight: '44px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: C.textPrimary, fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.label, padding: '4px' }}>
                    {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              {error && <p style={{ fontSize: '0.85rem', color: '#ef4444', background: '#fef2f2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #fecaca', margin: 0 }}>{error}</p>}
              <button type="submit" disabled={loading} style={{ padding: '13px', background: C.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}