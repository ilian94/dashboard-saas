"use client";
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

// SVG ICONS
const IconPhone = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconDollar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const IconFrown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>;
const IconMoon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
const IconBolt = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IconCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconMessage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconRefresh = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IconFileText = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
const IconMic = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>;
const IconPhones = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const IconEdit = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconBarChart = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconTooth = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8 2 5 5 5 8c0 2 .5 3.5 1 5 .6 1.8 1 3.5 1 5 0 1.7 1.3 3 3 3s2.4-1 3-2c.6 1 1.3 2 3 2s3-1.3 3-3c0-1.5.4-3.2 1-5 .5-1.5 1-3 1-5 0-3-3-6-7-6z"/></svg>;
const IconBriefcase = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconHome = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconScissors = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>;
const IconTool = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>;
const IconHospital = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>;
const IconCheck = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconCheckWhite = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconCheckGreen = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconPlay = ({ size = 22, color = "white" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>;

export default function Home() {
  const [user, setUser] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [roiCalls, setRoiCalls] = useState(50);
  const [scrolled, setScrolled] = useState(false);
  const [playingDemo, setPlayingDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) setUser(authUser);
    };
    loadUser();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const demoConversation = [
    { role: 'bot', text: "Thank you for calling Smith Dental. How can I help you today?", time: 0 },
    { role: 'caller', text: "Hi, I'd like to book a cleaning appointment.", time: 1500 },
    { role: 'bot', text: "Of course! I have Tuesday at 10am or Thursday at 2pm available. Which works best?", time: 3000 },
    { role: 'caller', text: "Thursday at 2pm please.", time: 4500 },
    { role: 'bot', text: "Perfect! Booked for Thursday at 2pm. You'll receive a confirmation SMS shortly!", time: 6000 },
  ];

  const audioRef = useRef(null);

  const startDemo = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlayingDemo(true);
      setDemoStep(0);
      demoConversation.forEach((_, i) => {
        setTimeout(() => setDemoStep(i + 1), demoConversation[i].time + 500);
      });
    }
  };

  const missedCallsPerMonth = roiCalls * 4;
  const revenuePerClient = 300;
  const potentialRevenue = Math.round(missedCallsPerMonth * 0.3 * revenuePerClient);
  const roi = potentialRevenue - 229;

  const faqs = [
    { q: "Does it actually sound human?", a: "Yes. VoiceBot AI uses advanced neural voice technology that sounds natural and conversational. Most callers don't realize they're speaking to an AI." },
    { q: "Can it really book appointments automatically?", a: "Yes. VoiceBot connects directly to Google Calendar or Calendly. When a caller wants to book, the AI finds availability and confirms the appointment in real time." },
    { q: "Do I need to change my phone number?", a: "No. You keep your existing number and simply forward calls to your VoiceBot. Setup takes under 5 minutes — no porting required." },
    { q: "What happens after the 7-day trial?", a: "After your trial, you're automatically billed for the plan you chose. You can cancel anytime from your dashboard before the trial ends." },
    { q: "How fast does it answer?", a: "Under 2 seconds. No hold music, no voicemail, no missed calls — ever." },
  ];

  const painPoints = [
    { Icon: IconPhone, title: 'Calls go to voicemail', desc: '62% of callers never leave a message. They call your competitor instead.' },
    { Icon: IconDollar, title: 'Revenue walks away', desc: 'Each missed call = a lost client. At $300/client, that adds up fast.' },
    { Icon: IconFrown, title: 'Clients get frustrated', desc: 'Nobody wants to wait on hold or call back 3 times to book.' },
    { Icon: IconMoon, title: 'You work 9-to-5. Clients dont', desc: 'Most appointment requests happen after hours. You miss them all.' },
  ];

  const features = [
    { Icon: IconBolt, title: 'Answers in under 2 seconds', desc: 'No hold music. Every call answered instantly, day or night.' },
    { Icon: IconCalendar, title: 'Books appointments automatically', desc: 'Syncs with Google Calendar or Calendly. No manual entry needed.' },
    { Icon: IconMessage, title: 'Sends SMS confirmations', desc: 'Clients get an instant confirmation text after every booking.' },
    { Icon: IconRefresh, title: 'Handles modifications & cancellations', desc: 'Callers can reschedule or cancel without reaching a human.', hide: true },
    { Icon: IconFileText, title: 'AI-generated call summaries', desc: 'Every call is transcribed and summarized in your dashboard.', hide: true },
    { Icon: IconMic, title: 'Call recording', desc: 'Record every call for quality review. Scale and Business plans.', hide: true },
    { Icon: IconPhones, title: 'Unlimited simultaneous calls', desc: 'Handle 10 calls at once during rush hour.', hide: true },
    { Icon: IconEdit, title: 'Full script customization', desc: 'Business plan users can fully customize tone and services.', hide: true },
    { Icon: IconBarChart, title: 'Analytics dashboard', desc: 'Track calls, conversion rates, peak hours, and ROI in real time.', hide: true },
  ];

  const industries = [
    { Icon: IconTooth, industry: 'Dental Clinics', desc: 'Book cleanings, handle cancellations, and confirm appointments — automatically.', stat: '40+ hrs saved/month' },
    { Icon: IconBriefcase, industry: 'Law Firms', desc: 'Qualify leads and schedule consultations 24/7. Never miss a potential case.', stat: '62% more leads captured' },
    { Icon: IconHome, industry: 'Real Estate', desc: 'Answer property inquiries and book viewings around the clock.', stat: '3x more showings booked' },
    { Icon: IconScissors, industry: 'Spas & Salons', desc: 'Let clients book, modify, or cancel anytime. Reduce no-shows.', stat: '30% fewer no-shows' },
    { Icon: IconTool, industry: 'Home Services', desc: 'Capture service requests and dispatch jobs — even on weekends.', stat: 'Zero missed weekend calls' },
    { Icon: IconHospital, industry: 'Medical Practices', desc: 'Handle scheduling and patient inquiries with professional, compliant AI.', stat: '50% less front desk load' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#0f0f0f', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid #e5e7eb' : 'none', transition: 'all 0.3s ease' }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link href="/pricing" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }}>Pricing</Link>
          {user ? (
            <Link href="/dashboard" style={{ background: '#0f0f0f', color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, padding: '9px 20px', borderRadius: '8px' }}>Dashboard</Link>
          ) : (
            <>
              <Link href="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem' }} className="mobile-hide">Sign in</Link>
              <Link href="/register" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, padding: '9px 20px', borderRadius: '8px' }}>Start free trial</Link>
            </>
          )}
        </div>
      </nav>

      <audio ref={audioRef} src="/Demo.MP3" onEnded={() => setPlayingDemo(false)} />

      {/* HERO */}
      <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '100px', padding: '6px 16px', fontSize: '0.78rem', color: '#16a34a', fontWeight: 600, marginBottom: '32px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
          Try free for 7 days — No charge until day 8
        </div>

        <h1 className="hero-h1" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 700, lineHeight: 1.06, letterSpacing: '-0.05em', marginBottom: '24px', maxWidth: '900px' }}>
          Your AI employee that<br />
          <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>never misses a call.</span>
        </h1>

        <p className="hero-sub" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#6b7280', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 24px' }}>
          Book more appointments. Qualify more leads. Answer every call instantly — 24/7, even at 3am.
        </p>

        <div className="hero-badges" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {['No voicemail', 'No hold music', 'No missed clients', 'Instant booking'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#6b7280', background: '#f9fafb', border: '1px solid #e5e7eb', padding: '5px 14px', borderRadius: '100px' }}>
              <IconCheck />{t}
            </span>
          ))}
        </div>

        <div className="hero-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Link href="/register" style={{ background: '#6366f1', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '15px 36px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(99,102,241,0.35)' }}>
            Start free — 7 days
          </Link>
          <button onClick={startDemo} style={{ background: '#fff', color: '#0f0f0f', border: '1.5px solid #e5e7eb', fontWeight: 600, fontSize: '1rem', padding: '15px 36px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit' }}>
            <IconPlay size={16} color="#6366f1" />
            Hear it live
          </button>
        </div>

        {/* DEMO CARD */}
        <div className="demo-card" style={{ marginTop: '64px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '28px', maxWidth: '580px', width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.6)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f0f0f' }}>Live call — Smith Dental Clinic</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#9ca3af', background: '#f3f4f6', padding: '3px 10px', borderRadius: '100px' }}>AI answering</span>
          </div>
          {demoStep === 0 && !playingDemo && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <button onClick={startDemo} style={{ background: '#6366f1', color: '#fff', border: 'none', borderRadius: '50%', width: '64px', height: '64px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}>
                <IconPlay />
              </button>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to hear a real VoiceBot call</p>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {demoConversation.slice(0, demoStep).map((line, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: line.role === 'caller' ? 'row-reverse' : 'row', animation: 'fadeIn 0.3s ease' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: line.role === 'bot' ? '#ede9fe' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: line.role === 'bot' ? '#6366f1' : '#6b7280', flexShrink: 0 }}>
                  {line.role === 'bot' ? 'AI' : 'C'}
                </div>
                <div style={{ background: line.role === 'bot' ? '#ede9fe' : '#f9fafb', border: `1px solid ${line.role === 'bot' ? '#c4b5fd' : '#e5e7eb'}`, borderRadius: '12px', padding: '10px 14px', maxWidth: '75%' }}>
                  <p style={{ fontSize: '0.875rem', margin: 0, lineHeight: 1.5, color: '#0f0f0f' }}>{line.text}</p>
                </div>
              </div>
            ))}
          </div>
          {demoStep >= demoConversation.length && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>Appointment added to Google Calendar</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '3px 10px', borderRadius: '100px' }}>Booked</span>
            </div>
          )}
        </div>
      </section>

      {/* PAIN POINTS */}
      <section className="section-pad" style={{ background: '#0f0f0f', color: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Sound familiar?</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '16px' }}>Every missed call is<br />a missed client.</h2>
          <p style={{ color: '#9ca3af', fontSize: '1rem', marginBottom: '48px' }}>The average business misses 62% of calls after hours. Each one could be worth $300+.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {painPoints.map(({ Icon, title, desc }) => (
              <div key={title} style={{ background: '#161616', border: '1px solid #222', borderRadius: '16px', padding: '28px', textAlign: 'left' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(99,102,241,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#6366f1' }}>
                  <Icon />
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#9ca3af', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="section-pad" style={{ padding: '80px 24px', borderBottom: '1px solid #e5e7eb', background: '#fafafa' }}>
        <div className="stats-grid" style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', textAlign: 'center' }}>
          {[
            { value: '<2s', label: 'Average answer time' },
            { value: '24/7', label: 'Always available' },
            { value: '99.9%', label: 'Uptime guaranteed' },
            { value: '$300+', label: 'Avg. value per client saved' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.04em', color: '#0f0f0f', marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-pad" style={{ padding: '96px 24px', maxWidth: '1000px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Setup</p>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>Live in 5 minutes.</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px', fontSize: '1rem' }}>No developers. No hardware. No training sessions.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { n: '01', title: 'Create your account', desc: 'Sign up in 30 seconds. Your 7-day free trial starts immediately.' },
            { n: '02', title: 'Connect your calendar', desc: 'Link Google Calendar or Calendly. VoiceBot books directly into it.' },
            { n: '03', title: 'Forward your number', desc: "Redirect your existing line to VoiceBot. You're live. Done." },
          ].map(s => (
            <div key={s.n} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '3rem', fontWeight: 800, color: '#f3f4f6', letterSpacing: '-0.04em' }}>{s.n}</div>
              <div style={{ width: '40px', height: '40px', background: '#ede9fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6366f1' }}>{s.n}</span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="section-pad" style={{ background: '#fafafa', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>Everything your receptionist does.</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px' }}>Without the salary, sick days, or training.</p>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {features.map(({ Icon, title, desc, hide }) => (
              <div key={title} className={hide ? 'feature-hide-mobile' : ''} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px' }}>
                <div style={{ width: '40px', height: '40px', background: '#ede9fe', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px', color: '#6366f1' }}>
                  <Icon />
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="section-pad" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>ROI Calculator</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>How much are you losing?</h2>
          <p style={{ color: '#6b7280', marginBottom: '48px' }}>See exactly what missed calls are costing your business.</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '24px', padding: '40px', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f0f0f' }}>Calls per week</label>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6366f1' }}>{roiCalls}</span>
              </div>
              <input type="range" min="10" max="200" value={roiCalls} onChange={e => setRoiCalls(Number(e.target.value))} style={{ width: '100%', accentColor: '#6366f1', height: '6px', cursor: 'pointer' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.75rem', color: '#9ca3af' }}>
                <span>10</span><span>200</span>
              </div>
            </div>
            <div className="roi-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Missed calls/month', value: missedCallsPerMonth, color: '#ef4444', prefix: '' },
                { label: 'Potential revenue lost', value: potentialRevenue, color: '#f59e0b', prefix: '$' },
                { label: 'Monthly ROI with VoiceBot', value: roi, color: '#16a34a', prefix: '$' },
              ].map(s => (
                <div key={s.label} className="roi-box" style={{ background: '#f9fafb', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                  <div className="roi-value" style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, letterSpacing: '-0.03em', marginBottom: '4px' }}>{s.prefix}{s.value.toLocaleString()}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.4 }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginBottom: '4px' }}>VoiceBot AI costs you</p>
              <p style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 4px' }}>$229/month</p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem', margin: 0 }}>vs ${potentialRevenue.toLocaleString()} in potential lost revenue</p>
            </div>
            <Link href="/register" style={{ display: 'block', background: '#0f0f0f', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '15px', borderRadius: '12px', textAlign: 'center' }}>
              Start recovering that revenue today
            </Link>
          </div>
        </div>
      </section>

      {/* COMPARISON — desktop only */}
      <section className="section-pad mobile-hide" style={{ background: '#fafafa', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', padding: '96px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Comparison</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>VoiceBot AI vs. a receptionist</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px' }}>Same job. 93% less cost.</p>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ padding: '16px 20px' }} />
              <div style={{ padding: '16px 20px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#6366f1', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb' }}>VoiceBot AI</div>
              <div style={{ padding: '16px 20px', textAlign: 'center', color: '#9ca3af', fontWeight: 600, fontSize: '0.9rem' }}>Human receptionist</div>
            </div>
            {[
              { feature: 'Monthly cost', voicebot: 'From $229/mo', human: '$3,000-$5,000/mo' },
              { feature: 'Availability', voicebot: '24/7/365', human: 'Business hours only' },
              { feature: 'Response time', voicebot: '< 2 seconds', human: '1-5 rings' },
              { feature: 'Simultaneous calls', voicebot: 'Unlimited', human: '1 at a time' },
              { feature: 'Setup time', voicebot: '5 minutes', human: 'Weeks of hiring' },
              { feature: 'SMS confirmations', voicebot: 'Automatic', human: 'Manual' },
              { feature: 'Never calls in sick', voicebot: 'Never', human: 'Sometimes' },
            ].map((row, i) => (
              <div key={row.feature} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: i < 6 ? '1px solid #e5e7eb' : 'none' }}>
                <div style={{ padding: '14px 20px', color: '#6b7280', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>{row.feature}</div>
                <div style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#16a34a', borderLeft: '1px solid #e5e7eb', borderRight: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.voicebot}</div>
                <div style={{ padding: '14px 20px', textAlign: 'center', fontSize: '0.875rem', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{row.human}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES — desktop only */}
      <section className="section-pad mobile-hide" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Industries</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>Built for your industry.</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px' }}>From solo practitioners to multi-location operations.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {industries.map(({ Icon, industry, desc, stat }) => (
              <div key={industry} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '28px', transition: 'box-shadow 0.2s, transform 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: '44px', height: '44px', background: '#ede9fe', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: '#6366f1' }}>
                  <Icon />
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>{industry}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.65, marginBottom: '16px' }}>{desc}</p>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6366f1', background: '#ede9fe', padding: '4px 12px', borderRadius: '100px' }}>{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — desktop only */}
      <section className="section-pad mobile-hide" style={{ background: '#0f0f0f', color: '#fff', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>By the numbers</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '48px' }}>The cost of doing nothing.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[
              { stat: '62%', desc: 'of callers never leave a voicemail. They call your competitor instead.' },
              { stat: '$300+', desc: 'average value of each client appointment you could be missing.' },
              { stat: '5 min', desc: 'to set up VoiceBot AI and never miss another call again.' },
            ].map(t => (
              <div key={t.stat} style={{ background: '#161616', border: '1px solid #222', borderRadius: '20px', padding: '28px' }}>
                <p style={{ fontSize: '3rem', fontWeight: 700, color: '#6366f1', letterSpacing: '-0.04em', marginBottom: '12px' }}>{t.stat}</p>
                <p style={{ fontSize: '0.95rem', color: '#9ca3af', lineHeight: 1.7, margin: 0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section-pad" style={{ padding: '96px 24px', background: '#fafafa', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Pricing</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '12px' }}>Simple, transparent pricing.</h2>
          <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '48px' }}>Start free for 7 days. No charge until day 8. Cancel anytime.</p>
          <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { name: 'Starter', price: '$229', desc: 'Perfect for small businesses.', features: ['500 call minutes/month', '1 phone number', 'Google Calendar sync', 'AI call summaries', '24/7 availability', 'Instant response (<1s)', 'Email support', 'Extra minutes from $25'], popular: false, hideMobile: true },
              { name: 'Scale', price: '$459', desc: 'Most popular — For growing teams.', features: ['2,000 call minutes/month', '1 phone number', 'Google Calendar sync', 'AI call summaries', '24/7 availability', 'Custom business name', 'Call recording', 'Appointment modification & cancellation', 'Calendly integration', 'Analytics dashboard', 'Extra minutes from $25'], popular: true, hideMobile: false },
              { name: 'Business', price: '$879', desc: 'For high-volume operations.', features: ['6,000 call minutes/month', '1 phone number included', 'Google Calendar sync', 'AI call summaries', '24/7 availability + priority support', 'Custom business name', 'Full script customization', 'SMS confirmation after booking', 'Call recording', 'Advanced analytics dashboard', 'Appointment modification & cancellation', 'Calendly integration', 'Unlimited additional numbers ($15/mo each)', 'Extra minutes from $20'], popular: false, hideMobile: true },
            ].map(plan => (
              <div key={plan.name} className={plan.hideMobile ? 'plan-hide-mobile' : ''} style={{ background: '#fff', border: `${plan.popular ? '2px solid #6366f1' : '1px solid #e5e7eb'}`, borderRadius: '20px', padding: '32px', position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 16px', borderRadius: '100px', whiteSpace: 'nowrap' }}>MOST POPULAR</div>}
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{plan.name}</h3>
                <p style={{ fontSize: '0.82rem', color: '#9ca3af', marginBottom: '16px' }}>{plan.desc}</p>
                <div style={{ fontSize: '2.8rem', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '4px' }}>{plan.price}<span style={{ fontSize: '0.9rem', color: '#9ca3af', fontWeight: 400 }}>/mo</span></div>
                <p style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginBottom: '20px' }}>No charge until day 8 · Cancel anytime</p>
                <div style={{ height: '1px', background: '#e5e7eb', marginBottom: '20px' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#374151' }}>
                      <IconCheckGreen />{f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" style={{ display: 'block', background: plan.popular ? '#6366f1' : '#0f0f0f', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                  Start free trial
                </Link>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', marginTop: '24px' }}>
            All plans include a 7-day free trial. No charge until day 8. Cancel anytime.{' '}
            <Link href="/pricing" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>See all plans</Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-pad" style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>FAQ</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '48px' }}>Questions answered.</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs.map((faq, i) => (
              <div key={i} className={i >= 3 ? 'faq-hide-mobile' : ''} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', background: 'none', border: 'none', padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px', fontFamily: 'inherit' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f0f0f' }}>{faq.q}</span>
                  <span style={{ fontSize: '1.4rem', color: '#9ca3af', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block', lineHeight: 1 }}>+</span>
                </button>
                {openFaq === i && <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.7, paddingBottom: '20px', margin: 0 }}>{faq.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '0 24px 80px' }}>
        <div className="final-cta" style={{ maxWidth: '1060px', margin: '0 auto', background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: '24px', padding: '80px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30%', right: '-10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />
          <p style={{ fontSize: '0.78rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Start today</p>
          <h2 className="final-cta-h2" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.04em', marginBottom: '16px', color: '#fff' }}>
            Your phone answers itself.<br />Your calendar fills itself.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: '40px', fontSize: '1.05rem' }}>Try free for 7 days — no charge until day 8.</p>
          <div className="hero-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" style={{ background: '#fff', color: '#6366f1', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '15px 36px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>Start free trial</Link>
            <Link href="/pricing" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', padding: '15px 36px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.25)' }}>See pricing</Link>
          </div>
          <div className="mobile-hide" style={{ display: 'flex', justifyContent: 'center', gap: '28px', marginTop: '24px', flexWrap: 'wrap' }}>
            {['No charge until day 8', '7-day free trial', 'Cancel in 1 click', 'Live in 5 minutes'].map(t => (
              <span key={t} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconCheckWhite />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {[{ label: 'Pricing', href: '/pricing' }, { label: 'Sign in', href: '/login' }, { label: 'Sign up', href: '/register' }, { label: 'Privacy', href: '/privacy' }, { label: 'Terms', href: '/terms' }, { label: 'Refund', href: '/refund' }].map(l => (
            <Link key={l.label} href={l.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '0.85rem' }}>{l.label}</Link>
          ))}
        </div>
        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>2026 VoiceBot AI</span>
      </footer>

      {/* STICKY MOBILE CTA */}
      {!user && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, padding: '12px 16px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #e5e7eb', display: 'none' }} className="mobile-cta">
          <Link href="/register" style={{ display: 'block', background: '#6366f1', color: '#fff', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
            Start free — 7 days →
          </Link>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          .mobile-cta { display: block !important; }
          .mobile-hide { display: none !important; }
          nav { padding: 0 20px !important; }
          .hero-section { min-height: auto !important; padding: 90px 20px 40px !important; }
          .hero-h1 { font-size: 2.4rem !important; line-height: 1.1 !important; }
          .hero-sub { font-size: 0.95rem !important; margin-bottom: 16px !important; }
          .hero-badges { gap: 6px !important; margin-bottom: 20px !important; }
          .hero-buttons { flex-direction: column !important; width: 100% !important; gap: 10px !important; }
          .hero-buttons a, .hero-buttons button { width: 100% !important; justify-content: center !important; box-sizing: border-box !important; }
          .demo-card { margin-top: 28px !important; padding: 18px !important; }
          .section-pad { padding: 48px 16px !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
          .features-grid { grid-template-columns: 1fr !important; }
          .feature-hide-mobile { display: none !important; }
          .faq-hide-mobile { display: none !important; }
          .roi-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .roi-box { padding: 14px 8px !important; }
          .roi-value { font-size: 1.3rem !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .plan-hide-mobile { display: none !important; }
          .final-cta { padding: 40px 20px !important; border-radius: 16px !important; margin: 0 16px !important; }
          .final-cta-h2 { font-size: 1.7rem !important; }
          footer { padding: 24px 20px !important; flex-direction: column !important; text-align: center !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  );
}