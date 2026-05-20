"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (err) { setError(err.message); setLoading(false); return; }
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <Link href="/" style={{ color: '#444', textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: '20px' }}>← Back</Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '6px' }}>Sign in</h1>
          <p style={{ fontSize: '0.875rem', color: '#555' }}>Welcome back to VoiceBot AI.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #222', background: '#111', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required
              style={{ padding: '12px 16px', borderRadius: '10px', border: '1px solid #222', background: '#111', color: 'white', fontSize: '0.9rem', outline: 'none' }} />
          </div>
          {error && <p style={{ fontSize: '0.85rem', color: '#f87171', background: 'rgba(248,113,113,0.1)', padding: '10px 14px', borderRadius: '8px' }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ padding: '13px', background: 'white', color: 'black', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '4px' }}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        <p style={{ fontSize: '0.85rem', textAlign: 'center', color: '#555' }}>
          No account?{' '}
          <Link href="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}