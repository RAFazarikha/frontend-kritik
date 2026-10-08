import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Masukkan domain utama situs kamu
const baseUrl = "https://confesspakde.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Confess - Pak D Group",
    template: "%s | Confess - Pak D Group",
  },
  description: "Platform pesan dan cerita anonim untuk Intern Maganghub Pak D Group.",
  keywords: [
    "Confess",
    "Pak D Group",
    "Maganghub",
    "Pesan Anonim",
    "Confess Board",
    "Internship",
  ],
  authors: [{ name: "Pak D Group" }],
  creator: "Pak D Group",
  publisher: "Pak D Group",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // URL Kanonisasi untuk SEO
  alternates: {
    canonical: "/",
  },

  // Open Graph (Tampilan saat dibagikan ke WhatsApp, Facebook, LinkedIn, dll)
  openGraph: {
    title: "Confess - Pak D Group",
    description: "Titipkan rasa dan cerita anonimmu di platform Confess Intern Maganghub.",
    url: baseUrl,
    siteName: "Confess Pak D Group",
    images: [
      {
        url: "/og-image.png", // Gambar banner berukuran 1200x630px di folder public/
        width: 1200,
        height: 630,
        alt: "Confess - Pak D Group",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // Twitter Card Meta
  twitter: {
    card: "summary_large_image",
    title: "Confess - Pak D Group",
    description: "Titipkan rasa dan cerita anonimmu di platform Confess Intern Maganghub.",
    images: ["/og-image.png"],
  },

  // Pengaturan Indeks Mesin Pencari (Google Bot)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icon Website
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}