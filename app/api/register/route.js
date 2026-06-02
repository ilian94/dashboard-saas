import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function POST(req) {
  const { userId, email, businessName } = await req.json();

  await supabase.from('clients').insert([{
    user_id: userId,
    email,
    business_name: businessName,
  }]);

  return NextResponse.json({ ok: true });
}