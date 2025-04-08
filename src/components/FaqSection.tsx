"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FaqSectionProps {
  hideTitle?: boolean;
}

interface FaqItem {
  id: number;
  question: string;
  answer: React.ReactNode;
}

const faqItems: FaqItem[] = [
  {
    id: 1,
    question: "What is MCP (Model Context Protocol)?",
    answer: (
      <p>
        MCP is an open-source protocol developed by Anthropic that enables AI
        systems like Claude to securely connect with various data sources. It
        provides a universal standard for AI assistants to access external data,
        tools, and prompts through a client-server architecture.
      </p>
    ),
  },
  {
    id: 2,
    question: "What are MCP Servers?",
    answer: (
      <p>
        MCP Servers are systems that provide context, tools, and prompts to AI
        clients. They can expose data sources like files, documents, databases,
        and API integrations, allowing AI assistants to access real-time
        information in a secure way.
      </p>
    ),
  },
  {
    id: 3,
    question: "How do MCP Servers work?",
    answer: (
      <p>
        MCP Servers work through a simple client-server architecture. They
        expose data and tools through a standardized protocol, maintaining
        secure 1:1 connections with clients inside host applications like
        Claude Desktop.
      </p>
    ),
  },
  {
    id: 4,
    question: "What can MCP Servers provide?",
    answer: (
      <p>
        MCP Servers can share resources (files, docs, data), expose tools (API
        integrations, actions), and provide prompts (templated interactions).
        They control their own resources and maintain clear system boundaries
        for security.
      </p>
    ),
  },
  {
    id: 5,
    question: "How does Claude use MCP?",
    answer: (
      <p>
        Claude can connect to MCP servers to access external data sources and
        tools, enhancing its capabilities with real-time information. Currently,
        this works with local MCP servers, with enterprise remote server support
        coming soon.
      </p>
    ),
  },
  {
    id: 6,
    question: "Are MCP Servers secure?",
    answer: (
      <p>
        Yes, security is built into the MCP protocol. Servers control their own
        resources, there&apos;s no need to share API keys with LLM providers, and the
        system maintains clear boundaries. Each server manages its own
        authentication and access control.
      </p>
    ),
  },
  {
    id: 7,
    question: "What is mcp-server-directory.com?",
    answer: (
      <p>
        mcp-server-directory.com is a community-driven platform that collects and organizes
        third-party MCP Servers. It serves as a central directory where users
        can discover, share, and learn about various MCP Servers available for
        AI applications.
      </p>
    ),
  },
  {
    id: 8,
    question: "How can I submit my MCP Server to mcp-server-directory.com?",
    answer: (
      <p>
        You can submit your MCP Server by creating a new issue in our GitHub
        repository. Click the Submit button in the navigation bar or visit our
        GitHub issues page directly. Please provide details about your server
        including its name, description, features, and connection information.
      </p>
    ),
  },
];

export default function FaqSection({ hideTitle = false }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([1]));

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="w-full py-8 sm:py-12 md:py-16 lg:py-20 border-t">
      <div className="container px-4 md:px-6">
        {!hideTitle && (
          <div className="mb-6 sm:mb-10 flex flex-col items-center text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
              FAQ
            </h2>
            <p className="mt-2 sm:mt-4 max-w-[700px] text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground">
              Frequently Asked Questions about MCP Servers
            </p>
          </div>
        )}

        <div className="mx-auto max-w-3xl space-y-3 sm:space-y-4">
          {faqItems.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border transition-all"
            >
              <button
                className="flex w-full items-center justify-between p-3 sm:p-4 text-left text-sm sm:text-base font-medium"
                onClick={() => toggleItem(item.id)}
                aria-expanded={openItems.has(item.id)}
                aria-controls={`faq-content-${item.id}`}
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {item.id}
                  </span>
                  {item.question}
                </span>
                {openItems.has(item.id) ? (
                  <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                )}
              </button>
              {openItems.has(item.id) && (
                <div
                  id={`faq-content-${item.id}`}
                  className="border-t px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-muted-foreground"
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 