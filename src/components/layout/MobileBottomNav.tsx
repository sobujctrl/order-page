import React from 'react';
import { Home, Grid, ShoppingCart, SearchCode, LayoutDashboard } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTracking: () => void;
  isAdminLoggedIn?: boolean;
  onToggleAdmin?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenTracking,
  isAdminLoggedIn = false,
  onToggleAdmin
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 py-1.5 px-3 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg cursor-pointer transition-colors ${
            currentTab === 'home' ? 'text-emerald-700 font-bold' : 'text-gray-500 hover:text-emerald-600'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">হোম</span>
        </button>

        <button
          onClick={() => onSelectTab('categories')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg cursor-pointer transition-colors ${
            currentTab === 'categories' ? 'text-emerald-700 font-bold' : 'text-gray-500 hover:text-emerald-600'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">ক্যাটাগরি</span>
        </button>

        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center py-1 px-3 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/30 -mt-3.5 hover:bg-emerald-700 transition-transform active:scale-95 cursor-pointer"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">কার্ট</span>
        </button>

        <button
          onClick={onOpenTracking}
          className="flex flex-col items-center py-1 px-2 rounded-lg cursor-pointer transition-colors text-gray-500 hover:text-emerald-600"
        >
          <SearchCode className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">ট্র্যাক</span>
        </button>

        {isAdminLoggedIn && onToggleAdmin && (
          <button
            onClick={onToggleAdmin}
            className="flex flex-col items-center py-1 px-2 rounded-lg cursor-pointer transition-colors text-amber-700 font-bold"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">অ্যাডমিন</span>
          </button>
        )}
      </div>
    </div>
  );
};
