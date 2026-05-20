"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calls, setCalls] = useState([]);
  const [googleConnected, setGoogleConnected] = useState(false);

  const fetchCalls = useCallback(async (userId) => {
    const { data } = await supabase
      .from("calls")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setCalls(data);
  }, []);

  const fetchGoogleStatus = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from("clients")
      .select("google_connected")
      .eq("user_id", userId)
      .maybeSingle();
    console.log("Google status:", data, error);
    if (data?.google_connected) setGoogleConnected(true);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { window.location.href = "/login"; return; }
      setUser(session.user);
      await Promise.all([
        fetchCalls(session.user.id),
        fetchGoogleStatus(session.user.id),
      ]);
      setLoading(false);
    };
    checkUser();

    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") {
      setGoogleConnected(true);
      window.history.replaceState({}, "", "/dashboard");
    }
  }, [fetchCalls, fetchGoogleStatus]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <p className="text-zinc-400">Chargement...</p>
    </div>
  );

  const rdvCount = calls.filter(c => c.rdv_pris).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-zinc-800">
        <span className="font-bold text-lg">VoiceBot AI</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{user.email}</span>
          <button onClick={handleLogout} className="text-sm px-4 py-2 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition">
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-8">
        <h1 className="text-2xl font-bold">Tableau de bord</h1>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Appels reçus", value: calls.length },
            { label: "RDV pris", value: rdvCount },
            { label: "Leads qualifiés", value: calls.length - rdvCount },
          ].map(s => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <div className="text-3xl font-bold mb-1">{s.value}</div>
              <div className="text-sm text-zinc-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-lg">Google Calendar</h2>
            <p className="text-sm text-zinc-400 mt-1">
              {googleConnected
                ? "✅ Agenda connecté — les RDV sont automatiques."
                : "Connectez votre agenda pour les RDV automatiques."}
            </p>
          </div>
          {!googleConnected ? (
            <a href="/api/google/auth" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition">
              Connecter Google
            </a>
          ) : (
            <span className="px-5 py-2.5 bg-green-600/20 text-green-400 border border-green-600/30 rounded-lg text-sm font-semibold">
              Connecté ✓
            </span>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="font-semibold text-lg mb-4">Derniers appels</h2>
          {calls.length === 0 ? (
            <p className="text-zinc-600 text-sm py-8 text-center">Aucun appel pour le moment.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {calls.map(call => (
                <div key={call.id} className="flex items-start justify-between p-4 bg-zinc-800 rounded-xl">
                  <div>
                    <span className="text-sm font-medium">{call.caller_number}</span>
                    <p className="text-xs text-zinc-400 mt-0.5">{call.summary}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs text-zinc-500">{call.duration}s</span>
                    {call.rdv_pris && (
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">RDV ✓</span>
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