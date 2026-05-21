import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Pages protégées
  const protectedRoutes = ['/dashboard'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtected) return NextResponse.next();

  // Vérifier le cookie de session Supabase
  const token = req.cookies.get('sb-anahzecobuzymyrfocqe-auth-token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};