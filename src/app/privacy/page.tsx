import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | MCP Server Directory",
  description: "The Privacy Policy for using the MCP Server Directory, which outlines how we collect, use, and protect your data.",
  keywords: ["MCP", "MCP Server Directory", "Privacy Policy", "Data Collection", "Data Protection", "User Rights"],
  openGraph: {
    title: "Privacy Policy | MCP Server Directory",
    description: "The Privacy Policy for using the MCP Server Directory, which outlines how we collect, use, and protect your data.",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Privacy Policy</h1>
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <h2>Introduction</h2>
          <p>
            Welcome to the MCP Server Directory (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and providing you with a safe experience. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
          </p>
          <p>
            Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
          </p>
          
          <h2>Information We Collect</h2>
          <p>We may collect information about you in various ways, including:</p>
          <ul>
            <li><strong>Personal Data</strong>: When you register an account, we may collect your name, email address, and Discord ID.</li>
            <li><strong>Server Information</strong>: Information about Minecraft servers you submit to our directory.</li>
            <li><strong>Usage Data</strong>: Information on how you use our website, including your IP address, browser type, pages visited, time spent on pages, and other usage statistics.</li>
            <li><strong>Cookies and Tracking Technologies</strong>: We use cookies and similar tracking technologies to track activity on our website and store certain information.</li>
          </ul>
          
          <h2>Use of Your Information</h2>
          <p>We may use the information we collect about you for various purposes, including:</p>
          <ul>
            <li>Providing, maintaining, and improving our services</li>
            <li>Processing server submissions and displaying server information</li>
            <li>Responding to your inquiries and support requests</li>
            <li>Sending you technical notices, updates, and administrative messages</li>
            <li>Protecting against, identifying, and preventing fraud and other illegal activities</li>
          </ul>
          
          <h2>Disclosure of Your Information</h2>
          <p>We may share information we have collected about you in certain situations, including:</p>
          <ul>
            <li><strong>With Service Providers</strong>: We may share your information with third-party vendors who provide services on our behalf.</li>
            <li><strong>For Legal Compliance</strong>: If required by law or in response to valid requests by public authorities.</li>
            <li><strong>To Protect Our Rights</strong>: We may disclose your information to protect our rights, privacy, safety, or property.</li>
          </ul>
          
          <h2>Security of Your Information</h2>
          <p>
            We use administrative, technical, and physical security measures to protect your personal information. While we have taken reasonable steps to secure the information you provide to us, please be aware that no security measures are perfect, and no method of data transmission can be guaranteed against any interception or other type of misuse.
          </p>
          
          <h2>Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul>
            <li>The right to access and receive a copy of your personal information</li>
            <li>The right to rectify or update your personal information</li>
            <li>The right to delete your personal information</li>
            <li>The right to restrict processing of your personal information</li>
            <li>The right to object to processing of your personal information</li>
            <li>The right to data portability</li>
          </ul>
          
          <h2>Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for users under the age of 13. We do not knowingly collect information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information from our servers.
          </p>
          
          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. You are advised to review this Privacy Policy periodically for any changes.
          </p>
          
          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            By email: <a href="mailto:mcpserverdirectory@gmail.com">mcpserverdirectory@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
} 