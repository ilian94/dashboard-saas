export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-800">
        <span className="text-xl font-bold tracking-tight">📞 VoiceBot AI</span>
        <div className="flex gap-4">
          <a href="/login" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">
            Connexion
          </a>
          <a href="/register" className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 rounded-lg transition font-medium">
            Essai gratuit
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center text-center px-6 py-28 gap-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full">
          Répondeur téléphonique IA
        </span>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl">
          Ne ratez plus jamais<br />
          <span className="text-blue-400">un appel client</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl">
          VoiceBot AI répond à vos appels 24h/24, prend les rendez-vous dans Google Calendar et qualifie vos leads — automatiquement.
        </p>
        <div className="flex gap-4 mt-2">
          <a href="/register" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold transition text-white">
            Commencer gratuitement →
          </a>
          <a href="#features" className="px-6 py-3 border border-gray-700 hover:border-gray-500 rounded-xl text-gray-300 hover:text-white transition">
            En savoir plus
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: "🤖", title: "IA conversationnelle", desc: "Powered by Claude AI, votre bot comprend le contexte et répond naturellement." },
          { icon: "📅", title: "Prise de RDV auto", desc: "Synchronisation en temps réel avec Google Calendar. Zéro double réservation." },
          { icon: "📊", title: "Dashboard en temps réel", desc: "Suivez vos appels, leads qualifiés et rendez-vous depuis une interface claire." },
        ].map((f) => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition">
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-4">Prêt à automatiser vos appels ?</h2>
        <a href="/register" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-lg transition">
          Créer mon compte →
        </a>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-6 text-gray-600 text-sm border-t border-gray-800">
        © 2026 VoiceBot AI — Tous droits réservés
      </footer>
    </main>
  );
}