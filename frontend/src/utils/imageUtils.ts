import api from "../services/api";

/**
 * Resolves an image URL to a full absolute URL.
 * Handles:
 * 1. Relative paths (starts with /) -> prepends API base URL
 * 2. Legacy localhost URLs -> replaces with current API base URL
 * 3. External URLs -> returns as is
 */
export const getImageUrl = (url: string): string => {
  if (!url) return "";

  // Handle relative paths
  if (url.startsWith("/")) {
    const baseUrl = api.defaults.baseURL || "";
    // Remove trailing slash from base if present and leading slash from url
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}${url}`;
  }

  // Handle legacy localhost URLs
  if (url.includes("localhost:3000")) {
    const baseUrl = api.defaults.baseURL || "";
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    // Replace http://localhost:3000 or https://localhost:3000
    return url.replace(/https?:\/\/localhost:3000/, cleanBase);
  }

  return url;
};
