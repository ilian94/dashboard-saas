import { NextResponse } from 'next/server';

export async function GET(req) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await fetch('https://voice-bot-saas.onrender.com/voice', { method: 'GET' });
    console.log('✅ Render pinged');
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Ping failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}