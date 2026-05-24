import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
  // Vérifier le token Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Récupérer tous les clients avec un plan actif
  const { data: clients } = await supabase
    .from('clients')
    .select('user_id, email, business_name, plan')
    .not('plan', 'is', null);

  if (!clients?.length) return Response.json({ ok: true });

  // Date de début de semaine (lundi dernier)
  const now = new Date();
  const lastMonday = new Date(now);
  lastMonday.setDate(now.getDate() - 7);
  lastMonday.setHours(0, 0, 0, 0);

  for (const client of clients) {
    const { data: calls } = await supabase
      .from('calls')
      .select('duration, rdv_pris, created_at')
      .eq('user_id', client.user_id)
      .gte('created_at', lastMonday.toISOString());

    const totalCalls = calls?.length || 0;
    const totalRdv = calls?.filter(c => c.rdv_pris).length || 0;
    const totalMinutes = Math.round((calls?.reduce((acc, c) => acc + (c.duration || 0), 0) || 0) / 60);

    // Envoyer seulement si au moins 1 appel cette semaine
    if (totalCalls === 0) continue;

    await resend.emails.send({
      from: 'VoiceBot AI <onboarding@resend.dev>',
      to: client.email,
      subject: `Your VoiceBot weekly report 📊`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: white; padding: 40px; border-radius: 16px;">
          <h1 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 4px;">Weekly Report</h1>
          <p style="color: #6b7280; margin-bottom: 32px;">Here's how your VoiceBot performed this week, ${client.business_name || 'there'}.</p>

          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 32px;">
            ${[
              { label: 'Calls received', value: totalCalls },
              { label: 'Appointments booked', value: totalRdv },
              { label: 'Minutes used', value: totalMinutes },
            ].map(s => `
              <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 16px; text-align: center;">
                <div style="font-size: 1.8rem; font-weight: 800; color: white;">${s.value}</div>
                <div style="font-size: 0.75rem; color: #6b7280; margin-top: 4px;">${s.label}</div>
              </div>
            `).join('')}
          </div>

          <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">
            View full dashboard →
          </a>

          <p style="color: #374151; font-size: 0.85rem; margin-top: 32px;">VoiceBot AI — Never miss a client call again.</p>
        </div>
      `,
    });
  }

  return Response.json({ ok: true, sent: clients.length });
}