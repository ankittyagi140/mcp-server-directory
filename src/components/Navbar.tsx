"use client";

import Link from "next/link";
import { PlusCircle, Menu, X, LayoutDashboard, FileText, Server, BookOpen, Home, Laptop } from "lucide-react";
import { useAuth, signOut } from "@/lib/auth";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";

export default function Navbar() {
  const { user, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Use enhanced getImagePath with version flag
  const logoSrc = getImagePath("/mcp-server-directory.png", true);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

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

  // Close menu when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

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
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="flex gap-2 md:gap-10">
            <Link className="flex items-center space-x-2" href="/">
              <Image 
                src={logoSrc} 
                alt="MCP Server Directory" 
                width={32} 
                height={32} 
                priority 
                unoptimized
              />
              <span className="inline-block font-bold text-sm md:text-base md:max-w-full">MCP Server Directory</span>
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-2 md:space-x-4">
            <nav className="hidden md:flex gap-6">
              <Link
                href="/"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
              <Link
                href="/servers"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Server className="mr-2 h-4 w-4" />
                Servers
              </Link>
              <Link
                href="/clients"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Laptop className="mr-2 h-4 w-4" />
                Clients
              </Link>
              <Link
                href="/blog"
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Blog
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
                  <div className="relative hidden md:flex" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex cursor-pointer items-center space-x-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-800 transition-colors hover:bg-green-200"
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
                          {isAdmin ? (
                            <Link
                              href="/admin"
                              className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-muted"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="h-4 w-4 mr-2" />
                              Admin Dashboard
                            </Link>
                          ) : (
                            <Link
                              href="/submissions"
                              className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-muted"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              My Submissions
                            </Link>
                          )}
                          {/* Always show My Submissions for admins as a secondary option */}
                          {isAdmin && (
                            <Link
                              href="/submissions"
                              className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-muted"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              My Submissions
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-muted cursor-pointer"
                          >
                            <X className="h-4 w-4 mr-2" />
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
      </header>
      
      {/* Mobile menu - moved outside header to ensure full-screen blur */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-md z-[999] md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      ></div>
      
      <div 
        className={`fixed inset-y-0 right-0 z-[1000] w-[280px] bg-white shadow-xl h-[100vh] flex flex-col transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
        ref={menuRef}
      >
        {/* Menu header */}
        <div className="h-16 flex items-center justify-between px-6 border-b bg-white">
          <Image 
            src={logoSrc} 
            alt="MCP Server Directory" 
            width={28}
            height={28}
            priority
            unoptimized
          />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Menu content */}
        <div className="flex-1 py-6 px-6 overflow-y-auto bg-white">
          <nav className="flex flex-col space-y-6">
            <Link
              href="/"
              className="text-base font-medium flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="mr-2 h-5 w-5" />
              Home
            </Link>
            <Link
              href="/servers"
              className="text-base font-medium flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Server className="mr-2 h-5 w-5" />
              Servers
            </Link>
            <Link
              href="/clients"
              className="text-base font-medium flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Laptop className="mr-2 h-5 w-5" />
              Clients
            </Link>
            <Link
              href="/blog"
              className="text-base font-medium flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="mr-2 h-5 w-5" />
              Blog
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
                
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="text-base font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/submissions"
                    className="text-base font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    My Submissions
                  </Link>
                )}
                
                {/* Always show My Submissions for admins as a secondary option */}
                {isAdmin && (
                  <Link
                    href="/submissions"
                    className="text-base font-medium flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    My Submissions
                  </Link>
                )}
                
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
    </>
  );
} 