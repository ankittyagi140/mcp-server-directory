import Link from "next/link";
import { ArrowRight, Server, Star, Shield, LineChart, Settings, Bell, LayoutDashboard } from "lucide-react";
import FaqSection from "@/components/FaqSection";
import Script from "next/script";

export default function Home() {
  // Define the FAQ items for structured data
  const faqItems = [
    {
      "@type": "Question",
      "name": "What is MCP (Model Context Protocol)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MCP is an open-source protocol developed by Anthropic that enables AI systems like Claude to securely connect with various data sources. It provides a universal standard for AI assistants to access external data, tools, and prompts through a client-server architecture."
      }
    },
    {
      "@type": "Question",
      "name": "What are MCP Servers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MCP Servers are systems that provide context, tools, and prompts to AI clients. They can expose data sources like files, documents, databases, and API integrations, allowing AI assistants to access real-time information in a secure way."
      }
    },
    {
      "@type": "Question",
      "name": "How do MCP Servers work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MCP Servers work through a simple client-server architecture. They expose data and tools through a standardized protocol, maintaining secure 1:1 connections with clients inside host applications like Claude Desktop."
      }
    },
    {
      "@type": "Question",
      "name": "What can MCP Servers provide?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "MCP Servers can share resources (files, docs, data), expose tools (API integrations, actions), and provide prompts (templated interactions). They control their own resources and maintain clear system boundaries for security."
      }
    },
    {
      "@type": "Question",
      "name": "How does Claude use MCP?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Claude can connect to MCP servers to access external data sources and tools, enhancing its capabilities with real-time information. Currently, this works with local MCP servers, with enterprise remote server support coming soon."
      }
    },
    {
      "@type": "Question",
      "name": "Are MCP Servers secure?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, security is built into the MCP protocol. Servers control their own resources, there's no need to share API keys with LLM providers, and the system maintains clear boundaries. Each server manages its own authentication and access control."
      }
    },
    {
      "@type": "Question",
      "name": "What is mcp-server-directory.com?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "mcp-server-directory.com is a community-driven platform that collects and organizes third-party MCP Servers. It serves as a central directory where users can discover, share, and learn about various MCP Servers available for AI applications."
      }
    },
    {
      "@type": "Question",
      "name": "How can I submit my MCP Server to mcp-server-directory.com?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can submit your MCP Server by creating a new issue in our GitHub repository. Click the Submit button in the navigation bar or visit our GitHub issues page directly. Please provide details about your server including its name, description, features, and connection information."
      }
    }
  ];

  // Define structured data for the home page with JSON-LD
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.mcp-server-directory.com/#organization",
        "name": "MCP Server Directory",
        "url": "https://www.mcp-server-directory.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.mcp-server-directory.com/mcp-server-directory.png",
          "width": 478,
          "height": 480
        },
        "description": "Discover and share Model Context Protocol Servers for AI applications, development, and integration.",
        "sameAs": [
          "https://github.com/ankittyagi140/mcp-server-directory"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://www.mcp-server-directory.com/#website",
        "url": "https://www.mcp-server-directory.com/",
        "name": "MCP Server Directory",
        "description": "Discover and share Model Context Protocol Servers for AI applications, development, and integration.",
        "publisher": {
          "@id": "https://www.mcp-server-directory.com/#organization"
        },
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.mcp-server-directory.com/servers?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.mcp-server-directory.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.mcp-server-directory.com/"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": "https://www.mcp-server-directory.com/#webpage",
        "url": "https://www.mcp-server-directory.com/",
        "name": "MCP Server Directory | Find & Share Model Context Protocol Servers",
        "description": "Discover and share MCP Servers for AI applications. Browse a comprehensive directory of Model Context Protocol servers with search, filtering, and submission capabilities.",
        "isPartOf": {
          "@id": "https://www.mcp-server-directory.com/#website"
        },
        "about": {
          "@id": "https://www.mcp-server-directory.com/#organization"
        },
        "breadcrumb": {
          "@id": "https://www.mcp-server-directory.com/#breadcrumb"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://www.mcp-server-directory.com/mcp-server-directory.png"
        },
        "inLanguage": "en-US",
        "potentialAction": [
          {
            "@type": "ReadAction",
            "target": ["https://www.mcp-server-directory.com/servers"]
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.mcp-server-directory.com/#faqpage",
        "url": "https://www.mcp-server-directory.com/#faq",
        "name": "Frequently Asked Questions about MCP Servers",
        "description": "Common questions and answers about Model Context Protocol and MCP Servers",
        "isPartOf": {
          "@id": "https://www.mcp-server-directory.com/#webpage"
        },
        "mainEntity": faqItems
      }
    ]
  };

  return (
    <div className="flex flex-col items-center">
      {/* JSON-LD structured data */}
      <Script id="homepage-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      
      {/* Hero section */}
      <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50 text-slate-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 sm:space-y-4 max-w-4xl">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                MCP <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Directory</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-slate-700 px-1">
                Discover and share Model Context Protocol Servers and Clients for AI applications, development, and integration.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md mx-auto z-10 relative">
              <Link 
                href="/servers" 
                className="w-full sm:w-auto inline-flex h-11 md:h-12 items-center justify-center rounded-full bg-green-600 px-5 sm:px-8 text-sm sm:text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 touch-manipulation z-10 relative"
              >
                Browse Directory <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link 
                href="/submit" 
                className="w-full sm:w-auto inline-flex h-11 md:h-12 items-center justify-center rounded-full bg-white border border-slate-200 px-5 sm:px-8 text-sm sm:text-base font-medium text-slate-800 shadow-lg transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 touch-manipulation z-10 relative"
              >
                Submit
              </Link>
            </div>
            
            {/* Subtle floating shapes for visual appeal */}
            <div className="absolute top-1/4 left-10 w-48 h-48 bg-green-50 rounded-full blur-3xl opacity-30 z-0"></div>
            <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-30 z-0"></div>
            <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-30 z-0"></div>
          </div>
        </div>
      </section>

      {/* Trusted by section */}
      <section className="w-full py-8 sm:py-10 bg-white border-y border-slate-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-xs sm:text-sm text-slate-500 uppercase font-medium tracking-wider mb-4 sm:mb-6">Trusted by AI developers worldwide</p>
            <div className="flex flex-wrap justify-center gap-5 sm:gap-8 md:gap-16 text-slate-600">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-sm sm:text-base font-semibold">Anthropic</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-sm sm:text-base font-semibold">OpenAI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-sm sm:text-base font-semibold">Cohere</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-sm sm:text-base font-semibold">AI Startups</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                <span className="text-sm sm:text-base font-semibold">Enterprise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="w-full py-12 sm:py-16 md:py-20 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 text-center mb-8 sm:mb-12">
            <div className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs sm:text-sm font-medium text-green-600">
              Everything you need
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900">
                Powerful Features
              </h2>
              <p className="mx-auto max-w-[700px] text-sm sm:text-base md:text-lg lg:text-xl text-slate-600">
                Explore what our MCP Server Directory offers to help you find and share the perfect servers.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                  <Server className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold">Server Management</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Easily manage your server settings, monitor performance, and handle user requests all in one place.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Secure Authentication</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Built-in authentication system with support for multiple providers and role-based access control.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                  <LineChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Track server performance, user engagement, and other key metrics with our comprehensive analytics.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/20">
                  <Settings className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold">Customizable Settings</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Fine-tune your server configuration with a wide range of customizable options and settings.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                  <Bell className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-semibold">Real-time Notifications</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Stay informed with instant notifications about server status, user activities, and important updates.
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/20">
                  <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold">Dedicated Dashboard</h3>
              </div>
              <p className="mt-4 text-muted-foreground">
                Access a powerful admin dashboard to manage servers, users, and content with ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="w-full py-12 sm:py-16 md:py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
            <div className="space-y-2 sm:space-y-3 max-w-3xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-slate-900">
                Ready to Explore the MCP Ecosystem?
              </h2>
              <p className="mx-auto max-w-[600px] text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 px-1">
                Discover all available MCP servers and clients or add your own to the directory. Join our growing community today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto z-10 relative mt-2">
              <Link 
                href="/servers" 
                className="w-full sm:w-auto inline-flex h-11 md:h-12 items-center justify-center rounded-full bg-green-600 px-5 sm:px-8 text-sm sm:text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 z-10 relative"
              >
                Browse Directory <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link 
                href="/submit" 
                className="w-full sm:w-auto inline-flex h-11 md:h-12 items-center justify-center rounded-full bg-white border border-slate-200 px-5 sm:px-8 text-sm sm:text-base font-medium text-slate-800 shadow-lg transition-colors hover:bg-slate-50 z-10 relative"
              >
                Submit
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section id="faq" className="bg-white py-12 sm:py-16 md:py-20 border-t border-slate-100">
        <FaqSection />
      </section>
    </div>
  );
}
