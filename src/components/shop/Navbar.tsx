"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useUser, UserButton } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";

import { BiHomeAlt } from "react-icons/bi";
import {
  PiShoppingCartSimpleBold,
  PiList,
  PiPackage,
  PiPlusCircle,
  PiGear,
  PiUser,
  PiX,
} from "react-icons/pi";

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

  // Reusable classes for nav links with icons
  const navLinkClass =
    "flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-widest text-neutral-700 hover:text-brand-600 transition";

  const navLinkActiveClass =
    "flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-widest text-brand-800 bg-brand-100/70 hover:bg-brand-100 px-3.5 py-2 rounded-[4px] border border-brand-200/60 transition";

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-vollkorn font-bold text-xl uppercase tracking-widest text-neutral-900 group-hover:text-brand-600 transition">
              أتاي<span className="text-brand-600">دار</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={navLinkClass}>
              <BiHomeAlt className="text-base" />
              Home
            </Link>
            <Link href="/#gallery" className={navLinkClass}>
              <PiList className="text-base" />
              Menu
            </Link>

            {/* Customer Orders Link */}
            {isSignedIn && !isAdmin && (
              <Link href="/orders" className={navLinkClass}>
                <PiPackage className="text-base" />
                My Orders
              </Link>
            )}

            {/* Admin Links (No duplicates here) */}
            {isAdmin && (
              <>
                <Link
                  href="/dashboard/products/new"
                  className={navLinkActiveClass}
                >
                  <PiPlusCircle className="text-base" />
                  Add Product
                </Link>
                <Link
                  href="/dashboard/cms"
                  className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-widest text-neutral-700 hover:text-brand-600 bg-neutral-100 hover:bg-neutral-200 px-3.5 py-2 rounded-[4px] transition"
                >
                  <PiGear className="text-base" />
                  Store CMS
                </Link>
              </>
            )}
          </nav>

          {/* Action / Auth & Cart Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoaded &&
              (isSignedIn ? (
                <UserButton />
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-1.5 font-sans text-xs font-bold uppercase tracking-widest text-neutral-600 hover:text-brand-600 px-3 py-2 transition"
                >
                  <PiUser className="text-base" />
                  Sign In
                </Link>
              ))}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-brand-100 hover:bg-brand-200 text-brand-900 rounded-[4px] transition flex items-center justify-center cursor-pointer"
              aria-label="Open Cart"
            >
              <PiShoppingCartSimpleBold className="text-xl" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-brand-100 hover:bg-brand-200 text-brand-900 rounded-[4px] transition flex items-center justify-center"
              aria-label="Open Cart"
            >
              <PiShoppingCartSimpleBold className="text-lg" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-[4px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <PiX className="h-6 w-6" />
              ) : (
                <PiList className="h-6 w-6" />
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
            className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-neutral-700 hover:text-brand-600 py-1 transition"
          >
            <BiHomeAlt className="text-lg" />
            Home
          </Link>
          <Link
            href="/#gallery"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-neutral-700 hover:text-brand-600 py-1 transition"
          >
            <PiList className="text-lg" />
            Menu
          </Link>

          {isSignedIn && !isAdmin && (
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-neutral-700 hover:text-brand-600 py-1 transition"
            >
              <PiPackage className="text-lg" />
              My Orders
            </Link>
          )}

          {/* Admin Links (No duplicates here either) */}
          {isAdmin && (
            <>
              <Link
                href="/dashboard/products/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-brand-700 py-1 transition"
              >
                <PiPlusCircle className="text-lg" />
                Add Product
              </Link>
              <Link
                href="/dashboard/cms"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-brand-700 py-1 transition"
              >
                <PiGear className="text-lg" />
                Store CMS
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
                  className="flex items-center gap-2 font-sans text-sm font-bold uppercase tracking-widest text-brand-600 hover:text-brand-700 transition"
                >
                  <PiUser className="text-lg" />
                  Sign In
                </Link>
              ))}
          </div>
        </div>
      )}
    </header>
  );
}
