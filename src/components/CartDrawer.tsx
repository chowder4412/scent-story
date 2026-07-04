import { useState } from "react";
import { X, Trash2, Plus, Minus, PhoneCall } from "lucide-react";
import { Perfume } from "../perfumesData.js";
import { motion, AnimatePresence } from "motion/react";
import whatsappLogo from "../assets/images/whatsapp_logo.png";

export interface CartItem {
  perfume: Perfume;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (perfumeId: string, delta: number) => void;
  onRemoveItem: (perfumeId: string) => void;
  onClearCart: () => void;
}

const SHIPPING_RATES = {
  abuja: { label: "Abuja Delivery", fee: 2500 },
  nationwide: { label: "Nationwide Delivery", fee: 4500 }
};

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}: CartDrawerProps) {
  const [shippingLocation, setShippingLocation] = useState<"abuja" | "nationwide">("abuja");

  const subtotal = items.reduce(
    (sum, item) => sum + item.perfume.price * item.quantity,
    0
  );

  const shippingFee = SHIPPING_RATES[shippingLocation].fee;
  const grandTotal = subtotal + shippingFee;

  const formatPrice = (amount: number) => {
    return "₦" + amount.toLocaleString();
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    let messageText = `*DEBS SCENT STORY - NEW ORDER* 🛍️✨\n\n`;
    messageText += `Hello, I'd like to place an order for the following items:\n\n`;

    items.forEach((item, index) => {
      messageText += `${index + 1}. *${item.perfume.name}* (${item.perfume.size})\n`;
      messageText += `   Quantity: ${item.quantity}\n`;
      messageText += `   Price: ${formatPrice(item.perfume.price * item.quantity)}\n\n`;
    });

    messageText += `*Order Subtotal:* ${formatPrice(subtotal)}\n`;
    messageText += `*Shipping Location:* ${SHIPPING_RATES[shippingLocation].label} (${formatPrice(shippingFee)})\n`;
    messageText += `*Grand Total:* ${formatPrice(grandTotal)}\n\n`;
    messageText += `*Customer Details:*\n`;
    messageText += `- Name: \n`;
    messageText += `- Delivery Address: \n`;
    messageText += `- Alternate Phone Number: \n\n`;
    messageText += `Thank you! Smell unforgettable! ✨`;

    const encodedText = encodeURIComponent(messageText);
    // WhatsApp Number from poster: 08176016513. International format is 2348176016513
    const whatsappUrl = `https://wa.me/2348176016513?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCallCheckout = () => {
    // Direct call to 07062143381
    window.location.href = "tel:07062143381";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            id="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Drawer container */}
          <motion.div
            id="cart-drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col h-full border-l border-neutral-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-burgundy-800 text-white">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg tracking-wider font-semibold">Your Scent Bag</span>
                <span className="bg-white text-burgundy-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              </div>
              <button
                id="close-cart-btn"
                onClick={onClose}
                className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 space-y-3">
                  <span className="text-5xl">🛍️</span>
                  <p className="font-serif text-lg text-neutral-600 font-medium">Your Scent Bag is Empty</p>
                  <p className="text-xs max-w-xs">
                    Browse our premium designer perfume oils, rich Arabian ouds, and classic designer perfumes to begin your story.
                  </p>
                  <button
                    id="cart-empty-browse-btn"
                    onClick={onClose}
                    className="mt-2 text-xs font-semibold text-burgundy-800 border-b border-burgundy-800 hover:text-burgundy-600 transition"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.perfume.id}
                    className="flex gap-4 p-3 bg-neutral-50 rounded-xl border border-neutral-100 items-start group relative transition-all hover:bg-neutral-100/50"
                  >
                    <img
                      src={item.perfume.imageUrl}
                      alt={item.perfume.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-lg bg-neutral-200 border border-neutral-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-semibold text-neutral-800 text-sm truncate pr-4">
                          {item.perfume.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.perfume.id)}
                          className="text-neutral-400 hover:text-red-500 transition shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-500 font-medium mt-0.5">
                        {item.perfume.brand} • {item.perfume.size}
                      </p>
                      
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-neutral-200 rounded-lg bg-white overflow-hidden shrink-0">
                          <button
                            onClick={() => onUpdateQuantity(item.perfume.id, -1)}
                            className="p-1 hover:bg-neutral-50 text-neutral-500 transition"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-neutral-700 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.perfume.id, 1)}
                            className="p-1 hover:bg-neutral-50 text-neutral-500 transition"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        <span className="text-sm font-bold text-burgundy-800 font-serif">
                          {formatPrice(item.perfume.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-neutral-100 bg-neutral-50/80 space-y-4">
                
                {/* Shipping Location Estimator */}
                <div className="p-4 bg-white rounded-xl border border-neutral-200/60 space-y-3 shadow-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-neutral-800 uppercase tracking-wider font-mono">
                      🚚 Shipping Location
                    </span>
                    <span className="text-xs font-bold text-burgundy-800 font-mono">
                      {formatPrice(shippingFee)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      id="shipping-abuja-btn"
                      onClick={() => setShippingLocation("abuja")}
                      className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                        shippingLocation === "abuja"
                          ? "border-burgundy-800 bg-burgundy-50/40 text-burgundy-950 font-semibold"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                      }`}
                    >
                      <div className="text-xs font-semibold">Abuja</div>
                      <div className="text-[9px] text-neutral-400 mt-0.5">Rate: ₦2,500</div>
                    </button>
                    <button
                      type="button"
                      id="shipping-nationwide-btn"
                      onClick={() => setShippingLocation("nationwide")}
                      className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                        shippingLocation === "nationwide"
                          ? "border-burgundy-800 bg-burgundy-50/40 text-burgundy-950 font-semibold"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                      }`}
                    >
                      <div className="text-xs font-semibold">Nationwide</div>
                      <div className="text-[9px] text-neutral-400 mt-0.5">Rate: ₦4,500</div>
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Order Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Shipping ({shippingLocation === "abuja" ? "Abuja" : "Nationwide"})</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-neutral-200/60">
                    <span className="text-sm font-semibold text-neutral-800">Grand Total</span>
                    <span className="text-xl font-serif font-bold text-burgundy-800">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
                
                <p className="text-2xs text-neutral-400 leading-relaxed text-center">
                  We process orders via WhatsApp & direct calls to give you personal service and coordinate local shipping in Nigeria seamlessly!
                </p>

                <div className="space-y-2">
                  <button
                    id="cart-checkout-whatsapp-btn"
                    onClick={handleWhatsAppCheckout}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm font-sans"
                  >
                    <img src={whatsappLogo} alt="WhatsApp" className="w-4 h-4 object-contain rounded-xs" />
                    <span>Order via WhatsApp</span>
                  </button>

                  <button
                    id="cart-checkout-call-btn"
                    onClick={handleCallCheckout}
                    className="w-full bg-burgundy-800 hover:bg-burgundy-700 active:bg-burgundy-900 text-white font-medium py-3 px-4 rounded-xl shadow-sm transition flex items-center justify-center gap-2 text-sm font-sans"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Place Order via Call</span>
                  </button>

                  <button
                    id="cart-clear-btn"
                    onClick={onClearCart}
                    className="w-full py-2 text-xs font-medium text-neutral-400 hover:text-red-500 transition text-center"
                  >
                    Clear All Items
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
