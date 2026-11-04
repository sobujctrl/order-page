import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  PhoneCall, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Menu, 
  X,
  LayoutDashboard,
  SearchCode
} from 'lucide-react';
import { Category } from '../../types/ecommerce';
import { formatBDT } from '../../services/storageService';

interface HeaderProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdmin?: () => void;
  storeName?: string;
  storePhone?: string;
}

export const Header: React.FC<HeaderProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenTracking,
  isAdminLoggedIn = false,
  onOpenAdmin,
  storeName = 'E-commerce',
  storePhone = '01989183031',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-gray-100">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-700 text-white text-xs md:text-sm py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-emerald-200" />
              <span>সারাদেশে দ্রুত ক্যাশ অন ডেলিভারি</span>
            </span>
            <span className="hidden sm:inline text-emerald-300">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-200" />
              <span>৭ দিনের সহজ রিটার্ন পলিসি</span>
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={onOpenTracking}
              className="hover:text-emerald-200 transition-colors flex items-center gap-1 cursor-pointer underline decoration-dotted underline-offset-2"
            >
              <SearchCode className="w-3.5 h-3.5" />
              <span>অর্ডার ট্র্যাক করুন</span>
            </button>
            <span className="text-emerald-300">|</span>
            <a 
              href={`tel:${storePhone.replace(/[^0-9]/g, '') || '01989183031'}`} 
              className="flex items-center gap-1 hover:text-emerald-200 transition-colors font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-200" />
              <span>হটলাইন: {storePhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Button & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div 
              onClick={() => onSelectCategory('all')} 
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black text-gray-900 tracking-tight flex items-center gap-1">
                  {storeName}
                  <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                </span>
                <span className="text-[11px] block text-emerald-700 font-semibold -mt-0.5 tracking-wider uppercase">
                  অনলাইন শপিং স্টোর
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <div className={`relative w-full rounded-full border transition-all duration-200 ${
              searchFocused ? 'border-emerald-600 ring-2 ring-emerald-100 shadow-sm' : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="text"
                placeholder="পণ্য বা মডেলের নাম লিখে খুঁজুন... (যেমন: পাঞ্জাবি, মধু, স্মার্টওয়াচ)"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full py-2.5 pl-5 pr-12 text-sm bg-gray-50 focus:bg-white rounded-full focus:outline-hidden text-gray-800 placeholder-gray-400"
              />
              <button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 transition-colors cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Admin Dashboard link ONLY visible when verified admin is logged in */}
            {isAdminLoggedIn && onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer bg-emerald-100 text-emerald-900 hover:bg-emerald-200 border border-emerald-300"
                title="অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন"
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                <span>অ্যাডমিন</span>
              </button>
            )}

            {/* Cart Trigger Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-emerald-600/25 transition-all hover:shadow-lg hover:shadow-emerald-600/35 active:scale-95 cursor-pointer"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-rose-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="text-[11px] text-emerald-100 font-normal">শপিং কার্ট</span>
                <span className="text-xs font-bold">{cartTotal > 0 ? formatBDT(cartTotal) : '০৳'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="পণ্য বা ব্র্যান্ড খুঁজুন..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-2 pl-4 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-hidden focus:border-emerald-600 focus:bg-white text-gray-800"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Category Navigation Bar (Desktop) */}
      <div className="hidden lg:block border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              সকল পণ্য (All Products)
            </button>

            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'text-gray-700 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  <span>{cat.nameBn}</span>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {cat.itemCount}
                  </span>
                </button>
              );
            })}

            <div className="ml-auto pl-4 flex items-center gap-2">
              <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-bold animate-pulse">
                🔥 ধামাকা ছাড় চলছে!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-4 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg text-gray-900">{storeName}</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  পণ্য ক্যাটাগরি
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onSelectCategory('all');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    সকল পণ্য
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.slug);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between cursor-pointer ${
                        selectedCategory === cat.slug
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.nameBn}</span>
                      <span className="text-xs opacity-75">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  কুইক মেনু
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      onOpenTracking();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <SearchCode className="w-4 h-4 text-emerald-600" />
                    <span>অর্ডার ট্র্যাকিং</span>
                  </button>
                  {isAdminLoggedIn && onOpenAdmin && (
                    <button
                      onClick={() => {
                        onOpenAdmin();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                      <span>অ্যাডমিন ড্যাশবোর্ড</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-500">
              <p className="font-semibold text-gray-800">সহায়তার জন্য কল করুন:</p>
              <a href={`tel:${storePhone}`} className="text-emerald-700 font-bold block mt-1">
                {storePhone}
              </a>
              <p className="mt-2 text-[11px] text-gray-400">সকাল ৯টা - রাত ১০টা</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
};
