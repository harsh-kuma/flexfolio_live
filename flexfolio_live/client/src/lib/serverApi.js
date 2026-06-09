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
    console.log("11111111111111");
    const cookieHeader = await getCookieHeader();
    console.log("22222222",cookieHeader);
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
    console.log("33333333",res);
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
    console.log("444444",error.message);
    return {
      success: false,
      error: error.message,
    };
  }
};