"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unitType, setUnitType] = useState("pcs");
  const [minQty, setMinQty] = useState("1");
  const [stepQty, setStepQty] = useState("1");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = "";

      // 1. Upload image to Supabase Storage if file exists
      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        image_url = publicUrlData.publicUrl;
      }

      // 2. Generate slug from title
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

      // 3. Insert into products table with unit specifications
      const { error: insertError } = await supabase.from("products").insert([
        {
          title,
          slug,
          description,
          price: parseFloat(price),
          unit_type: unitType,
          min_qty: parseFloat(minQty) || 1,
          step_qty: parseFloat(stepQty) || 1,
          image_url,
          is_available: true,
        },
      ]);

      if (insertError) throw insertError;

      alert("Sweet treat added successfully!");
      router.push("/");
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-neutral-800">
        Add New Homemade Treat
      </h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100"
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
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="e.g. Belgian Chocolate Brownie"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="Describe ingredients, taste, and texture..."
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="12.99"
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="e.g. 250 for 250g"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Minimum allowed order
            </p>
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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="e.g. 50g steps"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Quantity increase step
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition shadow-md disabled:opacity-50"
        >
          {loading ? "Publishing..." : "Add Treat to Store"}
        </button>
      </form>
    </div>
  );
}
