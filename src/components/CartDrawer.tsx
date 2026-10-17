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
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <h2 className="text-lg font-bold text-neutral-900">
              Your Sweet Bag 🛍️
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-neutral-400 hover:text-neutral-600 text-xl font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-neutral-400">
                <p className="text-4xl mb-2">🧁</p>
                <p>Your cart is empty.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center bg-neutral-50 p-3 rounded-xl border border-neutral-100"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg bg-neutral-200"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-neutral-900">
                      {item.title}
                    </h4>
                    <p className="text-xs text-amber-700 font-medium">
                      ${item.price.toFixed(2)} / {item.unit_type}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity -
                              (item.unit_type === "grams" ? 50 : 1),
                          )
                        }
                        className="w-6 h-6 bg-white border rounded text-xs font-bold hover:bg-neutral-100 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold">
                        {item.quantity} {item.unit_type}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity +
                              (item.unit_type === "grams" ? 50 : 1),
                          )
                        }
                        className="w-6 h-6 bg-white border rounded text-xs font-bold hover:bg-neutral-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-neutral-400 hover:text-red-500 text-xs px-2 py-1 cursor-pointer"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout Details & Button */}
          {cart.length > 0 && (
            <div className="border-t border-neutral-100 p-6 bg-neutral-50 space-y-4">
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Delivery Address / Area"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
                <input
                  type="text"
                  placeholder="Special instructions (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-between items-center pt-2 font-bold text-neutral-900">
                <span>Total:</span>
                <span className="text-xl text-amber-700">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>💬 Order via WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
