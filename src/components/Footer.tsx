"use client";

import Link from "next/link";
import Image from "next/image";
import { getImagePath } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t py-8 bg-background/95">
      <div className="container">
        <div className="mb-6 pb-6 border-b">
          <div className="flex items-start gap-4 max-w-xl">
            <div className="p-2 rounded-lg">
              <Image 
                src={getImagePath("/mcp-server-directory.png")} 
                alt="MCP Server Directory" 
                width={48} 
                height={48} 
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

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-3">
           
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} www.mcp-server-directory.com. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            {/* <Link href="/terms" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link> */}
            <Link href="https://github.com/atyagi/mcp-server-directory" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 