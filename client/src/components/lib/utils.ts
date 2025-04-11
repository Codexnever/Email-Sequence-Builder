import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Converts a string to a slug by replacing spaces with hyphens and removing special characters.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}