// components/consent/consentUtils.ts
export const CONSENT_KEY = "userConsent";

export function hasConsented(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "true";
}

export function setConsent(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, "true");
}
