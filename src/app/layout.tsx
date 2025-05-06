import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import AuthProvider from '@/components/AuthProvider';
import { Toaster } from "react-hot-toast";
import AuthSuccess from '@/components/AuthSuccess';
import RoleDisplay from '@/components/RoleDisplay';
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Define logo path once with versioning

export const metadata: Metadata = {
  title: "MCP Server Directory | Find & Share Model Context Protocol Servers and Clients",
  description: "Discover and share MCP Servers and Clients for AI applications. Browse a comprehensive directory of Model Context Protocol servers with search, filtering, and submission capabilities.",
  keywords: ["MCP", "mcp server", "MCP Server Directory", "MCP clients", "MCP marketplace","MCP server marketplace","mcp client marketplace", "MCP server list", "MCP client list", "MCP clients directory", "Model Context Protocol", "MCP Servers", "Anthropic", "AI assistants", "server directory", "MCP integration"],
  authors: [{ name: "MCP Server Directory Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mcp-server-directory.com",
    title: "MCP Server Directory | Find & Share Model Context Protocol Servers",
    description: "Discover and share Model Context Protocol servers and clients for AI applications. The most comprehensive MCP server and client directory.",
    siteName: "MCP Server Directory",
    images: [
      {
        url: "/mcp-server-directory.png",
        width: 478,
        height: 480,
        alt: "MCP Server Directory Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MCP Server Directory | Find & Share Model Context Protocol Servers",
    description: "Browse, search, and submit Model Context Protocol servers and clients. The definitive MCP server and client directory.",
    images: ["/mcp-server-directory.png"],
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
      { url: "/mcp-server-directory.png", sizes: "478x480" },
      { url: "/mcp-server-directory.png", sizes: "192x192" },
      { url: "/mcp-server-directory.png", sizes: "128x128" },
    ],
    shortcut: "/mcp-server-directory.png",
    apple: [
      { url: "/mcp-server-directory.png", sizes: "180x180" },
      { url: "/mcp-server-directory.png", sizes: "152x152" },
      { url: "/mcp-server-directory.png", sizes: "120x120" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/mcp-server-directory.png",
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
        {/* Force browser to use the latest favicon */}
        <link rel="icon" href="/mcp-server-directory.png" sizes="any" />
        <link rel="shortcut icon" href="/mcp-server-directory.png" />
        <link rel="apple-touch-icon" href="/mcp-server-directory.png" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="google-site-verification" content="xgZR0c3YvTHe9t68xMEPrR4EjCkedhRvobbJmEYMevw" />
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1332831285527693"
     crossOrigin="anonymous"></Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 min-h-screen">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
          <Suspense fallback={null}>
            <AuthSuccess />
          </Suspense>
          {/* Only show RoleDisplay in development */}
          {process.env.NODE_ENV !== 'production' && (
            <Suspense fallback={null}>
              <RoleDisplay />
            </Suspense>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
