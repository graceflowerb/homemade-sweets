"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { PiMinus, PiPlus, PiShoppingCart } from "react-icons/pi";

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
    <div className="flex-shrink-0 bg-white rounded-[4px] shadow-sm border border-neutral-100 overflow-hidden snap-start flex flex-col justify-between group hover:shadow-md transition w-full">
      {/* Compact Image Area */}
      <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
        {product.image_url && product.image_url.startsWith("http") ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400 text-xs font-medium bg-neutral-50">
            No Image
          </div>
        )}
      </div>

      {/* Compact Content Area */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-serif font-semibold text-base text-neutral-900 mb-1 leading-tight line-clamp-1">
          {product.title}
        </h3>

        {/* Description */}
        <p className="font-mulish text-neutral-500 text-xs line-clamp-2 mb-3 flex-grow leading-relaxed">
          {product.description}
        </p>

        {/* Pricing & Unit Info */}
        <div className="flex items-center justify-between mb-3 pt-2 border-t border-neutral-100">
          <div className="flex items-baseline gap-1">
            <span className="font-radio text-base font-bold text-brand-700">
              DHS {product.price.toFixed(2)}
            </span>
            <span className="font-mulish text-[10px] text-neutral-400 font-medium">
              / {unitType}
            </span>
          </div>
          <span className="font-mulish text-[10px] bg-brand-50 text-brand-700 font-semibold px-2 py-0.5 rounded-[4px]">
            Min: {minQty}
          </span>
        </div>

        {/* Interactive Quantity Selector & Add to Cart Button */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between bg-neutral-50 p-1 rounded-[4px] border border-neutral-200">
            <button
              onClick={handleDecrement}
              className="w-7 h-7 flex items-center justify-center bg-white border border-neutral-200 rounded-[3px] text-neutral-700 hover:bg-brand-50 hover:border-brand-100 hover:text-brand-700 transition cursor-pointer"
              aria-label="Decrease quantity"
            >
              <PiMinus className="text-sm" />
            </button>

            <span className="font-sans text-xs font-bold text-neutral-800 w-8 text-center">
              {qty}
            </span>

            <button
              onClick={handleIncrement}
              className="w-7 h-7 flex items-center justify-center bg-white border border-neutral-200 rounded-[3px] text-neutral-700 hover:bg-brand-50 hover:border-brand-100 hover:text-brand-700 transition cursor-pointer"
              aria-label="Increase quantity"
            >
              <PiPlus className="text-sm" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            className="font-sans w-full py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold uppercase tracking-widest rounded-[4px] transition shadow-xs active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <PiShoppingCart className="text-sm" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
