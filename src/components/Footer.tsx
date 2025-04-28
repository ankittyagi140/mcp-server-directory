"use client";

import Link from "next/link";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";
import { Github, Twitter, Mail, Linkedin } from "lucide-react";

export default function Footer() {
  // Use enhanced getImagePath with version flag
  const logoSrc = getImagePath("/mcp-server-directory.png", true);
  
  return (
    <footer className="py-12 bg-slate-900 text-slate-200">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center gap-3">
              <Image 
                src={logoSrc} 
                alt="MCP Server Directory" 
                width={36} 
                height={36} 
                loading="lazy"
                unoptimized
                className="rounded"
              />
              <h3 className="text-xl font-bold text-white">MCP Server Directory</h3>
            </div>
            <p className="mt-4 text-slate-300">
              The central hub for MCP Servers, featuring
              Awesome MCP Servers and Claude MCP integration.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-semibold text-lg text-white mb-6">Quick Links</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/servers" className="text-slate-300 hover:text-white transition-colors">
                  MCP Servers
                </Link>
              </li>
              <li>
                <Link href="/clients" className="text-slate-300 hover:text-white transition-colors">
                  MCP Clients
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h4 className="font-semibold text-lg text-white mb-6">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              <a 
                href="https://github.com/ankittyagi140/mcp-server-directory" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
              <a 
                href="https://x.com/mcpserverdir" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="www.linkedin.com/in/atyagi-js" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a 
                href="mailto:mcpserverdirectory@gmail.com" 
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm text-slate-400">
              Feel free to reach out to us at
              <a href="mailto:mcpserverdirectory@gmail.com" className="ml-1 text-slate-300 hover:text-white">
                mcpserverdirectory@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Section with Divider */}
        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-sm text-slate-400">
                &copy; {new Date().getFullYear()} www.mcp-server-directory.com
              </p>
              <p className="text-sm text-slate-400 md:block hidden">•</p>
              <p className="text-sm text-slate-400">All rights reserved.</p>
            </div>
            
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-slate-300 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/privacy" className="text-sm text-slate-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-slate-300 hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 