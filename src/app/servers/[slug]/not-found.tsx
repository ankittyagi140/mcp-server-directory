import Link from "next/link";

export default function ServerNotFound() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Server Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn&apos;t find the server you&apos;re looking for. It might have been removed or the URL could be incorrect.
        </p>
        <Link
          href="/servers"
          className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-green-700"
        >
          Browse All Servers
        </Link>
      </div>
    </div>
  );
} 