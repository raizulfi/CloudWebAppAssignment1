/**
 * Utility functions for managing user sessions and local storage
 */

export const USER_ID_KEY = "userId";
export const USER_TAG_KEY = "userTag";

/**
 * Get current user ID from localStorage
 */
export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

/**
 * Get current user tag from localStorage
 */
export function getUserTag(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_TAG_KEY);
}

/**
 * Set user credentials in localStorage
 */
export function setUserCredentials(userId: string, userTag: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_ID_KEY, userId);
  localStorage.setItem(USER_TAG_KEY, userTag);
}

/**
 * Clear user credentials from localStorage (logout)
 */
export function clearUserCredentials() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_TAG_KEY);
}

/**
 * Check if user is logged in
 */
export function isUserLoggedIn(): boolean {
  return getUserId() !== null && getUserTag() !== null;
}
