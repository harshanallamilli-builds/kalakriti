/**
 * Shared validation helpers used across Server Actions.
 * Keep validation logic here to avoid duplication.
 */

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function isValidWhatsApp(number: string): boolean {
  // Expect country code + number, digits only, 10–15 chars
  return /^\d{10,15}$/.test(number.replace(/[\s\-+]/g, ""));
}

export function isValidPrice(value: unknown): boolean {
  const n = Number(value);
  return !isNaN(n) && n > 0;
}

export function sanitizeText(value: unknown): string {
  return String(value ?? "").trim();
}
