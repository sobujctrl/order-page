import React, { useState, useEffect } from 'react';
import { Product } from '../../types/ecommerce';
import { ProductCard } from './ProductCard';
import { Flame, Clock, Sparkles } from 'lucide-react';

interface FlashDealsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onQuickView: (product: Product) => void;
  cartProductIds: string[];
}

export const FlashDeals: React.FC<FlashDealsProps> = ({
  products,
  onAddToCart,
  onQuickBuy,
  onQuickView,
  cartProductIds,
}) => {
  // Countdown timer state for flash sale
  const [timeLeft, setTimeLeft] = useState({
    hours: 14,
    minutes: 36,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashDeal).slice(0, 4);

  if (flashProducts.length === 0) return null;

  return (
    <section className="my-10 bg-linear-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-5 sm:p-7 shadow-lg text-white">
      {/* Header with Title and Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-700/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold mb-2">
            <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>আজকের স্পেশাল ধামাকা অফার</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>ফ্ল্যাশ ডিলস (Flash Deals)</span>
            <Sparkles className="w-5 h-5 text-amber-300" />
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-0.5">
            সীমিত সময়ের জন্য অবিশ্বাস্য ডিসকাউন্টে সংগ্রহ করুন
          </p>
        </div>

        {/* Countdown Box */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10">
          <Clock className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-xs text-emerald-200 font-medium mr-1">অফার শেষ হতে বাকি:</span>
          <div className="flex items-center gap-1 text-center font-mono font-bold text-sm">
            <span className="bg-emerald-700 px-2 py-1 rounded-md min-w-[28px]">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-emerald-700 px-2 py-1 rounded-md min-w-[28px]">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span>:</span>
            <span className="bg-rose-600 px-2 py-1 rounded-md min-w-[28px]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Flash Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-6">
        {flashProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onQuickBuy={onQuickBuy}
            onQuickView={onQuickView}
            isInCart={cartProductIds.includes(product.id)}
          />
        ))}
      </div>
    </section>
  );
};
