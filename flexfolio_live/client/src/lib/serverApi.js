import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Convert Next.js cookies() to proper Cookie header string
 */
const getCookieHeader = async () => {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
};

/**
 * GET Preview Portfolio (Server Component safe)
 */
export const getPreviewPortfolio = async (username) => {
  try {
    const cookieHeader = await getCookieHeader();

    const res = await fetch(
      `${API_URL}/portfolio/preview/${username}`,
      {
        method: "GET",
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      }
    );

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        error: data?.message || "Failed to fetch preview portfolio",
      };
    }

    return {
      success: true,
      portfolio: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};