import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseEnv } from "@/lib/supabase/env";

export async function middleware(request: NextRequest) {
  const { url, anon } = supabaseEnv();

  // If Supabase isn't configured (e.g., CI), just pass through.
  if (!url || !anon) return NextResponse.next();

  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Refresh Supabase auth cookies if needed
  createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  return response;
}

export const config = {
  // Only run where we actually need auth/session refresh.
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

