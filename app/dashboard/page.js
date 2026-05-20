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

const IconHome = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconPhone = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const IconCalendar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconSettings = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>;
const IconBilling = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
const IconLogout = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconCheck = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');

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

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconHome /> },
    { id: 'calls', label: 'Calls', icon: <IconPhone /> },
    { id: 'settings', label: 'Settings', icon: <IconSettings /> },
    { id: 'billing', label: 'Billing', icon: <IconBilling /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '220px', minHeight: '100vh', background: '#0a0a0a', borderRight: '1px solid #141414', display: 'flex', flexDirection: 'column', padding: '24px 12px', position: 'fixed', top: 0, left: 0 }}>
        <div style={{ padding: '0 12px', marginBottom: '32px' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>VoiceBot AI</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: 'none', background: activePage === item.id ? '#161616' : 'transparent', color: activePage === item.id ? 'white' : '#555', cursor: 'pointer', fontSize: '0.875rem', fontWeight: activePage === item.id ? 600 : 400, textAlign: 'left', width: '100%', transition: 'all 0.15s' }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: '1px solid #141414', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {plan && (
            <div style={{ padding: '10px 12px', background: '#111', borderRadius: '8px', marginBottom: '4px' }}>
              <p style={{ fontSize: '0.7rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '3px' }}>Plan</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: plan.color }}>{plan.label}</p>
            </div>
          )}
          <div style={{ padding: '8px 12px' }}>
            <p style={{ fontSize: '0.75rem', color: '#444', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            <button onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#555', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>
              <IconLogout /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ marginLeft: '220px', flex: 1, padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>

        {/* DASHBOARD PAGE */}
        {activePage === 'dashboard' && (
          <>
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
          </>
        )}

        {/* CALLS PAGE */}
        {activePage === 'calls' && (
          <>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Calls</h1>
              <p style={{ fontSize: '0.85rem', color: '#444' }}>All calls handled by your VoiceBot.</p>
            </div>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
              {calls.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ color: '#222', marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><IconPhone /></div>
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
          </>
        )}

        {/* SETTINGS PAGE */}
        {activePage === 'settings' && (
          <>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Settings</h1>
              <p style={{ fontSize: '0.85rem', color: '#444' }}>Manage your account and integrations.</p>
            </div>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Google Calendar</p>
                <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{googleConnected ? 'Connected' : 'Not connected'}</p>
                <p style={{ fontSize: '0.85rem', color: '#555' }}>
                  {googleConnected ? 'Appointments are booked automatically.' : 'Connect your calendar for automatic scheduling.'}
                </p>
              </div>
              {!googleConnected ? (
                <a href="/api/google/auth" style={{ padding: '9px 20px', background: '#1a73e8', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600 }}>
                  Connect Google
                </a>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '9px', color: '#4ade80', fontSize: '0.875rem', fontWeight: 600 }}>
                  <IconCheck /> Connected
                </span>
              )}
            </div>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
              <p style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '16px' }}>Account</p>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '4px' }}>Email</p>
              <p style={{ fontSize: '0.95rem', color: '#ccc', fontWeight: 500 }}>{user.email}</p>
            </div>
          </>
        )}

        {/* BILLING PAGE */}
        {activePage === 'billing' && (
          <>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Billing</h1>
              <p style={{ fontSize: '0.85rem', color: '#444' }}>Manage your subscription.</p>
            </div>
            <div style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '24px' }}>
              {plan ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#444', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Current plan</p>
                    <p style={{ fontWeight: 700, fontSize: '1.2rem', color: plan.color, marginBottom: '4px' }}>{plan.label}</p>
                    <p style={{ fontSize: '0.85rem', color: '#555' }}>{plan.minutes.toLocaleString()} minutes/month included</p>
                  </div>
                  <a href="/pricing" style={{ padding: '9px 20px', background: '#161616', border: '1px solid #2a2a2a', color: '#ccc', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600 }}>
                    Upgrade plan
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#818cf8', marginBottom: '4px' }}>No active plan</p>
                    <p style={{ fontSize: '0.85rem', color: '#555' }}>Subscribe to activate your VoiceBot.</p>
                  </div>
                  <a href="/pricing" style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600 }}>
                    View plans →
                  </a>
                </div>
              )}
            </div>
          </>
        )}

      </main>
    </div>
  );
}