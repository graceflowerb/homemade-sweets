"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cart, setIsCartOpen } = useCart();
  const { isSignedIn, isLoaded } = useUser();
  const itemCount = cart.reduce((sum, item) => sum + 1, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-amber-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">🧁</span>
            <span className="font-extrabold text-xl tracking-tight text-neutral-900 group-hover:text-amber-600 transition">
              S<span className="text-amber-600">Bites</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-neutral-700 hover:text-amber-600 transition"
            >
              Home
            </Link>
            <Link
              href="/#gallery"
              className="text-sm font-medium text-neutral-700 hover:text-amber-600 transition"
            >
              Menu
            </Link>

            {/* Conditionally show Admin links only when signed in */}
            {isSignedIn && (
              <>
                <Link
                  href="/dashboard/products/new"
                  className="text-sm font-medium text-amber-800 bg-amber-100/70 hover:bg-amber-100 px-3.5 py-1.5 rounded-lg border border-amber-200/60 transition"
                >
                  + Add Product
                </Link>
                <Link
                  href="/dashboard/cms"
                  className="text-sm font-medium text-neutral-700 hover:text-amber-600 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-1.5 rounded-lg transition"
                >
                  ⚙️ Store CMS
                </Link>
              </>
            )}
          </nav>

          {/* Action / Auth & Cart Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn && (
              <Link
                href="/dashboard/cms"
                className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition"
              >
                Admin CMS
              </Link>
            )}

            {/* Authentication state via useUser hook */}
            {isLoaded &&
              (isSignedIn ? (
                <UserButton />
              ) : (
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-neutral-600 hover:text-amber-600 px-3 py-2 transition"
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
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu & Cart Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition flex items-center justify-center"
              aria-label="Open Cart"
            >
              <span className="text-base">🛒</span>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
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
        <div className="md:hidden border-t border-neutral-100 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-neutral-700 hover:text-amber-600 py-1"
          >
            Home
          </Link>
          <Link
            href="/#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-neutral-700 hover:text-amber-600 py-1"
          >
            Menu
          </Link>

          {isSignedIn && (
            <>
              <Link
                href="/dashboard/products/new"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-amber-700 font-semibold py-1"
              >
                + Add Product (Admin)
              </Link>
              <Link
                href="/dashboard/cms"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-amber-700 font-semibold py-1"
              >
                ⚙️ Store CMS (Hero & Promos)
              </Link>
            </>
          )}

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            {isLoaded &&
              (isSignedIn ? (
                <div className="flex items-center gap-2">
                  <UserButton />
                  <span className="text-sm text-neutral-600">Account</span>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-amber-600 hover:text-amber-700"
                >
                  Admin Sign In &rarr;
                </Link>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
