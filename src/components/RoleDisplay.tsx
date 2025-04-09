"use client";

import { useAuth } from "@/lib/auth";

export default function RoleDisplay() {
  const { user } = useAuth();
  
  // Only render in development environment
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md text-xs border z-50">
      <h4 className="font-bold mb-1">Auth Debug Info</h4>
      <div>
        <p>
          <span className="opacity-70">User:</span>{" "}
          {user ? user.email : "Not logged in"}
        </p>
        <p>
          <span className="opacity-70">Role:</span>{" "}
          <span className={`font-medium ${user?.role === 'admin' ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}>
            {user?.role || "None"}
          </span>
        </p>
        <p>
          <span className="opacity-70">ID:</span>{" "}
          <span className="font-mono text-[9px] break-all">
            {user?.id || "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
} 