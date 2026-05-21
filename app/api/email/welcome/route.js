import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const { email, businessName } = await req.json();

  await resend.emails.send({
    from: 'VoiceBot AI <onboarding@resend.dev>',
    to: email,
    subject: 'Welcome to VoiceBot AI',
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: white; padding: 40px; border-radius: 16px;">
        <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">Welcome to VoiceBot AI</h1>
        <p style="color: #6b7280; margin-bottom: 32px;">Hi ${businessName || 'there'}, your account is ready.</p>
        <div style="background: #161b27; border: 1px solid #1e2433; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="font-size: 1rem; margin-bottom: 16px;">Next steps:</h2>
          <ol style="color: #9ca3af; padding-left: 20px; line-height: 2;">
            <li>Choose a plan to activate your VoiceBot</li>
            <li>Connect your Google Calendar</li>
            <li>Receive your dedicated phone number</li>
            <li>Forward your business number to VoiceBot</li>
          </ol>
        </div>
        <a href="https://dashboard-saas-nine.vercel.app/pricing" style="display: inline-block; background: #4f46e5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600;">Choose a plan →</a>
        <p style="color: #374151; font-size: 0.85rem; margin-top: 32px;">VoiceBot AI — Never miss a client call again.</p>
      </div>
    `,
  });

  return NextResponse.json({ success: true });
}