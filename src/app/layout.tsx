import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Next-AI SaaS'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${appName} - AI-Powered Text to Emoji`,
    template: `%s | ${appName}`,
  },
  description: "Transform your text into expressive emojis instantly with AI",
  keywords: ['AI', 'SaaS', 'Text to Emoji', 'AI Generation', 'Streaming'],
  authors: [{ name: appName }],
  creator: appName,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: appName,
    title: `${appName} - AI-Powered Text to Emoji`,
    description: "Transform your text into expressive emojis instantly with AI",
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appName} - AI-Powered Text to Emoji`,
    description: "Transform your text into expressive emojis instantly with AI",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white font-sans antialiased dark:bg-zinc-950`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
