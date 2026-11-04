import React from 'react';
import { CartItem } from '../../types/ecommerce';
import { formatBDT } from '../../services/storageService';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  freeDeliveryThreshold?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  freeDeliveryThreshold = 2500,
}) => {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-gray-900 text-base sm:text-lg">
                আপনার শপিং কার্ট
              </h3>
              <p className="text-xs text-gray-500">
                {totalItems} টি পণ্য যোগ করা আছে
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-white transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100 text-xs">
          {amountNeededForFreeDelivery > 0 ? (
            <p className="text-emerald-900 font-medium flex items-center gap-1.5 mb-1.5">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                আর মাত্র <strong>{formatBDT(amountNeededForFreeDelivery)}</strong> টাকার কেনাকাটায় ডেলিভারি সম্পূর্ণ ফ্রি!
              </span>
            </p>
          ) : (
            <p className="text-emerald-900 font-bold flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>অভিনন্দন! আপনার জন্য ডেলিভারি সম্পূর্ণ ফ্রি 🎉</span>
            </p>
          )}

          <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeDeliveryProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-gray-100">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 opacity-60" />
              </div>
              <h4 className="text-base font-bold text-gray-800">
                আপনার কার্ট এখনো খালি!
              </h4>
              <p className="text-xs text-gray-500 max-w-xs">
                আমাদের আকর্ষণীয় কালেকশন থেকে আপনার পছন্দের পণ্যগুলো কার্টে যোগ করুন।
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product.id} className="py-3.5 flex gap-3 items-center group">
                <img
                  src={item.product.image}
                  alt={item.product.nameBn}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-900 truncate">
                    {item.product.nameBn}
                  </h4>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5">
                    {formatBDT(item.product.price)}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-white text-gray-600 rounded-l cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-bold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-white text-gray-600 rounded-r cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs text-gray-400">
                      মোট: {formatBDT(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/80 space-y-3">
            <div className="space-y-1.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>পণ্য উপ-মোট:</span>
                <span className="font-bold text-gray-900">{formatBDT(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>ডেলিভারি চার্জ:</span>
                <span>চেকআউটে এলাকা নির্বাচন অনুযায়ী নির্ধারিত হবে</span>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 flex justify-between items-baseline">
              <div>
                <span className="text-xs text-gray-500 block">মোট বিল (আনুমানিক)</span>
                <span className="text-lg font-black text-emerald-800">{formatBDT(subtotal)}</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                ক্যাশ অন ডেলিভারি
              </span>
            </div>

            <button
              onClick={() => {
                onProceedToCheckout();
                onClose();
              }}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>অর্ডার সম্পন্ন করতে এগিয়ে যান</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
              <span>* পণ্য হাতে পেয়ে টাকা দিন</span>
              <button
                onClick={onClearCart}
                className="text-gray-400 hover:text-rose-500 underline cursor-pointer"
              >
                কার্ট খালি করুন
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
