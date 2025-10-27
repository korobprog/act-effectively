const normalize = (url: string) => url.replace(/\/+$/, "");

const resolveApiUrl = (): string => {
  const envValue = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envValue) {
    console.log("[API Config] Using env variable:", envValue);
    return normalize(envValue);
  }

  if (typeof window !== "undefined") {
    const origin = normalize(window.location.origin);
    if (origin.includes("localhost")) {
      console.log("[API Config] Using localhost fallback");
      return "http://localhost:8000/api";
    }

    // In production, if the env var is not set, assume backend is at api subdomain
    if (origin.includes("act-effectively.books-ved.ru")) {
      const apiUrl = "https://api.act-effectively.books-ved.ru/api";
      console.log("[API Config] Using production API URL:", apiUrl);
      return apiUrl;
    }

    const fallbackUrl = `${origin}/api`;
    console.log("[API Config] Using same-origin fallback:", fallbackUrl);
    return fallbackUrl;
  }

  return "http://localhost:8000/api";
};

export const API_URL = resolveApiUrl();

// Log the resolved API URL for debugging
if (typeof window !== "undefined") {
  console.log("[API Config] Resolved API_URL:", API_URL);
}
