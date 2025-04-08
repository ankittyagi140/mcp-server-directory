"use client";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "white" | "green";
  className?: string;
}

export default function LoadingSpinner({
  size = "medium",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) {
  // Size mappings
  const sizeMap = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-2",
    large: "h-12 w-12 border-3",
  };

  // Color mappings
  const colorMap = {
    primary: "border-gray-600 border-t-gray-300",
    secondary: "border-gray-300 border-t-gray-100",
    white: "border-white/70 border-t-white/30",
    green: "border-green-600 border-t-green-200",
  };

  const sizeClass = sizeMap[size];
  const colorClass = colorMap[color];

  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeClass} ${colorClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
} 