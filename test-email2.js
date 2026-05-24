const { Resend } = require('resend');
const resend = new Resend('re_LYD9WKCo_XEP8qSjuf9D3isST79Hf9awt');

const LOGO = '<img src="https://dashboard-saas-nine.vercel.app/favicon.png" width="28" height="28" style="border-radius:8px;vertical-align:middle;display:inline-block;" alt="VoiceBot AI">';

resend.emails.send({
  from: 'VoiceBot AI <onboarding@resend.dev>',
  to: 'ilian.lahsini@gmail.com',
  subject: 'Your VoiceBot is now active',
  html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#080b12;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080b12;padding:40px 16px;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:32px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td>${LOGO}&nbsp;<span style="color:#e2e8f0;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;vertical-align:middle;">VoiceBot AI</span></td>
          <td align="right"><span style="background:rgba(99,102,241,0.15);border:1px solid rgba(99,102,241,0.3);color:#818cf8;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;text-transform:uppercase;">Business Plan</span></td>
        </tr></table>
      </td></tr>
      <tr><td style="background:linear-gradient(135deg,#0f1420,#13192b);border:1px solid #1e2a3a;border-radius:16px;padding:40px 36px;">
        <p style="margin:0 0 20px;color:#6366f1;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;">Welcome aboard</p>
        <h1 style="margin:0 0 12px;color:#f8fafc;font-size:32px;font-weight:800;line-height:1.1;">Your VoiceBot<br>is live ✅</h1>
        <p style="margin:0;color:#64748b;font-size:15px;line-height:1.6;">Hi John — your AI receptionist is now answering calls 24/7.</p>
      </td></tr>
      <tr><td style="height:12px;"></td></tr>
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td width="48%" style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:20px 24px;">
            <p style="margin:0 0 6px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;">Your plan</p>
            <p style="margin:0 0 4px;color:#f8fafc;font-size:20px;font-weight:800;">Business</p>
            <p style="margin:0;color:#6366f1;font-size:13px;font-weight:600;">6,000 min/month</p>
          </td>
          <td width="4%"></td>
          <td width="48%" style="background:#0f1420;border:1px solid #1e2a3a;border-radius:12px;padding:20px 24px;">
            <p style="margin:0 0 6px;color:#475569;font-size:10px;font-weight:700;text-transform:uppercase;">Your number</p>
            <p style="margin:0 0 4px;color:#f8fafc;font-size:18px;font-weight:800;font-family:'Courier New',monospace;">+19066677909</p>
            <p style="margin:0;color:#64748b;font-size:12px;">Forward calls here</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="height:24px;"></td></tr>
      <tr><td align="center"><a href="https://dashboard-saas-nine.vercel.app/dashboard" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:16px 36px;border-radius:10px;font-weight:800;font-size:15px;">Open Dashboard →</a></td></tr>
      <tr><td style="padding-top:32px;">
        <p style="margin:24px 0 4px;color:#334155;font-size:12px;text-align:center;">VoiceBot AI — Never miss a client call again.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}).then(console.log).catch(console.error);