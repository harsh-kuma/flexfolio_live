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
  const debug = {
    timestamp: new Date().toISOString(),
    username,
    apiUrl: API_URL,
  };

  try {
    const cookieHeader = await getCookieHeader();

    debug.cookieHeader = cookieHeader;
    debug.cookieLength = cookieHeader?.length || 0;

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

    debug.status = res.status;
    debug.statusText = res.statusText;
    debug.ok = res.ok;
    debug.url = res.url;

    const responseText = await res.text();

    debug.responseBody = responseText;

    try {
      debug.responseJson = JSON.parse(responseText);
    } catch {
      debug.responseJson = null;
    }

    console.log(
      "========== PREVIEW DEBUG ==========",
      JSON.stringify(debug, null, 2)
    );

    if (!res.ok) {
      return {
        success: false,
        error:
          debug.responseJson?.message ||
          responseText ||
          "Failed to fetch preview portfolio",
      };
    }

    return {
      success: true,
      portfolio: debug.responseJson,
    };
  } catch (error) {
    debug.error = {
      message: error.message,
      stack: error.stack,
      name: error.name,
    };

    console.log(
      "========== PREVIEW ERROR ==========",
      JSON.stringify(debug, null, 2)
    );

    return {
      success: false,
      error: error.message,
    };
  }
};