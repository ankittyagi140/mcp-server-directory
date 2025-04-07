import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About MCP Server Directory | Our Mission and Features",
  description: "Learn about the Model Context Protocol Server Directory, our mission to catalog MCP servers, and how you can contribute to the community.",
  keywords: ["about MCP Directory", "Model Context Protocol", "MCP mission", "MCP community", "MCP features"],
  openGraph: {
    title: "About the MCP Server Directory",
    description: "Discover our mission to create a comprehensive catalog of Model Context Protocol servers and how we're supporting the MCP ecosystem.",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">About MCP Server Directory</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <p>
            The MCP (Model Context Protocol) Server Directory is a community-driven platform
            that aims to catalog and showcase various MCP server implementations.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to provide a comprehensive resource for developers, server
            administrators, and AI enthusiasts to discover and share MCP servers.
            Whether you&apos;re looking for servers for development, testing, or production,
            our directory offers a centralized place to find what you need.
          </p>
          
          <h2>Features</h2>
          <ul>
            <li>
              <strong>Comprehensive Listings</strong>: Browse through a curated list of MCP
              servers with detailed information.
            </li>
            <li>
              <strong>Search & Filter</strong>: Find servers by tags, features, or keywords
              to quickly locate what you need.
            </li>
            <li>
              <strong>Server Submission</strong>: Share your own MCP server implementations
              with the community.
            </li>
            <li>
              <strong>Detailed Information</strong>: Each server listing includes important
              details like endpoint URLs, descriptions, GitHub links, and more.
            </li>
          </ul>
          
          <h2>Server Moderation</h2>
          <p>
            To maintain quality and relevance, all server submissions are reviewed by our
            team before being published. This ensures that all listings meet our standards
            and provide value to the community.
          </p>
          
          <h2>Get Involved</h2>
          <p>
            We welcome contributions from the community! You can get involved by:
          </p>
          <ul>
            <li>Submitting your MCP server to the directory</li>
            <li>Providing feedback on existing server listings</li>
            <li>Suggesting features or improvements for the directory</li>
            <li>Contributing to the codebase on our GitHub repository</li>
          </ul>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions, suggestions, or feedback, please don&apos;t hesitate to
            contact us at <a href="mailto:contact@mcpserverdirectory.com">contact@mcpserverdirectory.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
} 