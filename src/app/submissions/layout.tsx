import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Submissions | MCP Server Directory",
  description: "Track the status of your MCP server submissions and see which have been approved or are pending review.",
  robots: {
    index: false,
    follow: true
  }
};

export default function SubmissionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 