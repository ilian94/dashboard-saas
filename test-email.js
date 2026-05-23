const { Resend } = require('resend');
const resend = new Resend('re_LYD9WKCo_XEP8qSjuf9D3isST79Hf9awt');

const plan = 'business';
const twilioNumber = '+19066677909';
const businessName = 'VoiceBot AI';
const planLabel = 'Business';
const planMinutes = '6,000';

resend.emails.send({
  from: 'VoiceBot AI <onboarding@resend.dev>',
  to: 'ilian.lahsini@gmail.com',
  subject: 'Your VoiceBot is now active',
  html: `
    <div style="font-family:Helvetica Neue,Arial,sans-serif;max-width:600px;margin:0 auto;background:#080b12;padding:40px;border-radius:16px;">
      <table width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><span style="color:#e2e8f0;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">🤖 VoiceBot AI</span></td>
        <td align="right"><span style="background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#818cf8;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;">${planLabel} Plan</span></td>
      </tr></table>
      <div style="background:linear-gradient(135deg,#0f1420,#13192b);border:1px solid #1e2a3a;border-radius:16px;padding:40px;margin-top:24px;">
        <p style="margin:0 0 20px;color:#6366f1;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Welcome aboard</p>
        <h1 style="margin:0 0 12px;color:#f8fafc;font-size:32px;font-weight:800;line-height:1.1;">Your VoiceBot<br>is live</h1>
        <p style="margin:0;color:#64748b;font-size:15px;line-height:1.6;">Hi ${businessName} — your AI receptionist is now answering calls 24/7.</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;"><tr>
        <td width="48%" style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:20px 24px;">
          <p style="margin:0 0 6px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;">Your plan</p>
          <p style="margin:0 0 4px;color:#f8fafc;font-size:20px;font-weight:800;">${planLabel}</p>
          <p style="margin:0;color:#6366f1;font-size:13px;font-weight:600;">${planMinutes} min/month</p>
        </td>
        <td width="4%"></td>
        <td width="48%" style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:20px 24px;">
          <p style="margin:0 0 6px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;">Your number</p>
          <p style="margin:0 0 4px;color:#f8fafc;font-size:18px;font-weight:800;font-family:Courier New,monospace;">${twilioNumber}</p>
          <p style="margin:0;color:#64748b;font-size:12px;">Forward calls here</p>
        </td>
      </tr></table>
      <div style="text-align:center;margin-top:24px;">
        <a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 36px;border-radius:10px;font-weight:800;font-size:15px;">Open Dashboard</a>
      </div>
      <p style="margin:24px 0 0;color:#334155;font-size:12px;text-align:center;">VoiceBot AI — Never miss a client call again.</p>
    </div>
  `
}).then(console.log).catch(console.error);
