"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const C = { bg: '#0f1117', sidebar: '#0d1117', card: '#161b27', border: '#1e2433', text: '#6b7280', label: '#9ca3af' };

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
const IconSetup = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 8 12 12 14 14"/></svg>;
const IconX = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconReport = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;

function OnboardingBanner({ plan, googleConnected, twilioNumber, onDismiss }) {
  const steps = [
    { label: 'Account created', done: true, action: null },
    { label: 'Choose a plan', done: !!plan, action: !plan ? <a href="/pricing" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#818cf8', textDecoration: 'none', whiteSpace: 'nowrap' }}>Choose →</a> : null },
    { label: 'Connect Google Calendar', done: googleConnected, action: !googleConnected ? <a href="/api/google/auth" style={{ fontSize: '0.78rem', fontWeight: 600, color: '#60a5fa', textDecoration: 'none', whiteSpace: 'nowrap' }}>Connect →</a> : null },
    { label: 'Phone number assigned', done: !!twilioNumber, action: !twilioNumber && !!plan ? <span style={{ fontSize: '0.78rem', color: C.text }}>Pending...</span> : null },
    { label: 'Forward your number', done: false, action: twilioNumber ? <a href="#" onClick={(e) => { e.preventDefault(); onDismiss(); }} style={{ fontSize: '0.78rem', fontWeight: 600, color: '#4ade80', textDecoration: 'none', whiteSpace: 'nowrap' }}>Mark done →</a> : null },
  ];

  const completedCount = steps.filter(s => s.done).length;
  const progress = Math.round((completedCount / steps.length) * 100);
  if (completedCount === steps.length) return null;

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>Get started with VoiceBot AI</p>
          <p style={{ fontSize: '0.8rem', color: C.text }}>{completedCount} of {steps.length} steps completed</p>
        </div>
        <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer', padding: '4px' }}><IconX /></button>
      </div>
      <div style={{ height: '4px', background: C.border, borderRadius: '100px', marginBottom: '16px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #4f46e5, #4ade80)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: step.done ? 'rgba(74,222,128,0.12)' : C.bg, border: `1px solid ${step.done ? 'rgba(74,222,128,0.3)' : C.border}` }}>
                {step.done ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.border, display: 'block' }} />}
              </div>
              <span style={{ fontSize: '0.85rem', color: step.done ? '#e5e7eb' : C.text, fontWeight: step.done ? 500 : 400 }}>{step.label}</span>
            </div>
            {step.action}
          </div>
        ))}
      </div>
    </div>
  );
}

function ScriptSettings({ clientPlan, userId }) {
  const [script, setScript] = useState({ business_name: '', services: '', questions: '', tone: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadScript = async () => {
      const { data } = await supabase.from('clients').select('bot_script').eq('user_id', userId).maybeSingle();
      if (data?.bot_script) setScript({ business_name: '', services: '', questions: '', tone: '', ...data.bot_script });
    };
    loadScript();
  }, [userId]);

  const handleSave = async () => {
    setSaving(true);
    const scriptToSave = clientPlan === 'scale'
      ? { business_name: script.business_name }
      : { business_name: script.business_name, services: script.services, questions: script.questions, tone: script.tone };
    await supabase.from('clients').update({ bot_script: scriptToSave }).eq('user_id', userId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.bg, color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: '0.78rem', fontWeight: 600, color: C.label, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' };

  if (!clientPlan || clientPlan === 'starter') {
    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
        <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '12px' }}>VoiceBot Script</p>
        <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontWeight: 600, color: '#818cf8', marginBottom: '4px', fontSize: '0.9rem' }}>Available on Scale & Business</p>
            <p style={{ fontSize: '0.82rem', color: C.text }}>Upgrade to customize your VoiceBot's script and personality.</p>
          </div>
          <a href="/pricing" style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Upgrade →</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '4px' }}>VoiceBot Script</p>
          <p style={{ fontSize: '0.82rem', color: C.text }}>Customize how your VoiceBot talks to callers.</p>
        </div>
        {clientPlan === 'scale' && <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '100px', border: `1px solid rgba(167,139,250,0.3)`, color: '#a78bfa', fontWeight: 600 }}>Scale</span>}
        {clientPlan === 'business' && <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '100px', border: `1px solid rgba(251,191,36,0.3)`, color: '#fbbf24', fontWeight: 600 }}>Business</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Business name</label>
          <input value={script.business_name} onChange={e => setScript({ ...script, business_name: e.target.value })} placeholder="e.g. Smith Dental Clinic" style={inputStyle} />
          <p style={{ fontSize: '0.75rem', color: C.text, marginTop: '4px' }}>Used in the greeting: "Thank you for calling [business name]"</p>
        </div>
        {clientPlan === 'business' && (
          <>
            <div>
              <label style={labelStyle}>Services offered</label>
              <input value={script.services} onChange={e => setScript({ ...script, services: e.target.value })} placeholder="e.g. dental cleanings, consultations, emergency appointments" style={inputStyle} />
              <p style={{ fontSize: '0.75rem', color: C.text, marginTop: '4px' }}>What the bot can help callers with.</p>
            </div>
            <div>
              <label style={labelStyle}>Questions to ask callers</label>
              <input value={script.questions} onChange={e => setScript({ ...script, questions: e.target.value })} placeholder="e.g. their name, preferred date, type of service needed" style={inputStyle} />
              <p style={{ fontSize: '0.75rem', color: C.text, marginTop: '4px' }}>Information to collect before booking.</p>
            </div>
            <div>
              <label style={labelStyle}>Tone & personality</label>
              <input value={script.tone} onChange={e => setScript({ ...script, tone: e.target.value })} placeholder="e.g. warm and professional, concise, friendly" style={inputStyle} />
              <p style={{ fontSize: '0.75rem', color: C.text, marginTop: '4px' }}>How the bot should sound.</p>
            </div>
          </>
        )}
        <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: saved ? 'rgba(34,197,94,0.12)' : 'white', color: saved ? '#4ade80' : 'black', border: saved ? '1px solid rgba(34,197,94,0.3)' : 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', alignSelf: 'flex-start', transition: 'all 0.2s' }}>
          {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}

function WeeklyReport({ userId }) {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      const { data } = await supabase.from('calls').select('*').eq('user_id', userId).order('created_at', { ascending: false });
      if (!data) { setLoading(false); return; }

      // Grouper par semaine
      const weekMap = {};
      data.forEach(call => {
        const date = new Date(call.created_at);
        const monday = new Date(date);
        monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
        monday.setHours(0, 0, 0, 0);
        const key = monday.toISOString();
        if (!weekMap[key]) weekMap[key] = { start: monday, calls: [] };
        weekMap[key].calls.push(call);
      });

      const result = Object.values(weekMap).sort((a, b) => b.start - a.start).slice(0, 8).map(w => ({
        label: w.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalCalls: w.calls.length,
        totalRdv: w.calls.filter(c => c.rdv_pris).length,
        totalMinutes: Math.round(w.calls.reduce((acc, c) => acc + (c.duration || 0), 0) / 60),
      }));

      setWeeks(result);
      setLoading(false);
    };
    loadReport();
  }, [userId]);

  if (loading) return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}><p style={{ color: C.text, fontSize: '0.9rem' }}>Loading...</p></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {weeks.length === 0 ? (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <p style={{ color: C.text, fontSize: '0.875rem' }}>No call data yet. Reports will appear once your VoiceBot starts handling calls.</p>
        </div>
      ) : weeks.map((week, i) => (
        <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Week of {week.label}</p>
              {i === 0 && <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 600, background: 'rgba(74,222,128,0.08)', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(74,222,128,0.2)' }}>Current week</span>}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Calls', value: week.totalCalls, icon: <IconPhone /> },
              { label: 'Appointments', value: week.totalRdv, icon: <IconCalendar /> },
              { label: 'Minutes', value: week.totalMinutes, icon: <IconClock /> },
            ].map(s => (
              <div key={s.label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '14px' }}>
                <div style={{ color: C.text, marginBottom: '6px' }}>{s.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '3px' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: C.text }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState([]);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [clientData, setClientData] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const fetchCalls = useCallback(async (userId) => {
    const { data } = await supabase.from("calls").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
    if (data) setCalls(data);
  }, []);

  const fetchClientData = useCallback(async (userId) => {
    const { data } = await supabase.from("clients").select("google_connected, plan, twilio_number, business_name").eq("user_id", userId).maybeSingle();
    if (data) {
      setClientData(data);
      if (data.google_connected) setGoogleConnected(true);
      const dismissed = localStorage.getItem('onboarding_dismissed');
      const fullySetup = data.plan && data.google_connected && data.twilio_number;
      if (!dismissed && !fullySetup) setShowOnboarding(true);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) { window.location.href = "/login"; return; }
      setUser(authUser);
      await Promise.all([fetchCalls(authUser.id), fetchClientData(authUser.id)]);
      setLoading(false);
    };
    checkUser();
    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") { setGoogleConnected(true); window.history.replaceState({}, "", "/dashboard"); }
    if (params.get("success") === "true") { window.history.replaceState({}, "", "/dashboard"); }
  }, [fetchCalls, fetchClientData]);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.href = "/login"; };
  const handleDismissOnboarding = () => { localStorage.setItem('onboarding_dismissed', 'true'); setShowOnboarding(false); };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <p style={{ color: C.text, fontSize: '0.9rem' }}>Loading...</p>
    </div>
  );

  const rdvCount = calls.filter(c => c.rdv_pris).length;
  const totalDuration = calls.reduce((acc, c) => acc + (c.duration || 0), 0);
  const plan = clientData?.plan ? PLAN_LABELS[clientData.plan] : null;

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <IconHome /> },
    { id: 'calls', label: 'Calls', icon: <IconPhone /> },
    { id: 'reports', label: 'Reports', icon: <IconReport /> },
    { id: 'setup', label: 'Setup', icon: <IconSetup /> },
    { id: 'settings', label: 'Settings', icon: <IconSettings /> },
    { id: 'billing', label: 'Billing', icon: <IconBilling /> },
  ];

  const setupSteps = [
    { number: '01', title: 'Choose a plan', done: !!plan, desc: 'Subscribe to one of our plans to activate your VoiceBot. You can upgrade or cancel anytime.', action: !plan ? <a href="/pricing" style={{ display: 'inline-block', marginTop: '12px', padding: '8px 18px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>View plans →</a> : null },
    { number: '02', title: 'Connect Google Calendar', done: googleConnected, desc: 'Link your Google Calendar so your VoiceBot can automatically book appointments in real time.', action: !googleConnected ? <a href="/api/google/auth" style={{ display: 'inline-block', marginTop: '12px', padding: '8px 18px', background: '#1a73e8', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>Connect Google →</a> : null },
    { number: '03', title: 'Receive your phone number', done: !!clientData?.twilio_number, desc: clientData?.twilio_number ? `Your dedicated number is ${clientData.twilio_number}.` : 'Once your plan is active, we will assign you a dedicated phone number within 24 hours.' },
    {
      number: '04', title: 'Forward your business number to VoiceBot', done: false,
      desc: "Redirect your existing business number to your VoiceBot number so every call is handled automatically.",
      extra: (
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Mobile (AT&T, Verizon, T-Mobile)', value: `Dial **21*${clientData?.twilio_number || '+1XXXXXXXXXX'}# from your phone` },
            { label: 'Landline / VoIP', value: 'Contact your provider and ask to enable unconditional call forwarding to your VoiceBot number' },
            { label: 'Business phone (RingCentral, Dialpad, Nextiva)', value: 'Go to your admin settings → Call forwarding → Enter your VoiceBot number' },
          ].map(item => (
            <div key={item.label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px 16px' }}>
              <p style={{ fontSize: '0.75rem', color: C.label, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{item.label}</p>
              <p style={{ fontSize: '0.85rem', color: '#e5e7eb', fontFamily: item.value.startsWith('Dial') ? 'monospace' : 'inherit' }}>{item.value}</p>
            </div>
          ))}
        </div>
      ),
    },
    { number: '05', title: 'Test your VoiceBot', done: calls.length > 0, desc: 'Call your dedicated number and have a conversation with your VoiceBot.' },
    { number: '06', title: "You're live", done: calls.length > 0 && !!plan && googleConnected && !!clientData?.twilio_number, desc: 'Your VoiceBot is now handling calls 24/7.' },
  ];

  const pageContent = (
    <main style={{ flex: 1, padding: isMobile ? '24px 16px' : '48px 40px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px', paddingBottom: isMobile ? '80px' : '48px' }}>

      {activePage === 'dashboard' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>{clientData?.business_name ? `Welcome, ${clientData.business_name}` : 'Dashboard'}</h1>
              <p style={{ fontSize: '0.85rem', color: C.text }}>Here's what's happening with your VoiceBot.</p>
            </div>
            {!plan && <a href="/pricing" style={{ padding: '8px 14px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Choose a plan →</a>}
          </div>

          {showOnboarding && <OnboardingBanner plan={clientData?.plan} googleConnected={googleConnected} twilioNumber={clientData?.twilio_number} onDismiss={handleDismissOnboarding} />}

          {!plan && !showOnboarding && (
            <div style={{ background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <p style={{ fontWeight: 600, color: '#818cf8', marginBottom: '4px' }}>No active plan</p>
                <p style={{ fontSize: '0.85rem', color: C.text }}>Subscribe to a plan to activate your VoiceBot.</p>
              </div>
              <a href="/pricing" style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>View plans</a>
            </div>
          )}

          {plan && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Current plan</p>
                <p style={{ fontWeight: 700, fontSize: '1.1rem', color: plan.color }}>{plan.label}</p>
                <p style={{ fontSize: '0.8rem', color: C.text, marginTop: '4px' }}>{plan.minutes.toLocaleString()} minutes/month included</p>
              </div>
              {clientData?.twilio_number && (
                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Phone number</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '1rem', color: '#e5e7eb', fontWeight: 600 }}>{clientData.twilio_number}</p>
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {[
              { label: 'Calls received', value: calls.length, icon: <IconPhone /> },
              { label: 'Appointments', value: rdvCount, icon: <IconCalendar /> },
              { label: 'Minutes', value: Math.round(totalDuration / 60), icon: <IconClock /> },
            ].map(s => (
              <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '14px', padding: isMobile ? '16px 12px' : '24px' }}>
                <div style={{ color: C.text, marginBottom: '8px' }}>{s.icon}</div>
                <div style={{ fontSize: isMobile ? '1.6rem' : '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
                <div style={{ fontSize: '0.75rem', color: C.text }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Google Calendar</p>
              <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{googleConnected ? 'Connected' : 'Not connected'}</p>
              <p style={{ fontSize: '0.85rem', color: C.text }}>{googleConnected ? 'Appointments are booked automatically.' : 'Connect your calendar for automatic scheduling.'}</p>
            </div>
            {!googleConnected
              ? <a href="/api/google/auth" style={{ padding: '9px 20px', background: '#1a73e8', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Connect Google</a>
              : <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '9px', color: '#4ade80', fontSize: '0.875rem', fontWeight: 600 }}><IconCheck /> Connected</span>
            }
          </div>
        </>
      )}

      {activePage === 'calls' && (
        <>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Calls</h1>
            <p style={{ fontSize: '0.85rem', color: C.text }}>All calls handled by your VoiceBot.</p>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
            {calls.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ color: C.border, marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><IconPhone /></div>
                <p style={{ fontSize: '0.875rem', color: C.text }}>No calls yet. Your VoiceBot is ready.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {calls.map(call => (
                  <div key={call.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '12px' }}>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '3px' }}>{call.caller_number}</p>
                      <p style={{ fontSize: '0.8rem', color: C.text }}>{call.summary}</p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: C.text }}>{call.duration}s</span>
                      {call.rdv_pris && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#4ade80', background: 'rgba(34,197,94,0.08)', padding: '2px 8px', borderRadius: '100px' }}><IconCheck /> Booked</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activePage === 'reports' && (
        <>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Weekly Reports</h1>
            <p style={{ fontSize: '0.85rem', color: C.text }}>Your VoiceBot performance, week by week.</p>
          </div>
          <WeeklyReport userId={user?.id} />
        </>
      )}

      {activePage === 'setup' && (
        <>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Setup guide</h1>
            <p style={{ fontSize: '0.85rem', color: C.text }}>Follow these steps to get your VoiceBot up and running.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {setupSteps.map((step, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${step.done ? 'rgba(74,222,128,0.2)' : C.border}`, borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step.done ? 'rgba(74,222,128,0.12)' : C.bg, border: `1px solid ${step.done ? 'rgba(74,222,128,0.3)' : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {step.done ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : <span style={{ fontSize: '0.7rem', fontWeight: 700, color: C.text }}>{step.number}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', color: step.done ? '#4ade80' : 'white' }}>{step.title}</p>
                  <p style={{ fontSize: '0.85rem', color: C.text, lineHeight: 1.6 }}>{step.desc}</p>
                  {step.action}
                  {step.extra}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activePage === 'settings' && (
        <>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Settings</h1>
            <p style={{ fontSize: '0.85rem', color: C.text }}>Manage your account and integrations.</p>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Google Calendar</p>
              <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px' }}>{googleConnected ? 'Connected' : 'Not connected'}</p>
              <p style={{ fontSize: '0.85rem', color: C.text }}>{googleConnected ? 'Appointments are booked automatically.' : 'Connect your calendar for automatic scheduling.'}</p>
            </div>
            {!googleConnected
              ? <a href="/api/google/auth" style={{ padding: '9px 20px', background: '#1a73e8', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600 }}>Connect Google</a>
              : <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '9px', color: '#4ade80', fontSize: '0.875rem', fontWeight: 600 }}><IconCheck /> Connected</span>
            }
          </div>
          <ScriptSettings clientPlan={clientData?.plan} userId={user?.id} />
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
            <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '16px' }}>Account</p>
            <p style={{ fontSize: '0.875rem', color: C.label, marginBottom: '4px' }}>Email</p>
            <p style={{ fontSize: '0.95rem', color: '#e5e7eb', fontWeight: 500 }}>{user.email}</p>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', padding: 0, marginTop: '20px', fontWeight: 600 }}>
              <IconLogout /> Sign out
            </button>
          </div>
        </>
      )}

      {activePage === 'billing' && (
        <>
          <div>
            <h1 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '4px' }}>Billing</h1>
            <p style={{ fontSize: '0.85rem', color: C.text }}>Manage your subscription.</p>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
            {plan ? (
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Current plan</p>
                  <p style={{ fontWeight: 700, fontSize: '1.2rem', color: plan.color, marginBottom: '4px' }}>{plan.label}</p>
                  <p style={{ fontSize: '0.85rem', color: C.text }}>{plan.minutes.toLocaleString()} minutes/month included</p>
                </div>
                <a href="/pricing" style={{ padding: '9px 20px', background: C.bg, border: `1px solid ${C.border}`, color: '#e5e7eb', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600 }}>Upgrade plan</a>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#818cf8', marginBottom: '4px' }}>No active plan</p>
                  <p style={{ fontSize: '0.85rem', color: C.text }}>Subscribe to activate your VoiceBot.</p>
                </div>
                <a href="/pricing" style={{ padding: '9px 20px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600 }}>View plans →</a>
              </div>
            )}
          </div>
        </>
      )}

    </main>
  );

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, color: 'white', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.sidebar, position: 'sticky', top: 0, zIndex: 100 }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>VoiceBot AI</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {plan && <span style={{ fontSize: '0.7rem', padding: '3px 10px', borderRadius: '100px', border: `1px solid ${C.border}`, color: plan.color, fontWeight: 600 }}>{plan.label}</span>}
          </div>
        </div>
        {pageContent}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.sidebar, borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-around', padding: '8px 0 20px', zIndex: 100 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 8px', border: 'none', background: 'transparent', color: activePage === item.id ? 'white' : C.text, cursor: 'pointer', fontSize: '0.6rem', fontWeight: activePage === item.id ? 600 : 400 }}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: 'white', fontFamily: 'system-ui, sans-serif', display: 'flex' }}>
      <aside style={{ width: '220px', minHeight: '100vh', background: C.sidebar, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: '24px 12px', position: 'fixed', top: 0, left: 0 }}>
        <div style={{ padding: '0 12px', marginBottom: '32px' }}>
          <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>VoiceBot AI</span>
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActivePage(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: 'none', background: activePage === item.id ? C.card : 'transparent', color: activePage === item.id ? 'white' : C.text, cursor: 'pointer', fontSize: '0.875rem', fontWeight: activePage === item.id ? 600 : 400, textAlign: 'left', width: '100%', transition: 'all 0.15s' }}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {plan && (
            <div style={{ padding: '10px 12px', background: C.card, borderRadius: '8px', marginBottom: '4px' }}>
              <p style={{ fontSize: '0.7rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '3px' }}>Plan</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, color: plan.color }}>{plan.label}</p>
            </div>
          )}
          <div style={{ padding: '8px 12px' }}>
            <p style={{ fontSize: '0.75rem', color: C.text, marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.text, background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', padding: 0 }}>
              <IconLogout /> Sign out
            </button>
          </div>
        </div>
      </aside>
      <div style={{ marginLeft: '220px', flex: 1 }}>
        {pageContent}
      </div>
    </div>
  );
}