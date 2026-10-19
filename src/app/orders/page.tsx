import { Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// Dynamic sub-component performing the Clerk auth check and Supabase query
async function OrdersContent() {
  let userId: string | null = null;

  try {
    const session = await auth();
    userId = session?.userId || null;
  } catch (err) {
    console.error("Clerk auth error on /orders:", err);
  }

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders from Supabase:", error.message);
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-[0.04rem] border border-neutral-100">
        <p className="text-neutral-500 font-mulish">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white p-6 rounded-[0.04rem] border border-neutral-100 shadow-sm flex flex-col md:flex-row justify-between gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs px-2.5 py-1 rounded-[0.04rem] font-semibold bg-amber-100 text-amber-800">
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
  );
}

export default function UserOrdersPage() {
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

      <Suspense
        fallback={
          <div className="py-16 text-center text-neutral-400 font-mulish">
            Loading your order history...
          </div>
        }
      >
        <OrdersContent />
      </Suspense>
    </div>
  );
}
