import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const userId = searchParams.get("state");

  console.log("State reçu:", userId);
  console.log("Tous les params:", Object.fromEntries(searchParams));

  if (error || !code) {
    return NextResponse.redirect(new URL("/dashboard?error=access_denied", request.url));
  }

  if (!userId) {
    return NextResponse.redirect(new URL("/dashboard?error=no_user", request.url));
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();
  console.log("Tokens reçus:", JSON.stringify(tokens));

  if (!tokens.access_token) {
    console.error("Pas d'access_token:", tokens);
    return NextResponse.redirect(new URL("/dashboard?error=no_token", request.url));
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { error: upsertError } = await supabase
    .from("clients")
    .upsert({
      user_id: userId,
      google_refresh_token: tokens.refresh_token || null,
      google_connected: true,
      calendar_type: 'google',
    }, { onConflict: "user_id" });

  if (upsertError) {
    console.error("Erreur upsert:", upsertError);
    return NextResponse.redirect(new URL("/dashboard?error=db_error", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard?google=connected", request.url));
}