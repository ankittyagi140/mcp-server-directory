import Link from "next/link";
import { ArrowRight, Search, Server, Upload, Star} from "lucide-react";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero section */}
      <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50 text-slate-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2 sm:space-y-4 max-w-4xl">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                MCP Server <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Directory</span>
              </h1>
              <p className="mx-auto max-w-[800px] text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-slate-700 px-1">
                Discover and share Model Context Protocol Servers for AI applications, development, and integration.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full max-w-md mx-auto z-10 relative">
              <Link 
                href="/servers" 
                className="w-full sm:w-auto inline-flex h-11 md:h-12 items-center justify-center rounded-full bg-green-600 px-5 sm:px-8 text-sm sm:text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 touch-manipulation z-10 relative"
              >
                Browse Servers
              </Link>
              <Link 
                href="/submit" 
                className="w-full sm:w-auto inline-flex h-11 md:h-12 items-center justify-center rounded-full bg-white border border-slate-200 px-5 sm:px-8 text-sm sm:text-base font-medium text-slate-800 shadow-lg transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 touch-manipulation z-10 relative"
              >
                Submit Server
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
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:gap-8 py-8 sm:py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-4px]">
              <div className="rounded-full bg-green-50 p-3 sm:p-4">
                <Server className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Server Listings</h3>
              <p className="text-center text-sm sm:text-base text-slate-600">
                Browse comprehensive listings with server details, endpoints, and features.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-4px]">
              <div className="rounded-full bg-green-50 p-3 sm:p-4">
                <Search className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Search & Filter</h3>
              <p className="text-center text-sm sm:text-base text-slate-600">
                Find servers by tags, features, or keywords with powerful search capabilities.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-3 sm:space-y-4 rounded-2xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-4px]">
              <div className="rounded-full bg-green-50 p-3 sm:p-4">
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Server Submission</h3>
              <p className="text-center text-sm sm:text-base text-slate-600">
                Submit your own MCP servers to the directory using our simple form.
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
                Discover all available MCP servers or add your own to the directory. Join our growing community today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto z-10 relative mt-2">
              <Link 
                href="/servers" 
                className="w-full sm:w-auto inline-flex h-11 md:h-12 items-center justify-center rounded-full bg-green-600 px-5 sm:px-8 text-sm sm:text-base font-medium text-white shadow-lg transition-colors hover:bg-green-700 z-10 relative"
              >
                Browse All Servers <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
              <Link 
                href="/submit" 
                className="w-full sm:w-auto inline-flex h-11 md:h-12 items-center justify-center rounded-full bg-white border border-slate-200 px-5 sm:px-8 text-sm sm:text-base font-medium text-slate-800 shadow-lg transition-colors hover:bg-slate-50 z-10 relative"
              >
                Submit a Server
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ section */}
      <section className="bg-white py-12 sm:py-16 md:py-20 border-t border-slate-100">
        <FaqSection />
      </section>
    </div>
  );
}
