"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  PiShoppingBag,
  PiPackage,
  PiArrowRight,
  PiClock,
} from "react-icons/pi";

export default function UserOrdersPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchUserOrders() {
      if (!isLoaded) return;

      if (!isSignedIn || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching orders:", error.message);
        } else if (data) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserOrders();
  }, [isLoaded, isSignedIn, user]);

  // Loading state
  if (!isLoaded || loading) {
    return (
      <div className="py-24 text-center font-sans">
        <PiPackage className="text-4xl text-neutral-300 mx-auto mb-4 animate-pulse" />
        <p className="font-mulish text-sm text-neutral-400">
          Loading your orders...
        </p>
      </div>
    );
  }

  // Signed-out state
  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center font-sans">
        <div className="bg-white border border-neutral-100 rounded-[4px] p-10 shadow-sm space-y-4">
          <PiShoppingBag className="text-5xl text-brand-600/60 mx-auto" />

          <h1 className="font-vollkorn text-2xl font-bold text-neutral-900">
            Sign in to view orders
          </h1>

          <p className="font-mulish text-sm text-neutral-500 leading-relaxed">
            Please sign in to track your Sweet Bites purchases.
          </p>

          <div className="pt-2">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-widest rounded-[4px] transition active:scale-[0.98]"
            >
              Sign In
              <PiArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 font-sans">
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="font-vollkorn text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight">
          My Orders
        </h1>
        <p className="font-mulish text-sm text-neutral-500 mt-2 leading-relaxed">
          Track your past and active Sweet Bites treats.
        </p>
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[4px] border border-neutral-100">
          <PiPackage className="text-5xl text-neutral-200 mx-auto mb-4" />
          <p className="font-mulish text-sm text-neutral-500">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        /* Orders list */
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 md:p-6 rounded-[4px] border border-neutral-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row justify-between gap-5"
            >
              {/* Order details */}
              <div className="space-y-3 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-[4px] font-sans font-bold uppercase tracking-widest bg-brand-50 text-brand-700 border border-brand-100">
                    <PiClock className="text-xs" />
                    {order.status}
                  </span>

                  <span className="font-mulish text-xs text-neutral-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-1 font-mulish text-xs text-neutral-600">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-baseline gap-2">
                      <span className="text-neutral-300">•</span>
                      <span className="truncate">{item.title}</span>
                      <span className="text-neutral-400 shrink-0">
                        (x{item.quantity})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex md:flex-col items-center justify-between md:items-end md:justify-between gap-2 shrink-0">
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Order Total
                </span>

                <div className="flex md:flex-col items-center md:items-end gap-1.5">
                  <span className="font-radio text-xl font-bold text-brand-700">
                    DHS {order.total_price.toFixed(2)}
                  </span>

                  <span className="font-mulish text-xs text-neutral-400">
                    WhatsApp Order
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
