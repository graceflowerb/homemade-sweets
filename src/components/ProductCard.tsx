"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const minQty = product.min_qty || 1;
  const stepQty = product.step_qty || 1;
  const unitType = product.unit_type || "pcs";

  const [qty, setQty] = useState(minQty);

  const handleIncrement = () => {
    setQty((prev: number) => prev + stepQty);
  };

  const handleDecrement = () => {
    setQty((prev: number) =>
      prev - stepQty >= minQty ? prev - stepQty : minQty,
    );
  };

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  return (
    <div className="flex-shrink-0 bg-white rounded-[3px] shadow-sm border border-neutral-100 overflow-hidden snap-start flex flex-col justify-between group hover:shadow-md transition w-full">
      <div className="relative h-64 w-full bg-neutral-100 overflow-hidden">
        {product.image_url && product.image_url.startsWith("http") ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400 text-sm bg-neutral-50">
            No Image Available
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        {/* Title - Using Source Serif 4 for elegance */}
        <h3 className="font-serif font-semibold text-lg text-neutral-900 mb-1 leading-tight">
          {product.title}
        </h3>

        {/* Description - Using Mulish for clean readability */}
        <p className="font-mulish text-neutral-500 text-sm line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>

        {/* Pricing & Unit Info */}
        <div className="flex items-center justify-between mb-4 pt-3 border-t border-neutral-100">
          <div>
            {/* Price - Using Radio Canada for distinctive pricing */}
            <span className="font-radio text-lg font-bold text-brand-700">
              ${product.price.toFixed(2)}
            </span>
            <span className="font-mulish text-xs text-neutral-400 ml-1">
              / {unitType}
            </span>
          </div>
          {/* Min badge - Using Mulish */}
          <span className="font-mulish text-xs bg-brand-50 text-brand-700 font-medium px-2.5 py-1 rounded-[4px]">
            Min: {minQty} {unitType}
          </span>
        </div>

        {/* Interactive Quantity Selector & Add to Cart Button */}
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-neutral-50 p-1.5 rounded-[4px] border border-neutral-200">
            <button
              onClick={handleDecrement}
              className="w-8 h-8 rounded-[4px] bg-white border border-neutral-200 text-neutral-700 font-bold hover:bg-brand-50 hover:border-brand-200 transition flex items-center justify-center text-sm"
            >
              -
            </button>
            {/* Quantity display - Using DM Sans (default) */}
            <span className="font-sans text-sm font-semibold text-neutral-800">
              {qty} {unitType}
            </span>
            <button
              onClick={handleIncrement}
              className="w-8 h-8 rounded-[4px] bg-white border border-neutral-200 text-neutral-700 font-bold hover:bg-brand-50 hover:border-brand-200 transition flex items-center justify-center text-sm"
            >
              +
            </button>
          </div>

          {/* Add to Cart button - Using DM Sans (default) */}
          <button
            onClick={handleAddToCart}
            className="font-sans w-full py-2.5 tracking-[0.06em] bg-brand-600 hover:bg-brand-700 text-white uppercase font-semibold text-sm rounded-[4px] transition shadow-xs active:scale-[0.98]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
