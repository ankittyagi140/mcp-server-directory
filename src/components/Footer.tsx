"use client";

import Link from "next/link";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";
import { Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  // Use enhanced getImagePath with version flag
  const logoSrc = getImagePath("/mcp-server-directory.png", true);
  
  return (
    <footer className="border-t py-8 bg-background/95">
      <div className="container">
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-start gap-4 max-w-xl">
            <div className="p-2 rounded-lg">
              <Image 
                src={logoSrc} 
                alt="MCP Server Directory" 
                width={48} 
                height={48} 
                priority
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">MCP Server Directory</h3>
              <p className="mt-2 text-muted-foreground">
                The largest collection of MCP Servers, featuring
                Awesome MCP Servers and Claude MCP integration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} www.mcp-server-directory.com. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-8">
            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                About
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Privacy
              </Link>
            </div>
            
            {/* Socials */}
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-muted-foreground mr-2">Socials</span>
              <a 
                href="https://github.com/ankittyagi140/mcp-server-directory" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="https://x.com/mcpserverdir" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="mailto:mcpserverdirectory@gmail.com" 
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 