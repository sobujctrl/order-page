import React from 'react';
import { Category } from '../../types/ecommerce';
import { Smartphone, Shirt, Apple, Home, Sparkles, Watch, Layers } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Smartphone,
  Shirt,
  Apple,
  Home,
  Sparkles,
  Watch,
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="my-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span>পণ্য ক্যাটাগরি</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              ব্রাউজ করুন
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            আপনার পছন্দের ক্যাটাগরি বেছে নিন এবং সহজেই কেনাকাটা করুন
          </p>
        </div>

        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs sm:text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>সকল পণ্য দেখুন</span>
          <span>→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {/* All Products tile */}
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer group ${
            selectedCategory === 'all'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/20'
              : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-300 hover:shadow-xs'
          }`}
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${
              selectedCategory === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-xs sm:text-sm font-bold line-clamp-1">সব ক্যাটাগরি</span>
          <span
            className={`text-[11px] mt-0.5 ${
              selectedCategory === 'all' ? 'text-emerald-100' : 'text-gray-400'
            }`}
          >
            সবগুলো
          </span>
        </button>

        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.iconName] || Smartphone;
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl border text-center transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/20'
                  : 'bg-white text-gray-800 border-gray-200 hover:border-emerald-300 hover:shadow-xs'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${
                  isSelected
                    ? 'bg-emerald-500 text-white'
                    : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <span className="text-xs sm:text-sm font-bold line-clamp-1">{cat.nameBn}</span>
              <span
                className={`text-[11px] mt-0.5 ${
                  isSelected ? 'text-emerald-100' : 'text-gray-400'
                }`}
              >
                {cat.itemCount}+ পণ্য
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
