import "./globals.css";

export const metadata = {
  title: "VoiceBot AI",
  description: "Répondeur téléphonique IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}