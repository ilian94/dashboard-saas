"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

const C = { bg: '#0f1117', sidebar: '#0d1117', card: '#161b27', border: '#1e2433', text: '#6b7280', label: '#9ca3af' };

const PLAN_LABELS = {
  starter: { label: "Starter Plan", color: "#60a5fa", minutes: 500 },
  scale: { label: "Scale Plan", color: "#a78bfa", minutes: 2000 },
  business: { label: "Business Plan", color: "#fbbf24", minutes: 6000 },
};

const PLAN_RANK = { starter: 1, scale: 2, business: 3 };
const PLAN_OPTIONS = [
  { key: 'starter', label: 'Starter', price: '$229/mo', minutes: '500 min' },
  { key: 'scale', label: 'Scale', price: '$459/mo', minutes: '2,000 min' },
  { key: 'business', label: 'Business', price: '$879/mo', minutes: '6,000 min' },
];

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

function SetupProgress({ plan, googleConnected, twilioNumber, callsCount, onGoSetup }) {
  const steps = [
    { label: 'Choose a plan', done: !!plan },
    { label: 'Connect Google Calendar', done: googleConnected },
    { label: 'Phone number assigned', done: !!twilioNumber },
    { label: 'Forward your number', done: false },
    { label: 'Test your VoiceBot', done: callsCount > 0 },
  ];

  const completed = steps.filter(s => s.done).length;
  const total = steps.length;
  const percentage = Math.round((completed / total) * 100);
  const nextStep = steps.find(s => !s.done);

  const [showPopup, setShowPopup] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: null, y: null });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const btnRef = useRef(null);
  const hasDragged = useRef(false);
  const leaveTimer = useRef(null);
  const isHovered = useRef(false);

  useEffect(() => {
    setPos({ x: window.innerWidth - 80, y: window.innerHeight - 140 });
  }, []);

  const openPopup = () => {
    clearTimeout(leaveTimer.current);
    isHovered.current = true;
    setShowPopup(true);
    setTimeout(() => setVisible(true), 10);
  };

  const closePopup = () => {
    isHovered.current = false;
    leaveTimer.current = setTimeout(() => {
      if (!isHovered.current) {
        setVisible(false);
        setTimeout(() => setShowPopup(false), 250);
      }
    }, 300);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = btnRef.current.getBoundingClientRect();
    dragOffset.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    hasDragged.current = false;
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    hasDragged.current = true;
    setDragging(true);
    const touch = e.touches[0];
    setPos({ x: touch.clientX - dragOffset.current.x, y: touch.clientY - dragOffset.current.y });
  };

  const handleTouchEnd = () => {
    setDragging(false);
    if (hasDragged.current) {
      const snapX = pos.x + 28 < window.innerWidth / 2 ? 16 : window.innerWidth - 80;
      const snapY = Math.max(80, Math.min(pos.y, window.innerHeight - 140));
      setPos({ x: snapX, y: snapY });
    } else {
      if (showPopup) { setVisible(false); setTimeout(() => setShowPopup(false), 250); }
      else openPopup();
    }
    hasDragged.current = false;
  };

  if (completed === total || pos.x === null) return null;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isRight = pos.x > window.innerWidth / 2;
  const popupAbove = pos.y > window.innerHeight / 2;

  return (
    <>
      <style>{`
        @keyframes setupBtnAppear {
          from { transform: rotate(-180deg) scale(0.4); opacity: 0; }
          to { transform: rotate(0deg) scale(1); opacity: 1; }
        }
        .setup-float-btn {
          animation: setupBtnAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .setup-float-btn:hover {
          transform: scale(1.1) !important;
          box-shadow: 0 0 0 4px rgba(79,70,229,0.25), 0 8px 32px rgba(79,70,229,0.35) !important;
        }
        .setup-float-btn:active {
          transform: scale(0.96) !important;
        }
        .setup-popup-card {
          transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .setup-popup-card.hidden {
          opacity: 0;
          transform: translateY(8px) scale(0.95);
          pointer-events: none;
        }
        .setup-popup-card.shown {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      `}</style>

      <button
        ref={btnRef}
        className="setup-float-btn"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={openPopup}
        onMouseLeave={closePopup}
        onClick={() => {
          if (showPopup) { setVisible(false); setTimeout(() => setShowPopup(false), 250); }
          else openPopup();
        }}
        style={{
          position: 'fixed', left: pos.x, top: pos.y, zIndex: 500,
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: '50%', width: '56px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', padding: 0, touchAction: 'none',
          transition: dragging ? 'none' : 'left 0.25s ease, top 0.25s ease, transform 0.18s ease, box-shadow 0.18s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}
        title="Setup progress"
      >
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={radius} fill="none" stroke={C.border} strokeWidth="3" />
          <circle cx="28" cy="28" r={radius} fill="none" stroke="#4f46e5" strokeWidth="3"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" transform="rotate(-90 28 28)"
            style={{ transition: 'stroke-dashoffset 0.4s ease' }} />
          <text x="28" y="28" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="11" fontWeight="700">{completed}/{total}</text>
        </svg>
      </button>

      {showPopup && nextStep && (
        <div
          className={`setup-popup-card ${visible ? 'shown' : 'hidden'}`}
          onMouseEnter={openPopup}
          onMouseLeave={closePopup}
          style={{
            position: 'fixed',
            left: isRight ? 'auto' : pos.x,
            right: isRight ? window.innerWidth - pos.x + 12 : 'auto',
            top: popupAbove ? pos.y - 210 : pos.y + 64,
            zIndex: 501, background: C.card, border: `1px solid ${C.border}`,
            borderRadius: '16px', padding: '16px 18px', width: '240px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)', cursor: 'default',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '0.68rem', color: C.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
              Setup progress
            </p>
            <div style={{ height: '3px', background: C.border, borderRadius: '100px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percentage}%`, background: 'linear-gradient(90deg, #4f46e5, #818cf8)', borderRadius: '100px', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: s.done ? 'rgba(74,222,128,0.12)' : C.bg,
                  border: `1px solid ${s.done ? 'rgba(74,222,128,0.35)' : C.border}`,
                }}>
                  {s.done
                    ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    : <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: C.border, display: 'block' }} />
                  }
                </div>
                <span style={{
                  fontSize: '0.78rem',
                  color: s.done ? '#6b7280' : 'white',
                  fontWeight: s.done ? 400 : 500,
                  textDecoration: s.done ? 'line-through' : 'none',
                }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div
            onClick={() => { setVisible(false); setTimeout(() => setShowPopup(false), 250); onGoSetup(); }}
            style={{
              padding: '10px 14px',
              background: 'rgba(79,70,229,0.12)',
              border: '1px solid rgba(79,70,229,0.25)',
              borderRadius: '10px',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(79,70,229,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(79,70,229,0.12)'}
          >
            <p style={{ fontSize: '0.68rem', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>Next step</p>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>{nextStep.label} →</p>
          </div>
        </div>
      )}
    </>
  );
}

function ChangePlanModal({ currentPlan, userId, onClose, onSuccess }) {
  const [preview, setPreview] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleSelectPlan = async (planKey) => {
    if (planKey === currentPlan) return;
    setSelectedPlan(planKey);
    setPreview(null);
    const isUpgrade = PLAN_RANK[planKey] > PLAN_RANK[currentPlan];
    if (isUpgrade) {
      setLoadingPreview(true);
      const res = await fetch('/api/stripe/preview-upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetPlan: planKey }),
      });
      const data = await res.json();
      setPreview(data);
      setLoadingPreview(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedPlan) return;
    setConfirming(true);
    const res = await fetch('/api/stripe/change-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetPlan: selectedPlan }),
    });
    const data = await res.json();
    setConfirming(false);
    if (data.success) onSuccess(selectedPlan);
  };

  const isUpgrade = selectedPlan ? PLAN_RANK[selectedPlan] > PLAN_RANK[currentPlan] : false;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '480px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Change plan</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer' }}><IconX /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {PLAN_OPTIONS.map(p => {
            const isCurrent = p.key === currentPlan;
            const isSelected = p.key === selectedPlan;
            return (
              <div key={p.key} onClick={() => !isCurrent && handleSelectPlan(p.key)}
                style={{ padding: '14px 16px', borderRadius: '12px', border: `1px solid ${isSelected ? '#4f46e5' : isCurrent ? 'rgba(74,222,128,0.3)' : C.border}`, background: isSelected ? 'rgba(79,70,229,0.08)' : C.bg, cursor: isCurrent ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{p.label}</p>
                  <p style={{ fontSize: '0.78rem', color: C.text }}>{p.minutes}/month</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{p.price}</span>
                  {isCurrent && <span style={{ fontSize: '0.7rem', color: '#4ade80', background: 'rgba(74,222,128,0.08)', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(74,222,128,0.2)', fontWeight: 600 }}>Current</span>}
                </div>
              </div>
            );
          })}
        </div>
        {selectedPlan && (
          <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
            {loadingPreview ? (
              <p style={{ fontSize: '0.85rem', color: C.text }}>Calculating...</p>
            ) : isUpgrade && preview ? (
              <>
                <p style={{ fontSize: '0.85rem', color: '#e5e7eb', marginBottom: '4px' }}>You'll be charged <span style={{ fontWeight: 700, color: 'white' }}>${preview.amountDue?.toFixed(2)}</span> today (prorated)</p>
                <p style={{ fontSize: '0.8rem', color: C.text }}>Then ${PLAN_OPTIONS.find(p => p.key === selectedPlan)?.price} starting {preview.nextBillingDate}</p>
              </>
            ) : !isUpgrade ? (
              <>
                <p style={{ fontSize: '0.85rem', color: '#e5e7eb', marginBottom: '4px' }}>Your plan will change at the end of your current billing period.</p>
                <p style={{ fontSize: '0.8rem', color: C.text }}>You keep your current plan until then.</p>
              </>
            ) : null}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '11px', background: 'transparent', border: `1px solid ${C.border}`, color: C.text, borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleConfirm} disabled={!selectedPlan || confirming || loadingPreview}
            style={{ flex: 1, padding: '11px', background: selectedPlan ? '#4f46e5' : C.border, color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: selectedPlan ? 'pointer' : 'default', opacity: confirming ? 0.7 : 1 }}>
            {confirming ? 'Processing...' : isUpgrade ? 'Confirm upgrade' : 'Confirm downgrade'}
          </button>
        </div>
      </div>
    </div>
  );
}

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

function ScriptSettings({ clientPlan, userId, allNumbers }) {
  const [selectedNumber, setSelectedNumber] = useState(allNumbers?.[0] || '');
  const [scripts, setScripts] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const script = scripts[selectedNumber] || { business_name: '', services: '', questions: '', tone: '' };

  useEffect(() => {
    const loadScript = async () => {
      const { data } = await supabase.from('clients').select('bot_script').eq('user_id', userId).maybeSingle();
      if (data?.bot_script) {
        const raw = data.bot_script;
        if (raw.business_name !== undefined) {
          const migrated = {};
          (allNumbers || []).forEach(num => { migrated[num] = raw; });
          setScripts(migrated);
        } else {
          setScripts(raw);
        }
      }
    };
    if (userId && allNumbers?.length) loadScript();
  }, [userId, allNumbers]);

  const handleSave = async () => {
    setSaving(true);
    const scriptToSave = clientPlan === 'scale'
  ? { business_name: script.business_name }
  : { business_name: script.business_name, services: script.services, questions: script.questions, tone: script.tone };
    const updatedScripts = { ...scripts, [selectedNumber]: scriptToSave };
    await supabase.from('clients').update({ bot_script: updatedScripts }).eq('user_id', userId);
    setScripts(updatedScripts);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setField = (field, value) => {
    setScripts(prev => ({
      ...prev,
      [selectedNumber]: { ...(prev[selectedNumber] || {}), [field]: value }
    }));
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

      {allNumbers?.length > 1 && (
        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Phone number</label>
          <select value={selectedNumber} onChange={e => setSelectedNumber(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}>
            {allNumbers.map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <p style={{ fontSize: '0.75rem', color: C.text, marginTop: '4px' }}>Each number can have its own script.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={labelStyle}>Business name</label>
          <input value={script.business_name || ''} onChange={e => setField('business_name', e.target.value)} placeholder="e.g. Smith Dental Clinic" style={inputStyle} />
          <p style={{ fontSize: '0.75rem', color: C.text, marginTop: '4px' }}>Used in the greeting: "Thank you for calling [business name]"</p>
        </div>
        {clientPlan === 'business' && (
          <>
            <div>
              <label style={labelStyle}>Services offered</label>
              <input value={script.services || ''} onChange={e => setField('services', e.target.value)} placeholder="e.g. dental cleanings, consultations, emergency appointments" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Questions to ask callers</label>
              <input value={script.questions || ''} onChange={e => setField('questions', e.target.value)} placeholder="e.g. their name, preferred date, type of service needed" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Tone & personality</label>
              <input value={script.tone || ''} onChange={e => setField('tone', e.target.value)} placeholder="e.g. warm and professional, concise, friendly" style={inputStyle} />
            </div>
          </>
        )}
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '16px' }}>
  <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.label, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Bot capabilities</p>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
    {[
      { key: 'allow_modify', label: 'Allow appointment modification', desc: 'Callers can ask to reschedule existing appointments' },
      { key: 'allow_cancel', label: 'Allow appointment cancellation', desc: 'Callers can ask to cancel existing appointments' },
    ].map(cap => (
      <div key={cap.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px' }}>
        <div>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '2px' }}>{cap.label}</p>
          <p style={{ fontSize: '0.75rem', color: C.text }}>{cap.desc}</p>
        </div>
        <button
          onClick={() => setField(cap.key, script[cap.key] === false ? true : false)}
          style={{
            width: '40px', height: '22px', borderRadius: '100px', border: 'none', cursor: 'pointer', flexShrink: 0,
            background: script[cap.key] === false ? C.border : '#4f46e5',
            position: 'relative', transition: 'background 0.2s',
          }}
        >
          <div style={{
            width: '16px', height: '16px', borderRadius: '50%', background: 'white',
            position: 'absolute', top: '3px',
            left: script[cap.key] === false ? '3px' : '21px',
            transition: 'left 0.2s',
          }} />
        </button>
      </div>
    ))}
  </div>
</div>
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
  const [showCalendlyModal, setShowCalendlyModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState('all');
const [showNumberDropdown, setShowNumberDropdown] = useState(false);

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
    const { data } = await supabase.from("clients").select("google_connected, plan, twilio_number, twilio_numbers, extra_minutes, business_name, calendly_token, calendar_type").eq("user_id", userId).maybeSingle();
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

  const handleCheckout = async (priceId, mode = 'subscription') => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId: user.id, userEmail: user.email, mode }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const handlePlanChangeSuccess = (newPlan) => {
    setClientData(prev => ({ ...prev, plan: newPlan }));
    setShowChangePlan(false);
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
      <p style={{ color: C.text, fontSize: '0.9rem' }}>Loading...</p>
    </div>
  );

  const allNumbers = [
  ...(clientData?.twilio_number ? [clientData.twilio_number] : []),
  ...(clientData?.twilio_numbers || [])
];
const filteredCalls = selectedNumber === 'all' 
  ? calls 
  : calls.filter(c => c.twilio_number === selectedNumber);
const rdvCount = filteredCalls.filter(c => c.rdv_pris).length;
const totalDuration = filteredCalls.reduce((acc, c) => acc + (c.duration || 0), 0);
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
    <main style={{ padding: isMobile ? '72px 16px 90px' : '48px 40px' }}>
      <div style={{ display: isMobile || activePage !== 'dashboard' ? 'flex' : 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', flexDirection: 'column', maxWidth: activePage === 'dashboard' && !isMobile ? '1200px' : '900px', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0, width: '100%' }}>

          {activePage === 'dashboard' && (
            <>
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
                  {allNumbers.length > 0 && (
                    <div style={{ position: 'relative' }}>
                      <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px', textAlign: isMobile ? 'left' : 'right' }}>Viewing stats for</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setShowNumberDropdown(!showNumberDropdown); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.06)', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: '#e5e7eb', fontFamily: 'system-ui, sans-serif', fontSize: '0.85rem', fontWeight: 600 }}
                      >
                        {selectedNumber === 'all' ? 'All numbers' : selectedNumber}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
                      </button>
                      {showNumberDropdown && (
                        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '6px', background: C.card, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', zIndex: 50, minWidth: '180px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                          <button onClick={() => { setSelectedNumber('all'); setShowNumberDropdown(false); }}
                            style={{ width: '100%', padding: '10px 14px', background: selectedNumber === 'all' ? 'rgba(79,70,229,0.12)' : 'transparent', border: 'none', color: selectedNumber === 'all' ? '#818cf8' : '#e5e7eb', fontSize: '0.85rem', fontWeight: selectedNumber === 'all' ? 600 : 400, cursor: 'pointer', textAlign: 'left' }}>
                            All numbers
                          </button>
                          {allNumbers.map(num => (
                            <button key={num} onClick={() => { setSelectedNumber(num); setShowNumberDropdown(false); }}
                              style={{ width: '100%', padding: '10px 14px', background: selectedNumber === num ? 'rgba(79,70,229,0.12)' : 'transparent', border: 'none', color: selectedNumber === num ? '#818cf8' : '#e5e7eb', fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: selectedNumber === num ? 600 : 400, cursor: 'pointer', textAlign: 'left' }}>
                              {num}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { label: 'Calls', value: filteredCalls.length, icon: <IconPhone /> },
                  { label: 'Appointments', value: rdvCount, icon: <IconCalendar /> },
                  { label: 'Minutes', value: Math.round(totalDuration / 60), icon: <IconClock /> },
                ].map(s => (
                  <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '14px', padding: isMobile ? '14px 10px' : '24px' }}>
                    <div style={{ color: C.text, marginBottom: '8px' }}>{s.icon}</div>
                    <div style={{ fontSize: isMobile ? '1.5rem' : '2.2rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
                    <div style={{ fontSize: '0.72rem', color: C.text }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {plan && (() => {
                const planMinutes = plan.minutes;
                const extraMinutes = clientData?.extra_minutes || 0;
                const totalMinutes = planMinutes + extraMinutes;
                const usedMinutes = Math.round(totalDuration / 60);
                const usedPercent = Math.min(Math.round((usedMinutes / totalMinutes) * 100), 100);
                const barColor = usedPercent >= 90 ? '#f87171' : usedPercent >= 70 ? '#fbbf24' : '#4f46e5';
                return (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '4px' }}>Minutes used this month</p>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                          <span style={{ color: 'white' }}>{usedMinutes.toLocaleString()}</span>
                          <span style={{ color: C.text, fontWeight: 400 }}> / {totalMinutes.toLocaleString()} min</span>
                        </p>
                      </div>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: barColor }}>{usedPercent}%</span>
                    </div>
                    <div style={{ height: '6px', background: C.border, borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${usedPercent}%`, background: barColor, borderRadius: '100px', transition: 'width 0.4s ease' }} />
                    </div>
                    {extraMinutes > 0 && <p style={{ fontSize: '0.78rem', color: '#4ade80', marginTop: '8px' }}>Includes {extraMinutes.toLocaleString()} extra minutes</p>}
                    {usedPercent >= 80 && (
                      <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <p style={{ fontSize: '0.82rem', color: '#fbbf24' }}>You're running low on minutes.</p>
                        <button onClick={() => setActivePage('billing')} style={{ fontSize: '0.78rem', fontWeight: 600, color: '#fbbf24', background: 'none', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Buy more →</button>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Recent calls</p>
                  {calls.length > 0 && <button onClick={() => setActivePage('calls')} style={{ fontSize: '0.78rem', color: '#818cf8', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontWeight: 600 }}>View all →</button>}
                </div>
                {filteredCalls.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <p style={{ fontSize: '0.875rem', color: C.text }}>No calls yet. Your VoiceBot is ready.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filteredCalls.slice(0, 3).map(call => (
                      <div key={call.id} style={{ padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '2px' }}>{call.caller_number}</p>
                          <p style={{ fontSize: '0.78rem', color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{call.summary || 'No summary'}</p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                          <span style={{ fontSize: '0.72rem', color: C.text }}>{call.duration}s</span>
                          {call.rdv_pris && <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: '#4ade80', background: 'rgba(34,197,94,0.08)', padding: '2px 7px', borderRadius: '100px' }}><IconCheck /> Booked</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <p style={{ fontSize: '0.875rem', color: C.text }}>No calls yet. Your VoiceBot is ready.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {calls.map(call => (
                      <div key={call.id} style={{ padding: '12px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '3px' }}>{call.caller_number}</p>
                            <p style={{ fontSize: '0.8rem', color: C.text }}>{call.summary}</p>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <span style={{ fontSize: '0.75rem', color: C.text }}>{call.duration}s</span>
                            {call.rdv_pris && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#4ade80', background: 'rgba(34,197,94,0.08)', padding: '2px 8px', borderRadius: '100px' }}><IconCheck /> Booked</span>}
                          </div>
                        </div>
                        {call.recording_url && (
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: `1px solid ${C.border}` }}>
                            <audio controls style={{ width: '100%', height: '32px', accentColor: '#4f46e5' }}>
                              <source src={call.recording_url} type="audio/mpeg" />
                            </audio>
                          </div>
                        )}
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
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
                <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '16px' }}>Calendar integration</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: C.bg, border: `1px solid ${googleConnected ? 'rgba(74,222,128,0.2)' : C.border}`, borderRadius: '12px' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>Google Calendar</p>
                      <p style={{ fontSize: '0.78rem', color: C.text }}>{googleConnected ? 'Connected — appointments created automatically on your calendar' : 'Appointments booked automatically — no action needed'}</p>
                    </div>
                    {!googleConnected
                      ? <a href="/api/google/auth" style={{ padding: '8px 16px', background: '#1a73e8', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Connect →</a>
                      : <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', color: '#4ade80', fontSize: '0.82rem', fontWeight: 600 }}><IconCheck /> Connected</span>
                    }
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: C.bg, border: `1px solid ${clientData?.calendly_token ? 'rgba(74,222,128,0.2)' : C.border}`, borderRadius: '12px' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>Calendly</p>
                      <p style={{ fontSize: '0.78rem', color: C.text }}>{clientData?.calendly_token ? 'Connected — caller receives a Calendly link by SMS to confirm' : 'Bot collects info & sends caller a Calendly link to confirm'}</p>
                    </div>
                    {clientData?.calendly_token
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '8px', color: '#4ade80', fontSize: '0.82rem', fontWeight: 600 }}><IconCheck /> Connected</span>
                      : <button onClick={() => setShowCalendlyModal(true)} style={{ padding: '8px 16px', background: '#006bff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Connect →</button>
                    }
                  </div>
                </div>
              </div>
              <ScriptSettings clientPlan={clientData?.plan} userId={user?.id} allNumbers={[...(clientData?.twilio_number ? [clientData.twilio_number] : []), ...(clientData?.twilio_numbers || [])]} />
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
                <p style={{ fontSize: '0.85rem', color: C.text }}>Manage your subscription and add-ons.</p>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
                {plan ? (
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>Current plan</p>
                      <p style={{ fontWeight: 700, fontSize: '1.2rem', color: plan.color, marginBottom: '4px' }}>{plan.label}</p>
                      <p style={{ fontSize: '0.85rem', color: C.text }}>{plan.minutes.toLocaleString()} minutes/month included</p>
                      {clientData?.extra_minutes > 0 && <p style={{ fontSize: '0.82rem', color: '#4ade80', marginTop: '4px' }}>+ {clientData.extra_minutes.toLocaleString()} extra minutes available</p>}
                    </div>
                    <button onClick={() => setShowChangePlan(true)} style={{ padding: '9px 20px', background: C.bg, border: `1px solid ${C.border}`, color: '#e5e7eb', borderRadius: '9px', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>Change plan</button>
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
              {plan && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '4px' }}>Phone numbers</p>
                      <p style={{ fontSize: '0.82rem', color: C.text }}>{clientData?.plan === 'business' ? '$15/month per additional number' : 'Additional numbers available on Business plan'}</p>
                    </div>
                    {clientData?.plan === 'business' ? (
                      <button onClick={() => handleCheckout('price_1Ta0HrFbv1QHIqBx45XsDToe', 'subscription')} style={{ padding: '8px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Add number</button>
                    ) : (
                      <a href="/pricing" style={{ fontSize: '0.78rem', color: '#818cf8', background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Upgrade →</a>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {clientData?.twilio_number && (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px' }}>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#e5e7eb' }}>{clientData.twilio_number}</p>
                        <span style={{ fontSize: '0.72rem', color: C.text, background: C.card, padding: '2px 8px', borderRadius: '100px', border: `1px solid ${C.border}` }}>Included</span>
                      </div>
                    )}
                    {(clientData?.twilio_numbers || []).map((num, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px' }}>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#e5e7eb' }}>{num}</p>
                        <span style={{ fontSize: '0.72rem', color: '#60a5fa', background: 'rgba(96,165,250,0.08)', padding: '2px 8px', borderRadius: '100px', border: '1px solid rgba(96,165,250,0.2)' }}>$15/mo</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan && (
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
                  <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '4px' }}>Extra minutes</p>
                  <p style={{ fontSize: '0.82rem', color: C.text, marginBottom: '16px' }}>One-time purchase, added immediately to your account.</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(clientData?.plan === 'business' ? [
                      { label: '500 minutes', price: '$20', priceId: 'price_1Ta0IaFbv1QHIqBxbXgAGIlo' },
                      { label: '1,000 minutes', price: '$35', priceId: 'price_1Ta0J4Fbv1QHIqBxJDgDXSxx' },
                      { label: '2,000 minutes', price: '$60', priceId: 'price_1Ta0JIFbv1QHIqBxWJHkMI3w' },
                    ] : [
                      { label: '500 minutes', price: '$25', priceId: 'price_1Tb2jVFbv1QHIqBxpPYETYKS' },
                      { label: '1,000 minutes', price: '$45', priceId: 'price_1Tb2lMFbv1QHIqBxTbNNU8FK' },
                      { label: '2,000 minutes', price: '$70', priceId: 'price_1Tb2lmFbv1QHIqBxjHqbrZbr' },
                    ]).map(pack => (
                      <div key={pack.priceId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px' }}>
                        <div>
                          <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '2px' }}>{pack.label}</p>
                          <p style={{ fontSize: '0.78rem', color: C.text }}>One-time payment</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{pack.price}</span>
                          <button onClick={() => handleCheckout(pack.priceId, 'payment')} style={{ padding: '7px 14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Buy</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {!isMobile && activePage === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '48px' }}>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '14px' }}>Bot status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: plan ? '#4ade80' : '#f87171', boxShadow: plan ? '0 0 8px rgba(74,222,128,0.5)' : '0 0 8px rgba(248,113,113,0.5)' }} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: plan ? '#4ade80' : '#f87171' }}>{plan ? 'Active' : 'Inactive'}</span>
              </div>
              {plan && clientData?.twilio_number && (
                <p style={{ fontSize: '0.78rem', color: C.text, marginTop: '8px' }}>Answering calls on <span style={{ fontFamily: 'monospace', color: '#e5e7eb' }}>{clientData.twilio_number}</span></p>
              )}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '14px' }}>This month</p>
              {(() => {
                const now = new Date();
                const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthCalls = calls.filter(c => new Date(c.created_at) >= firstOfMonth);
                const monthRdv = monthCalls.filter(c => c.rdv_pris).length;
                const monthMinutes = Math.round(monthCalls.reduce((acc, c) => acc + (c.duration || 0), 0) / 60);
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[{ label: 'Calls', value: monthCalls.length }, { label: 'Appointments', value: monthRdv }, { label: 'Minutes used', value: monthMinutes }].map(s => (
                      <div key={s.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.85rem', color: C.text }}>{s.label}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
              <p style={{ fontSize: '0.75rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '14px' }}>Quick actions</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {!googleConnected && <a href="/api/google/auth" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(26,115,232,0.08)', border: '1px solid rgba(26,115,232,0.2)', borderRadius: '10px', textDecoration: 'none', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600 }}><IconCalendar /> Connect Calendar</a>}
                {clientData?.plan && clientData.plan !== 'starter' && <button onClick={() => setActivePage('settings')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(79,70,229,0.08)', border: '1px solid rgba(79,70,229,0.2)', borderRadius: '10px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}><IconSettings /> Customize script</button>}
                <button onClick={() => setActivePage('setup')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}><IconSetup /> Setup guide</button>
                <button onClick={() => setActivePage('billing')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '10px', color: C.text, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}><IconBilling /> Manage billing</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: 'white', fontFamily: 'system-ui, sans-serif' }}>
      {showChangePlan && <ChangePlanModal currentPlan={clientData?.plan} userId={user?.id} onClose={() => setShowChangePlan(false)} onSuccess={handlePlanChangeSuccess} />}
      {showCalendlyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '480px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Connect Calendly</h2>
              <button onClick={() => setShowCalendlyModal(false)} style={{ background: 'none', border: 'none', color: C.text, cursor: 'pointer' }}><IconX /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: C.text, marginBottom: '16px' }}>Enter your Calendly Personal Access Token to connect your account.</p>
            <input
              id="calendly-token-input"
              placeholder="eyJraWQiOiI..."
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: `1px solid ${C.border}`, background: C.bg, color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowCalendlyModal(false)} style={{ flex: 1, padding: '11px', background: 'transparent', border: `1px solid ${C.border}`, color: C.text, borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={async () => {
                const token = document.getElementById('calendly-token-input').value;
                if (!token) return;
                await supabase.from('clients').update({ calendly_token: token, calendar_type: 'calendly' }).eq('user_id', user.id);
                setClientData(prev => ({ ...prev, calendly_token: token, calendar_type: 'calendly' }));
                setShowCalendlyModal(false);
              }} style={{ flex: 1, padding: '11px', background: '#006bff', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}>
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
      <SetupProgress plan={clientData?.plan} googleConnected={googleConnected} twilioNumber={clientData?.twilio_number} callsCount={calls.length} onGoSetup={() => setActivePage('setup')} />

      {!isMobile && (
        <aside style={{ width: '220px', minHeight: '100vh', background: C.sidebar, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: '24px 12px', position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
          <div style={{ padding: '0 12px', marginBottom: '32px' }}>
            <a href="/" style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', color: 'white', textDecoration: 'none' }}>VoiceBot AI</a>
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
      )}

      <div style={{ marginLeft: isMobile ? '0' : '220px' }}>
        {isMobile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: C.sidebar, borderBottom: `1px solid ${C.border}`, padding: '0 16px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={{ fontWeight: 700, fontSize: '0.95rem', color: 'white', textDecoration: 'none' }}>VoiceBot AI</a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {plan && (
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: plan.color, background: 'rgba(255,255,255,0.06)', padding: '3px 10px', borderRadius: '100px', border: `1px solid ${C.border}` }}>
                  {plan.label}
                </span>
              )}
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: plan ? '#4ade80' : '#f87171', boxShadow: plan ? '0 0 6px rgba(74,222,128,0.6)' : '0 0 6px rgba(248,113,113,0.6)' }} />
            </div>
          </div>
        )}
        {pageContent}
      </div>

      {isMobile && (
        <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100, background: C.sidebar, borderTop: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '8px 0 20px' }}>
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button key={item.id} onClick={() => setActivePage(item.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: '10px', position: 'relative' }}>
                <div style={{ color: isActive ? '#818cf8' : C.text, transition: 'color 0.15s' }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 600 : 400, color: isActive ? 'white' : C.text, transition: 'color 0.15s' }}>
                  {item.label}
                </span>
                {isActive && (
                  <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', borderRadius: '50%', background: '#818cf8' }} />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}