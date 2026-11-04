import React from 'react';
import { Truck, ShieldCheck, Banknote, RefreshCw } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: Banknote,
      title: 'ক্যাশ অন ডেলিভারি',
      desc: 'হাতে পেয়ে দেখে মূল্য পরিশোধ',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      icon: Truck,
      title: 'সারা দেশে দ্রুত ডেলিভারি',
      desc: 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা',
      bg: 'bg-teal-50 text-teal-700 border-teal-100',
    },
    {
      icon: ShieldCheck,
      title: 'নির্ভরযোগ্য সেবা',
      desc: 'নিরাপদ ও সহজ অর্ডার প্রক্রিয়া',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    },
    {
      icon: RefreshCw,
      title: '৭ দিনের সহজ রিটার্ন',
      desc: 'ত্রুটিযুক্ত পণ্যে সহজ এক্সচেঞ্জ',
      bg: 'bg-teal-50 text-teal-700 border-teal-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {badges.map((b, i) => {
        const Icon = b.icon;
        return (
          <div
            key={i}
            className={`flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border ${b.bg} transition-transform hover:-translate-y-0.5`}
          >
            <div className="p-2 sm:p-2.5 rounded-xl bg-white shadow-xs shrink-0">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                {b.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-600 mt-0.5">
                {b.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
