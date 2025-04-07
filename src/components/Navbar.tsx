"use client";

import Link from "next/link";
import { Server, PlusCircle, Menu, X } from "lucide-react";
import { useAuth, signOut } from "@/lib/auth";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await signOut();
      
      if (error) {
        toast.error(`Error signing out: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return;
      }
      
      // Clean up URL (remove any hash or query parameters)
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      toast.success("Signed out successfully");
      setIsMenuOpen(false);
      setIsUserMenuOpen(false);
    } catch (err: unknown) {
      console.error("Logout error:", err);
      toast.error("Something went wrong signing out");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center">
        <div className="flex gap-2 md:gap-10">
          <Link className="flex items-center space-x-2" href="/">
            <Server className="h-6 w-6 text-green-600" />
            <span className="inline-block font-bold text-sm md:text-base truncate max-w-[120px] md:max-w-full">MCP Server Directory</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-2 md:space-x-4">
          <nav className="hidden md:flex gap-6">
            <Link
              href="/servers"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Servers
            </Link>
            <Link
              href="/submit"
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit
            </Link>
          </nav>
          {!isLoading && (
            <>
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 transition-colors hover:bg-green-200"
                  >
                    <span className="flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      <span className="truncate max-w-[80px] md:max-w-[150px]">{user.email?.split("@")[0]}</span>
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 transition-transform ${
                        isUserMenuOpen ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>                  
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 rounded-md border bg-background shadow-lg z-50">
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-muted"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/login"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-green-600 px-4 text-sm font-medium text-white shadow transition-colors hover:bg-green-700"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </>
          )}
          
          <button
            className="flex md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 bg-white md:hidden" ref={menuRef}>
          <div className="container py-6 bg-white">
            <nav className="flex flex-col space-y-6">
              <Link
                href="/servers"
                className="text-base font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Servers
              </Link>
              <Link
                href="/submit"
                className="text-base font-medium flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Submit
              </Link>
              
              {!user ? (
                <Link
                  href="/login"
                  className="mt-4 w-full flex items-center justify-center rounded-full bg-green-600 px-4 py-3 text-base font-medium text-white shadow transition-colors hover:bg-green-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              ) : (
                <>
                  <div className="flex items-center py-2 px-4 bg-green-50 rounded-lg">
                    <span className="h-3 w-3 rounded-full bg-green-500 mr-3"></span>
                    <span className="font-medium text-green-800">{user.email?.split("@")[0]}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center rounded-full bg-red-100 px-4 py-3 text-base font-medium text-red-700 transition-colors hover:bg-red-200"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 