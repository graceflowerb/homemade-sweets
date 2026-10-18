"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser, UserButton } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { user, isSignedIn, isLoaded } = useUser();
  const itemCount = cart.reduce((sum, item) => sum + 1, 0);

  useEffect(() => {
    async function checkAdminRole() {
      if (isSignedIn && user?.id) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (data && data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          const userEmail = user.primaryEmailAddress?.emailAddress;
          if (userEmail && !data) {
            await supabase
              .from("profiles")
              .upsert(
                { id: user.id, email: userEmail, role: "customer" },
                { onConflict: "id" },
              );
          }
        }
      } else {
        setIsAdmin(false);
      }
    }

    if (isLoaded) {
      checkAdminRole();
    }
  }, [isSignedIn, isLoaded, user]);

  // Reusable class for uppercase nav links
  const navLinkClass =
    "font-sans text-xs font-bold uppercase tracking-widest text-neutral-700 hover:text-amber-600 transition";
  const navLinkActiveClass =
    "font-sans text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100/70 hover:bg-amber-100 px-3.5 py-2 rounded-lg border border-amber-200/60 transition";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-amber-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🧁</span>
            {/* Changed to uppercase with wide tracking for a premium bakery feel */}
            <span className="font-vollkorn font-bold text-xl uppercase tracking-widest text-neutral-900 group-hover:text-amber-600 transition">
              SWEET<span className="text-amber-600">BITES</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={navLinkClass}>
              Home
            </Link>
            <Link href="/#gallery" className={navLinkClass}>
              Menu
            </Link>

            {/* Admin Links */}
            {isAdmin && (
              <>
                <Link
                  href="/dashboard/products/new"
                  className={navLinkActiveClass}
                >
                  + Add Product
                </Link>
                <Link
                  href="/dashboard/cms"
                  className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-700 hover:text-amber-600 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-lg transition"
                >
                  ⚙️ Store CMS
                </Link>
              </>
            )}
          </nav>

          {/* Action / Auth & Cart Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/dashboard/cms"
                className="font-sans px-4 py-2 text-xs font-bold uppercase tracking-widest text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition"
              >
                Admin CMS
              </Link>
            )}

            {isLoaded &&
              (isSignedIn ? (
                <UserButton />
              ) : (
                <Link
                  href="/sign-in"
                  className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-amber-600 px-3 py-2 transition"
                >
                  Sign In
                </Link>
              ))}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl transition flex items-center justify-center cursor-pointer"
              aria-label="Open Cart"
            >
              <span className="text-lg">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition flex items-center justify-center"
              aria-label="Open Cart"
            >
              <span className="text-base">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 pt-4 pb-6 space-y-4 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-sans text-sm font-bold uppercase tracking-widest text-neutral-700 hover:text-amber-600 py-1"
          >
            Home
          </Link>
          <Link
            href="/#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block font-sans text-sm font-bold uppercase tracking-widest text-neutral-700 hover:text-amber-600 py-1"
          >
            Menu
          </Link>

          {isAdmin && (
            <>
              <Link
                href="/dashboard/products/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-sans text-sm font-bold uppercase tracking-widest text-amber-700 py-1"
              >
                + Add Product
              </Link>
              <Link
                href="/dashboard/cms"
                onClick={() => setMobileMenuOpen(false)}
                className="block font-sans text-sm font-bold uppercase tracking-widest text-amber-700 py-1"
              >
                ⚙️ Store CMS
              </Link>
            </>
          )}

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            {isLoaded &&
              (isSignedIn ? (
                <div className="flex items-center gap-3">
                  <UserButton />
                  <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-600">
                    Account
                  </span>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-sm font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700"
                >
                  Sign In &rarr;
                </Link>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
