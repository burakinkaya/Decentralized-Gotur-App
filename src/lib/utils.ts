import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string, startingChars = 6, endingChars = 4) {
  return `${address.slice(0, startingChars)}...${address.slice(-endingChars)}`;
}
