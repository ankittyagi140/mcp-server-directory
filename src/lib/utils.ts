import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a proper image path that works in both development and production
 * @param path The image path relative to the public directory
 * @param addVersion Whether to add a version for cache busting
 * @returns The full image path
 */
export function getImagePath(path: string, addVersion = false): string {
  // If the path is a full URL (external image), return it as is
  if (path.startsWith('http')) {
    return path;
  }
  
  // For local images in the public directory
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Base URL with the normalized path
  const fullPath = `${basePath}${normalizedPath}`;
  
  // Add version for cache busting if needed
  return addVersion ? `${fullPath}?v1.0.1` : fullPath;
} 