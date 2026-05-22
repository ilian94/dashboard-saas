import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

export const metadata = {
  title: "VoiceBot AI",
  description: "AI-powered voice assistant that answers calls 24/7, books appointments, and qualifies leads automatically.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J58PNLLBZ3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J58PNLLBZ3');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}