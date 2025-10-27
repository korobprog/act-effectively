const normalize = (url: string) => url.replace(/\/+$/, "");

const resolveApiUrl = (): string => {
  const envValue = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envValue) {
    return normalize(envValue);
  }

  if (typeof window !== "undefined") {
    const origin = normalize(window.location.origin);
    if (origin.includes("localhost")) {
      return "http://localhost:8000/api";
    }

    return `${origin}/api`;
  }

  return "http://localhost:8000/api";
};

export const API_URL = resolveApiUrl();
