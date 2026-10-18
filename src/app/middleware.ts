import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Define protected dashboard routes
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Initialize a lightweight Supabase client for middleware
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 1. Ensure user is authenticated via Clerk
    const session = await auth();
    if (!session.userId) {
      return session.redirectToSignIn();
    }

    try {
      // 2. Query Supabase profiles table using the Clerk User ID
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.userId)
        .single();

      // 3. If no profile found or user is not an admin, redirect to home
      if (error || !profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.error("Error verifying admin role in middleware:", err);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
