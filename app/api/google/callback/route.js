import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(new URL("/dashboard?error=access_denied", request.url));
  }

  // Échanger le code contre les tokens Google
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

  if (!tokens.refresh_token) {
    console.error("Pas de refresh_token:", tokens);
    return NextResponse.redirect(new URL("/dashboard?error=no_refresh_token", request.url));
  }

  // Récupérer l'email Google pour trouver le bon user dans Supabase
  const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const googleUser = await userInfoRes.json();
  console.log("Google user:", googleUser.email);

  // Chercher le client dans Supabase par email
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // D'abord chercher dans auth.users
  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const matchedUser = authUsers?.users?.find(u => u.email === googleUser.email);

  if (!matchedUser) {
    console.error("Aucun user Supabase trouvé pour:", googleUser.email);
    return NextResponse.redirect(new URL("/dashboard?error=user_not_found", request.url));
  }

  // Mettre à jour ou créer la ligne dans clients
  const { error: upsertError } = await supabase
    .from("clients")
    .upsert({
      user_id: matchedUser.id,
      email: matchedUser.email,
      google_refresh_token: tokens.refresh_token,
      google_connected: true,
    }, { onConflict: "user_id" });

  if (upsertError) {
    console.error("Erreur upsert:", upsertError);
    return NextResponse.redirect(new URL("/dashboard?error=db_error", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard?google=connected", request.url));
}