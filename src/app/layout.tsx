import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from "react-hot-toast";
import AuthSuccess from '@/components/AuthSuccess';
import { getImagePath } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define logo path once
const logoPath = getImagePath("/mcp-server-directory.png");

export const metadata: Metadata = {
  title: "MCP Server Directory | Find & Share Model Context Protocol Servers",
  description: "Discover and share MCP Servers for AI applications. Browse a comprehensive directory of Model Context Protocol servers with search, filtering, and submission capabilities.",
  keywords: ["MCP", "mcp server", "Model Context Protocol", "MCP Servers", "Claude", "Anthropic", "AI", "AI assistants", "server directory", "MCP integration"],
  authors: [{ name: "MCP Server Directory Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mcp-server-directory.com",
    title: "MCP Server Directory | Find & Share Model Context Protocol Servers",
    description: "Discover and share Model Context Protocol servers for AI applications. The most comprehensive MCP server directory.",
    siteName: "MCP Server Directory",
    images: [
      {
        url: logoPath,
        width: 478,
        height: 480,
        alt: "MCP Server Directory Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Server Directory | Find & Share Model Context Protocol Servers",
    description: "Browse, search, and submit Model Context Protocol servers. The definitive MCP server directory.",
    images: [logoPath],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://mcp-server-directory.com"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: logoPath, sizes: "478x480" },
      { url: logoPath, sizes: "192x192" },
      { url: logoPath, sizes: "128x128" },
    ],
    shortcut: logoPath,
    apple: [
      { url: logoPath, sizes: "180x180" },
      { url: logoPath, sizes: "152x152" },
      { url: logoPath, sizes: "120x120" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: logoPath,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={logoPath} sizes="any" />
        <meta name="google-site-verification" content="xgZR0c3YvTHe9t68xMEPrR4EjCkedhRvobbJmEYMevw" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
          <Suspense fallback={null}>
            <AuthSuccess />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
