// Utility functions that can be used on the client and server side

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function min(...numbers: number[]): number {
  if (numbers.length === 0) {
    return Infinity // Or throw an error, depending on desired behavior
  }

  let minimum = numbers[0]!
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i]! < minimum!) {
      minimum = numbers[i]!
    }
  }
  return minimum
}
