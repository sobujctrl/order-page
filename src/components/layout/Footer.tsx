import React from 'react';
import { 
  ShoppingBag, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  CreditCard,
  Heart,
  Lock
} from 'lucide-react';

interface FooterProps {
  onOpenTracking: () => void;
  onSelectCategory: (category: string) => void;
  storeName?: string;
  storePhone?: string;
  storeEmail?: string;
  storeAddress?: string;
  onOpenAdminLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracking,
  onSelectCategory,
  storeName = 'E-commerce',
  storePhone = '01989183031',
  storeEmail = 'support@example.com',
  storeAddress = 'ঢাকা, বাংলাদেশ',
  onOpenAdminLogin,
}) => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-gray-600">
      {/* Value Proposition Highlights */}
      <div className="border-b border-gray-100 bg-emerald-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">দ্রুত ডেলিভারি</h4>
                <p className="text-xs text-gray-500">ঢাকার মধ্যে ২৪-৪৮ ঘণ্টা, সারাদেশে ২-৪ দিন</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">ক্যাশ অন ডেলিভারি</h4>
                <p className="text-xs text-gray-500">পণ্য হাতে পেয়ে নিশ্চিন্তে টাকা পরিশোধ করুন</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">৭ দিনের রিটার্ন</h4>
                <p className="text-xs text-gray-500">পণ্য পছন্দ না হলে সহজ পরিবর্তনের সুবিধা</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">নির্ভরযোগ্য সেবা</h4>
                <p className="text-xs text-gray-500">সহজ ও নিশ্চিন্ত অর্ডারের প্রতিশ্রুতি</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tight">
                {storeName}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              বাংলাদেশের অনলাইন কেনাকাটার বিশ্বস্ত ঠিকানা। প্রয়োজনীয় সব পণ্য পেয়ে যান আকর্ষণীয় মূল্যে।
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-gray-700 block mb-2">
                নিরাপদ পেমেন্ট মেথড:
              </span>
              <div className="flex flex-wrap gap-2 text-xs font-medium">
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
                  💵 ক্যাশ অন ডেলিভারি (COD)
                </span>
                <span className="px-2.5 py-1 bg-pink-50 text-pink-700 rounded-md border border-pink-200">
                  bKash (বিকাশ)
                </span>
                <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-md border border-orange-200">
                  Nagad (নগদ)
                </span>
                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200">
                  Rocket (রকেট)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Category Links */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              জনপ্রিয় ক্যাটাগরি
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onSelectCategory('gadgets')}
                  className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer text-left"
                >
                  গ্যাজেট ও ইলেকট্রনিক্স
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('fashion')}
                  className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer text-left"
                >
                  ফ্যাশন ও লাইফস্টাইল
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('grocery')}
                  className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer text-left"
                >
                  অর্গানিক ও খাঁটি খাবার
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('home-kitchen')}
                  className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer text-left"
                >
                  হোম ও কিচেন
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('beauty')}
                  className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer text-left"
                >
                  রূপচর্চা ও বিউটি কেয়ার
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              গ্রাহক সেবা
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenTracking}
                  className="hover:text-emerald-700 hover:underline transition-colors cursor-pointer text-left flex items-center gap-1 font-semibold text-emerald-700"
                >
                  📦 অর্ডার ট্র্যাক করুন
                </button>
              </li>
              <li>
                <span className="hover:text-emerald-700 cursor-pointer">
                  ডেলিভারি পলিসি ও চার্জ
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-700 cursor-pointer">
                  রিটার্ন ও রিফান্ড নীতি
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-700 cursor-pointer">
                  ব্যবহারের শর্তাবলী
                </span>
              </li>
              <li>
                <span className="hover:text-emerald-700 cursor-pointer">
                  প্রাইভেসী পলিসি
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              যোগাযোগ
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{storeAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href={`tel:${storePhone}`} className="hover:text-emerald-700 font-semibold text-gray-800">
                  {storePhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <a href={`mailto:${storeEmail}`} className="hover:text-emerald-700 text-xs">
                  {storeEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-gray-100 bg-gray-50 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 {storeName}. সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1">
              তৈরি করা হয়েছে <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> দিয়ে বাংলাদেশে
            </p>
            {onOpenAdminLogin && (
              <>
                <span className="text-gray-300">·</span>
                <a
                  href="#admin"
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenAdminLogin();
                    window.location.hash = 'admin';
                  }}
                  className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="অ্যাডমিন"
                >
                  অ্যাডমিন
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
