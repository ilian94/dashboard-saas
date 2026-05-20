"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

const PLAN_LABELS = {
  starter: { label: "Starter Plan", color: "#60a5fa", minutes: 500 },
  scale: { label: "Scale Plan", color: "#a78bfa", minutes: 2000 },
  business: { label: "Business Plan", color: "#fbbf24", minutes: 6000 },
};

const IconPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [clientData, setClientData] = useState(null);

  const fetchCalls = useCallback(async (userId) => {
    const { data } = await supabase.from("calls").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
    if (data) setCalls(data);
  }, []);

  const fetchClientData = useCallback(async (userId) => {
    const { data } = await supabase.from("clients").select("google_connected, plan, twilio_number, business_name").eq("user_id", userId).maybeSingle();
    if (data) { setClientData(data); if (data.google_connected) setGoogleConnected(true); }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }
      setUser(session.user);
      await Promise.all([fetchCalls(session.user.id), fetchClientData(session.user.id)]);
      setLoading(false);
    };
    checkUser();
    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") { setGoogleConnected(true); window.history.replaceState({}, "", "/dashboard"); }
    if (params.get("success") === "true") { window.history.replaceState({}, "", "/dashboard"); }
  }, [fetchCalls, fetchClientData]);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/login"; };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080808' }}>
      <p style={{ color: '#444', fontSize: '0.9rem' }}>Loading...</p>
    </div>
  );

  const rdvCount = calls.filter(c => c.rdv_pris).length;
  const totalDuration = calls.reduce((acc, c) => acc + (c.duration || 0), 0);
  const plan = clientData?.plan ? PLAN_LABELS[clientData.plan] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 40px', borderBottom: '1px solid #141414', position: 'sticky', top: 0, background: 'rgba(8,8,8,0.9)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {plan && (
            <span style={{ fontSize: '0.75rem', padding: '4px 12px', borderRadius: '100px', border: '1px solid #222', color: plan.color, fontWeight: 600, letterSpacing: '0.02em' }}>
              {plan.label}
            </span>
          )}
          <span style={{ fontSize: '0.85rem', color: '#444' }}>{user.email}</span>
          <button onClick={handleLogout} style={{ fontSize: '0.85rem', padding: '7px 16px', border: '1px solid #1e1e1e', borderRadius: '8px', background: 'transparent', color: '#666', cursor: 'pointer' }}>
            Sign out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>
              {clientData?.business_name ? `Welcome, ${clientData.business_name}` : 'Dashboard'}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#444' }}>Here's what's happening with your VoiceBot.</p>
          </div>
          {!plan && (
            <a href="/pricing" style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600 }}>
              Choose a plan →
            </a>
          )}
        </div>

        {/* NO PLAN BANNER */}
        {!plan && (
          <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontWeight: 600, color: '#818cf8', marginBottom: '4px' }}>No active plan</p>
              <p style={{ fontSize: '0.85rem', color: '#555' }}>Subscribe to a plan to activate your VoiceBot.</p>
            </div>
            <a href="/pricing" style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              View plans
            </a>
          </div>
        )}

        {/* PLAN CARD */}
        {plan && (
          <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Current plan</p>
              <p style={{ fontWeight: 700, fontSize: '1.1rem', color: plan.color }}>{plan.label}</p>
              <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '4px' }}>{plan.minutes.toLocaleString()} minutes/month included</p>
            </div>
            {clientData?.twilio_number && (
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Phone number</p>
                <p style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#ccc', fontWeight: 600 }}>{clientData.twilio_number}</p>
              </div>
            )}
          </div>
        )}

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Calls received', value: calls.length, icon: <IconPhone /> },
            { label: 'Appointments booked', value: rdvCount, icon: <IconCalendar /> },
            { label: 'Total minutes', value: Math.round(totalDuration / 60), icon: <IconClock /> },
          ].map(s => (
            <div key={s.label} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
              <div style={{ color: '#444', marginBottom: '12px' }}>{s.icon}</div>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: '#555' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* GOOGLE CALENDAR */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Google Calendar</p>
            <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{googleConnected ? 'Connected' : 'Not connected'}</p>
            <p style={{ fontSize: '0.85rem', color: '#555' }}>
              {googleConnected ? 'Appointments are booked automatically.' : 'Connect your calendar for automatic scheduling.'}
            </p>
          </div>
          {!googleConnected ? (
            <a href="/api/google/auth" style={{ padding: '9px 20px', background: '#1a73e8', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
              Connect Google
            </a>
          ) : (
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '9px', color: '#4ade80', fontSize: '0.875rem', fontWeight: 600 }}>
              <IconCheck /> Connected
            </span>
          )}
        </div>

        {/* RECENT CALLS */}
        <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
          <p style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '20px' }}>Recent calls</p>
          {calls.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ color: '#222', marginBottom: '12px' }}><IconPhone /></div>
              <p style={{ fontSize: '0.875rem', color: '#333' }}>No calls yet. Your VoiceBot is ready.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {calls.map(call => (
                <div key={call.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#111', border: '1px solid #1a1a1a', borderRadius: '12px' }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '3px' }}>{call.caller_number}</p>
                    <p style={{ fontSize: '0.8rem', color: '#555' }}>{call.summary}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#444' }}>{call.duration}s</span>
                    {call.rdv_pris && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#4ade80', background: 'rgba(34,197,94,0.08)', padding: '2px 8px', borderRadius: '100px' }}>
                        <IconCheck /> Booked
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}