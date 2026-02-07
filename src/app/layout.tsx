import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mo Consult",
  description: "Mo Consult – Company creation platform (Belgium)",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen text-dark antialiased">{children}</body>
    </html>
  );
}
