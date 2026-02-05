import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { seoConfig } from "@/config/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const brandName = siteConfig.brand.name
const { title: defaultTitle, description } = seoConfig.default
const keywords = [...seoConfig.default.keywords]

// Build twitter metadata conditionally
const twitterMeta: Metadata['twitter'] = {
  card: seoConfig.twitter.card,
  title: `${brandName} - ${defaultTitle}`,
  description,
}
if (seoConfig.twitter.site) {
  twitterMeta.site = seoConfig.twitter.site
}
if (seoConfig.twitter.creator) {
  twitterMeta.creator = seoConfig.twitter.creator
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${brandName} - ${defaultTitle}`,
    template: `%s | ${brandName}`,
  },
  description,
  keywords,
  authors: [{ name: brandName }],
  creator: brandName,
  openGraph: {
    type: seoConfig.openGraph.type,
    locale: seoConfig.openGraph.locale,
    url: baseUrl,
    siteName: brandName,
    title: `${brandName} - ${defaultTitle}`,
    description,
  },
  twitter: twitterMeta,
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
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
