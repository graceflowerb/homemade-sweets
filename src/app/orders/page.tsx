"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

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
        Loading your orders...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4 font-sans">
        <h1 className="text-2xl font-bold text-neutral-900">
          Sign in to view orders
        </h1>
        <p className="text-neutral-500 font-mulish">
          Please sign in to track your Sweet Bites purchases.
        </p>
        <div>
          <Link
            href="/sign-in"
            className="inline-block px-6 py-2.5 bg-brand-600 text-white text-xs font-bold uppercase tracking-widest rounded-[0.04rem] hover:bg-brand-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8 font-sans">
      <div className="border-b border-neutral-200 pb-6">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          My Orders
        </h1>
        <p className="text-neutral-500 mt-1 font-mulish">
          Track your past and active Sweet Bites treats.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[0.04rem] border border-neutral-100">
          <p className="text-neutral-500 font-mulish">
            You haven't placed any orders yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-[0.04rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2.5 py-1 rounded-[0.04rem] font-semibold bg-brand- 100 text-brand- 800">
                    Status: {order.status}
                  </span>
                  <span className="text-xs text-neutral-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-neutral-700 font-mulish">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx}>
                      • {item.title} (x{item.quantity})
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right flex flex-col justify-between">
                <span className="text-lg font-extrabold text-neutral-900">
                  ${order.total_price.toFixed(2)}
                </span>
                <span className="text-xs text-neutral-500 font-mulish">
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
