import Link from 'next/link';

const features = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 .95h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.84a16 16 0 006.07 6.07l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
    title: 'Réponse instantanée',
    desc: 'Votre VoiceBot décroche en moins de 2 secondes, 24h/24 et 7j/7, même les jours fériés.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    title: 'Prise de RDV automatique',
    desc: 'Synchronisation directe avec Google Calendar. Les créneaux sont réservés en temps réel.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>,
    title: 'IA conversationnelle',
    desc: 'Propulsé par Claude AI, le bot comprend le contexte et qualifie chaque lead intelligemment.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Résumé de chaque appel',
    desc: 'Chaque appel est transcrit et résumé dans votre dashboard. Rien ne vous échappe.',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    title: 'Alertes en temps réel',
    desc: "Recevez une notification dès qu'un RDV est pris ou qu'un lead prioritaire rappelle.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
    title: 'Configuration en 5 minutes',
    desc: "Connectez votre agenda, activez votre numéro, c'est prêt. Aucune compétence technique requise.",
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: 'white', fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 60px', borderBottom: '1px solid #1a1a1a', position: 'sticky', top: 0, background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(12px)', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/login" style={{ color: '#888', textDecoration: 'none', fontSize: '0.9rem', padding: '8px 16px' }}>Connexion</Link>
          <Link href="/pricing" style={{ background: 'white', color: 'black', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, padding: '8px 18px', borderRadius: '8px' }}>Commencer</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '120px 20px 100px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ display: 'inline-block', background: '#111', border: '1px solid #222', borderRadius: '100px', padding: '6px 16px', fontSize: '0.8rem', color: '#888', marginBottom: '32px', letterSpacing: '0.02em' }}>
          ✦ Propulsé par Claude AI
        </div>
        <h1 style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '24px', background: 'linear-gradient(135deg, #ffffff 0%, #666 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Ne ratez plus jamais<br />un appel client
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#555', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 48px' }}>
          VoiceBot AI répond à vos appels 24h/24, prend les rendez-vous sur Google Calendar et qualifie vos leads — automatiquement.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/register" style={{ background: 'white', color: 'black', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', letterSpacing: '-0.01em' }}>
            Commencer gratuitement →
          </Link>
          <Link href="/pricing" style={{ background: 'transparent', color: '#666', textDecoration: 'none', fontWeight: 500, fontSize: '1rem', padding: '14px 32px', borderRadius: '10px', border: '1px solid #222' }}>
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid #111', borderBottom: '1px solid #111', padding: '40px 60px', display: 'flex', justifyContent: 'center', gap: '80px', flexWrap: 'wrap' }}>
        {[
          { value: '24/7', label: 'Disponible en permanence' },
          { value: '< 2s', label: 'Temps de réponse' },
          { value: '100%', label: 'Appels traités' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'white' }}>{s.value}</div>
            <div style={{ fontSize: '0.85rem', color: '#444', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 40px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>Tout ce dont vous avez besoin</h2>
        <p style={{ textAlign: 'center', color: '#555', marginBottom: '64px', fontSize: '1rem' }}>Un assistant vocal IA qui gère vos appels comme un vrai collaborateur.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {features.map(f => (
            <div key={f.title} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '16px', padding: '32px' }}>
              <div style={{ width: '40px', height: '40px', background: '#161616', border: '1px solid #222', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: '#555', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ textAlign: 'center', padding: '80px 20px 120px', borderTop: '1px solid #111' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '16px' }}>Prêt à automatiser<br />vos appels ?</h2>
        <p style={{ color: '#555', marginBottom: '40px', fontSize: '1rem' }}>Rejoignez les professionnels qui ne ratent plus aucun client.</p>
        <Link href="/register" style={{ background: 'white', color: 'black', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', padding: '14px 36px', borderRadius: '10px' }}>
          Démarrer maintenant →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #111', padding: '32px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>VoiceBot AI</span>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/pricing" style={{ color: '#444', textDecoration: 'none', fontSize: '0.85rem' }}>Tarifs</Link>
          <Link href="/login" style={{ color: '#444', textDecoration: 'none', fontSize: '0.85rem' }}>Connexion</Link>
          <Link href="/register" style={{ color: '#444', textDecoration: 'none', fontSize: '0.85rem' }}>Inscription</Link>
        </div>
        <span style={{ color: '#333', fontSize: '0.8rem' }}>© 2026 VoiceBot AI</span>
      </footer>

    </div>
  );
}