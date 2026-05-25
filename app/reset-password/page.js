"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
const C = { bg: '#0f1117', card: '#161b27', border: '#1e2433', input: '#0f1117', text: '#6b7280', label: '#9ca3af' };

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '6px' }}>New password</h1>
          <p style={{ fontSize: '0.875rem', color: C.text }}>Enter your new password below.</p>
        </div>

        {success ? (
          <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '10px', padding: '16px' }}>
            <p style={{ color: '#4ade80', fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Password updated ✓</p>
            <p style={{ color: C.text, fontSize: '0.85rem' }}>Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>New password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: 'white', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Confirm password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" required
                style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: 'white', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            {error && <p style={{ fontSize: '0.85rem', color: '#f87171', background: 'rgba(248,113,113,0.08)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)' }}>{error}</p>}
            <button type="submit" disabled={loading} style={{ padding: '13px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
              {loading ? 'Updating...' : 'Update password →'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}