"use client";

import { useState, useEffect, use, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

function EditProductForm({ productId }: { productId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unitType, setUnitType] = useState("pcs");
  const [minQty, setMinQty] = useState("1");
  const [stepQty, setStepQty] = useState("1");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        alert("Error loading product: " + error.message);
        router.push("/dashboard/products");
      } else if (data) {
        setTitle(data.title);
        setDescription(data.description || "");
        setPrice(data.price.toString());
        setUnitType(data.unit_type || "pcs");
        setMinQty(data.min_qty?.toString() || "1");
        setStepQty(data.step_qty?.toString() || "1");
        setExistingImageUrl(data.image_url || "");
      }
      setFetching(false);
    }

    loadProduct();
  }, [productId, router, supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = existingImageUrl;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);

        image_url = publicUrlData.publicUrl;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      const { error: updateError } = await supabase
        .from("products")
        .update({
          title,
          slug,
          description,
          price: parseFloat(price),
          unit_type: unitType,
          min_qty: parseFloat(minQty) || 1,
          step_qty: parseFloat(stepQty) || 1,
          image_url,
        })
        .eq("id", productId);

      if (updateError) throw updateError;

      alert("Product updated successfully!");
      router.push("/dashboard/products");
    } catch (error: any) {
      alert("Error updating product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="py-20 text-center font-sans text-neutral-500">
        Loading product details...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-12 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-neutral-900 tracking-tight">
        Edit Treat
      </h1>
      <form
        onSubmit={handleUpdate}
        className="space-y-6 bg-white p-8 rounded-[0.04rem] shadow-sm border border-neutral-100"
      >
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-[0.04rem] outline-none focus:border-brand-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 border border-neutral-200 rounded-[0.04rem] outline-none focus:border-brand-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Sold By Unit
            </label>
            <select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-[0.04rem] outline-none bg-white"
            >
              <option value="pcs">Pieces (pcs)</option>
              <option value="grams">Grams (g)</option>
              <option value="kg">Kilograms (kg)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-[0.04rem] outline-none focus:border-brand-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Min Order Quantity
            </label>
            <input
              type="number"
              step="any"
              value={minQty}
              onChange={(e) => setMinQty(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-[0.04rem] outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Step Increment
            </label>
            <input
              type="number"
              step="any"
              value={stepQty}
              onChange={(e) => setStepQty(e.target.value)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-[0.04rem] outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Current Image
          </label>
          {existingImageUrl && (
            <img
              src={existingImageUrl}
              alt="Current"
              className="w-20 h-20 object-cover mb-3 rounded-[0.04rem] border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-neutral-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-widest rounded-[0.04rem] transition shadow-md disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Update Treat"}
        </button>
      </form>
    </div>
  );
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-neutral-500">
          Loading editor...
        </div>
      }
    >
      <EditProductForm productId={resolvedParams.id} />
    </Suspense>
  );
}
