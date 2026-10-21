"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { PiPackage, PiSignIn, PiShoppingBag } from "react-icons/pi";

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

  if (!isLoaded || loading) {
    return (
      <div className="py-20 text-center text-neutral-500 font-sans">
        <PiPackage className="text-4xl text-neutral-300 mx-auto mb-3 animate-pulse" />
        <p className="text-sm">Loading your orders...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4 font-sans">
        <PiSignIn className="text-5xl text-neutral-300 mx-auto mb-2" />
        <h1 className="font-serif text-2xl font-bold text-neutral-900">
          Sign in to view orders
        </h1>
        <p className="font-mulish text-neutral-500 text-sm">
          Please sign in to track your Sweet Bites purchases.
        </p>
        <div>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-brand-600 text-white text-xs font-bold uppercase tracking-widest rounded-[4px] hover:bg-brand-700 transition"
          >
            <PiSignIn className="text-sm" />
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-6 font-sans">
      <div className="border-b border-neutral-200 pb-5">
        <h1 className="font-serif text-3xl font-bold text-neutral-900 tracking-tight">
          My Orders
        </h1>
        <p className="font-mulish text-neutral-500 text-sm mt-1">
          Track your past and active Sweet Bites treats.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[4px] border border-neutral-100">
          <PiShoppingBag className="text-5xl text-neutral-200 mx-auto mb-3" />
          <p className="font-mulish text-neutral-500 text-sm">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-[4px] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4 hover:shadow-md transition"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] px-2.5 py-1 rounded-[4px] font-bold uppercase tracking-wider bg-brand-100 text-brand-800">
                    {order.status}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-neutral-700 font-mulish space-y-0.5">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-brand-600 text-xs">•</span>
                      <span>{item.title}</span>
                      <span className="text-neutral-400 text-xs">
                        (x{item.quantity})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right flex flex-col justify-between gap-1">
                <span className="font-radio text-xl font-bold text-neutral-900">
                  ${order.total_price.toFixed(2)}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">
                  WhatsApp Order
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
