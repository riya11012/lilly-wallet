// lib/utils.ts
import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Conditionally joins class names, with Tailwind merge support.
 * Works perfectly with Tailwind CSS + clsx.
 * 
 * Usage:
 * cn('p-4', isPrimary && 'bg-blue-500', 'rounded')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}
