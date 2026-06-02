export type ConsentValue = "accepted" | "declined";

export const CONSENT_STORAGE_KEY = "verdict-cookie-consent";

const LEGACY_CONSENT_STORAGE_KEY = "reviewmax-cookie-consent";

/** Fired on the window whenever the user's analytics consent changes. */
export const CONSENT_CHANGE_EVENT = "analytics-consent-change";

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value =
      window.localStorage.getItem(CONSENT_STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

export function setStoredConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* ignore private mode / quota */
  }
  window.dispatchEvent(
    new CustomEvent<ConsentValue>(CONSENT_CHANGE_EVENT, { detail: value }),
  );
}
