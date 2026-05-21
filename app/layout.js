import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "VoiceBot AI",
  description: "AI-powered voice assistant that answers calls 24/7, books appointments, and qualifies leads automatically.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}