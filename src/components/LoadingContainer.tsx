"use client";

import LoadingSpinner from "./LoadingSpinner";

interface LoadingContainerProps {
  isLoading: boolean;
  children: React.ReactNode;
  height?: string;
  spinnerSize?: "small" | "medium" | "large";
  spinnerColor?: "primary" | "secondary" | "white" | "green";
  className?: string;
}

export default function LoadingContainer({
  isLoading,
  children,
  height = "min-h-[200px]",
  spinnerSize = "medium",
  spinnerColor = "green",
  className = "",
}: LoadingContainerProps) {
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${height} ${className}`}>
        <LoadingSpinner size={spinnerSize} color={spinnerColor} />
      </div>
    );
  }

  return <>{children}</>;
} 