import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- PENGATURAN SEO GLOBAL ---
export const metadata: Metadata = {
  title: {
    default: "IDnity Tools - Solusi Cepat & Akurat untuk Web Developer",
    template: "%s | IDnity Tools"
  },
  description: "Platform utilities gratis dari IDnity untuk cek IP Address, Whois, dan kebutuhan teknis website lainnya bagi para pengelola web.",
  keywords: ["IP Checker", "Whois Lookup", "IDnity", "Web Developer Tools", "Hosting Indonesia"],
  authors: [{ name: "Sulistio" }],
  icons: {
    icon: "/favicon.ico", // Pastikan file favicon ada di folder public
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}