import React from 'react';
import { ShoppingCart, Flame, ShieldCheck, Zap, ArrowRight, Truck } from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onExploreDeals: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onExploreDeals }) => {
  return (
    <div className="relative overflow-hidden bg-radial from-emerald-800 via-emerald-900 to-emerald-950 text-white rounded-2xl sm:rounded-3xl shadow-xl my-4 sm:my-6">
      {/* Decorative ambient glowing circles */}
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 -mb-20 w-80 h-80 rounded-full bg-teal-400/15 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-semibold backdrop-blur-xs">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>সেরা পণ্য কালেকশন • দ্রুত হোম ডেলিভারি</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
              সেরা পণ্য, <br className="hidden sm:inline" />
              <span className="text-emerald-300">ক্যাশ অন ডেলিভারিতে</span> ঘরে বসেই
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              কোনো অগ্রিম পেমেন্ট ছাড়াই সারা বাংলাদেশে হোম ডেলিভারি। ডেলিভারি ম্যানের সামনে পণ্য দেখে ও যাচাই করে মূল্য পরিশোধ করার সুবর্ণ সুযোগ!
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={onShopNow}
                className="bg-white hover:bg-emerald-50 text-emerald-900 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-95 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-700" />
                <span>এখনই কেনাকাটা করুন</span>
                <ArrowRight className="w-4 h-4 text-emerald-700" />
              </button>

              <button
                onClick={onExploreDeals}
                className="bg-emerald-700/80 hover:bg-emerald-700 text-white border border-emerald-500/50 px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xs"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>আজকের স্পেশাল ডিল</span>
              </button>
            </div>

            {/* Micro Highlights */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs sm:text-sm text-emerald-200 border-t border-emerald-800/80">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-300" />
                <span>দ্রুততম হোম ডেলিভারি</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>নিরাপদ অনলাইন অর্ডার</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>হাতে পেয়ে টাকা দিন (COD)</span>
              </span>
            </div>
          </div>

          {/* Right Product Grid Teaser */}
          <div className="lg:col-span-5 hidden sm:block">
            <div className="grid grid-cols-2 gap-3.5 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl">
              
              <div className="bg-white rounded-xl p-3 text-gray-800 flex flex-col justify-between shadow-sm transform hover:-translate-y-1 transition-transform">
                <div className="relative h-28 rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80"
                    alt="Smart Watch"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    ৩৮% ছাড়
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 truncate">টি৯০০ আল্ট্রা ২ কলিং স্মার্টওয়াচ</h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-black text-emerald-700">৳১,৩৫০</span>
                    <span className="text-[11px] text-gray-400 line-through">৳২,২০০</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 text-gray-800 flex flex-col justify-between shadow-sm transform hover:-translate-y-1 transition-transform">
                <div className="relative h-28 rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80"
                    alt="TWS Earbuds"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    ৪২% ছাড়
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 truncate">এম১০ অরিজিনাল টিডব্লিউএস ইয়ারবাডস</h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-black text-emerald-700">৳৫৫০</span>
                    <span className="text-[11px] text-gray-400 line-through">৳৯৫০</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 text-gray-800 flex flex-col justify-between shadow-sm transform hover:-translate-y-1 transition-transform">
                <div className="relative h-28 rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80"
                    alt="Sundarban Honey"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    প্রাকৃতিক
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 truncate">সুন্দরবনের খাঁটি প্রাকৃতিক মধু</h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-black text-emerald-700">৳৬৫০</span>
                    <span className="text-[11px] text-gray-400 line-through">৳৮০০</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 text-gray-800 flex flex-col justify-between shadow-sm transform hover:-translate-y-1 transition-transform">
                <div className="relative h-28 rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img
                    src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=400&q=80"
                    alt="Panjabi"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 right-1 bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    সেরা কালেকশন
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 truncate">প্রিমিয়াম কটন এমব্রয়ডারি পাঞ্জাবি</h4>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-black text-emerald-700">৳১,৮৫০</span>
                    <span className="text-[11px] text-gray-400 line-through">৳২,৮০০</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
