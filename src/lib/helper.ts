import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split("@");

  // Mask part of the local part and the domain
  const maskedLocalPart = localPart.slice(0, 3) + "******";
  const maskedDomain = "***." + domain?.split(".")[1];

  return `${maskedLocalPart}@${maskedDomain}`;
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};
