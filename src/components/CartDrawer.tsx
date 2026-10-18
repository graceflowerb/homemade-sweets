"use client";

import { useCart } from "@/context/CartContext";
import { useState } from "react";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [notes, setNotes] = useState("");

  if (!isCartOpen) return null;

  const handleWhatsAppCheckout = () => {
    if (cart.length === 0) return;

    // Replace with your actual WhatsApp business number (with country code, no + or spaces)
    const phoneNumber = "1234567890";

    let message = `🛒 *New Order from Sweet Bites*%0A`;
    if (customerName) message += `👤 *Name:* ${customerName}%0A`;
    if (deliveryAddress) message += `📍 *Address:* ${deliveryAddress}%0A`;
    if (notes) message += `📝 *Notes:* ${notes}%0A`;
    message += `%0A--- ORDER SUMMARY ---%0A`;

    cart.forEach((item, index) => {
      message += `${index + 1}. *${item.title}* - ${item.quantity} ${
        item.unit_type
      } ($${(item.price * item.quantity).toFixed(2)})%0A`;
    });

    message += `-----------------------%0A`;
    message += `💰 *Total: $${totalPrice.toFixed(2)}*%0A`;
    message += `Please confirm my order! ✨`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 bg-white">
            {/* Elegant serif font for the drawer title */}
            <h2 className="font-vollkorn font-bold text-xl uppercase tracking-widest text-neutral-900">
              Your Sweet Bag 🛍️
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-neutral-400 hover:text-neutral-600 text-2xl font-light p-1 cursor-pointer transition"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🧁</p>
                <p className="font-mulish text-neutral-500 text-lg">
                  Your cart is empty.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="font-sans mt-4 text-xs font-bold uppercase tracking-widest text-amber-600 hover:text-amber-700 transition"
                >
                  Continue Shopping &rarr;
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-start bg-neutral-50 p-3 rounded-xl border border-neutral-100"
                >
                  <img
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg bg-neutral-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    {/* Mulish for clean, readable item titles */}
                    <h4 className="font-mulish font-semibold text-sm text-neutral-900 truncate">
                      {item.title}
                    </h4>
                    {/* Radio Canada for distinctive pricing */}
                    <p className="font-radio text-xs text-amber-700 font-bold mt-0.5">
                      ${item.price.toFixed(2)} / {item.unit_type}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg p-0.5">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity -
                                (item.unit_type === "grams" ? 50 : 1),
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white border border-neutral-200 rounded-md text-neutral-700 font-bold hover:bg-amber-50 hover:border-amber-200 transition text-sm cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-sans text-xs font-bold text-neutral-800 w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity +
                                (item.unit_type === "grams" ? 50 : 1),
                            )
                          }
                          className="w-7 h-7 flex items-center justify-center bg-white border border-neutral-200 rounded-md text-neutral-700 font-bold hover:bg-amber-50 hover:border-amber-200 transition text-sm cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 text-xs px-2 py-1 transition cursor-pointer"
                        aria-label="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Details & Button */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-100 p-6 bg-neutral-50 space-y-4">
              <div className="space-y-3">
                {/* DM Sans for clean, trustworthy form inputs */}
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="font-sans w-full px-4 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition placeholder:text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Delivery Address / Area"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="font-sans w-full px-4 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition placeholder:text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Special instructions (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="font-sans w-full px-4 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition placeholder:text-neutral-400"
                />
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
                <span className="font-sans text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Total Amount
                </span>
                <span className="font-radio text-2xl font-bold text-amber-700">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                className="font-sans w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span className="text-base">💬</span>
                <span>Order via WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
