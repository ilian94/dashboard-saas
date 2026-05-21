"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const supabase = createClient();
const C = { bg: '#0f1117', card: '#161b27', border: '#1e2433', input: '#0f1117', text: '#6b7280', label: '#9ca3af' };

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
    if (err) { setError(err.message); setLoading(false); return; }
    window.location.href = "/dashboard";
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <Link href="/" style={{ color: C.text, textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block', marginBottom: '20px' }}>← Back</Link>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', letterSpacing: '-0.03em', marginBottom: '6px' }}>Sign in</h1>
          <p style={{ fontSize: '0.875rem', color: C.text }}>Welcome back to VoiceBot AI.</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[{ name: 'email', label: 'Email', type: 'email', placeholder: 'you@company.com' }, { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' }].map(field => (
            <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: C.label, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{field.label}</label>
              <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} placeholder={field.placeholder} required
                style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.input, color: 'white', fontSize: '0.9rem', outline: 'none' }} />
            </div>
          ))}
          {error && <p style={{ fontSize: '0.85rem', color: '#f87171', background: 'rgba(248,113,113,0.08)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.2)' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ padding: '13px', background: 'white', color: 'black', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '4px' }}>
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>
        <p style={{ fontSize: '0.85rem', textAlign: 'center', color: C.text }}>
          No account?{' '}<Link href="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}