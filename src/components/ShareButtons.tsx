"use client";

import { Share2, Facebook, Linkedin } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  // Get the base URL with fallback
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mcp-server-directory.com";
  const fullUrl = `${baseUrl}/servers/${slug}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex space-x-3">
      <a 
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${title} on MCP Server Directory!`)}&url=${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-black rounded-full hover:bg-gray-800 transition-colors"
        aria-label="Share on X (Twitter)"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      </a>
      <a 
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4 text-blue-900" />
      </a>
      <a 
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4 text-blue-700" />
      </a>
      <a 
        href={`https://www.reddit.com/submit?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(`Check out ${title} on MCP Server Directory`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 bg-orange-50 rounded-full hover:bg-orange-100 transition-colors"
        aria-label="Share on Reddit"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF4500">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      </a>
      <button
        onClick={handleCopyLink}
        className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors relative"
        aria-label="Copy link"
      >
        <Share2 className="h-4 w-4 text-gray-700" />
        {copied && (
          <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
} 