"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching products:", error.message);
    else setProducts(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string, imageUrl: string) {
    if (!confirm("Are you sure you want to delete this treat?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      alert("Error deleting product: " + error.message);
    } else {
      setProducts(products.filter((p) => p.id !== id));
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center font-sans text-neutral-500">
        Loading catalog...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 font-sans space-y-8">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">
            Manage Sweet Treats
          </h1>
          <p className="text-sm text-neutral-500 font-mulish mt-1">
            Add, update, or remove catalog items.
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="px-5 py-2.5 bg-brand-600 text-white text-xs font-bold uppercase tracking-widest rounded-[0.04rem] hover:bg-brand-700 transition"
        >
          + Add New Treat
        </Link>
      </div>

      <div className="bg-white rounded-[0.04rem] border border-neutral-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-neutral-100">
          {products.length === 0 ? (
            <div className="p-12 text-center text-neutral-500 font-mulish">
              No treats found in store.
            </div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image_url || "/placeholder.jpg"}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded-[0.04rem] border bg-neutral-100"
                  />
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {product.title}
                    </h3>
                    <p className="text-xs text-brand-700 font-bold mt-0.5">
                      ${product.price.toFixed(2)} / {product.unit_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/products/${product.id}/edit`}
                    className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-[0.04rem] hover:bg-neutral-200 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.image_url)}
                    className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-[0.04rem] hover:bg-red-100 transition cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
