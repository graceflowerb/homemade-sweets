import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

// Use the Service Role key in middleware to bypass RLS securely on the server
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const session = await auth();

    // If not signed in at all, redirect to sign-in
    if (!session.userId) {
      return session.redirectToSignIn();
    }

    try {
      // Query the profiles table for this specific Clerk User ID
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.userId)
        .single();

      // If there's an error, no profile exists, or role is not admin -> redirect to home
      if (error || !profile || profile.role !== "admin") {
        console.log(
          `Access denied for user ${session.userId}. Role:`,
          profile?.role,
        );
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (err) {
      console.error("Middleware authorization error:", err);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
