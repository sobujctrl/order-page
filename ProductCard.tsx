import React from 'react';
import { Product } from '../../types/ecommerce';
import { formatBDT } from '../../services/storageService';
import { Star, ShoppingCart, Eye, Zap, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickBuy: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isInCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickBuy,
  onQuickView,
  isInCart = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative">
      
      {/* Product Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.nameBn}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discountPercent && product.discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-lg shadow-sm">
            -{product.discountPercent}% ছাড়
          </div>
        )}

        {/* Feature/Promo Badge */}
        {product.badge && (
          <div className="absolute top-2.5 right-2.5 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-xs">
            {product.badge}
          </div>
        )}

        {/* Quick View Hover Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          aria-label="Quick View"
        >
          <span className="bg-white/95 text-gray-800 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-emerald-600" />
            <span>বিস্তারিত দেখুন</span>
          </span>
        </button>

        {/* Low Stock Warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-amber-500/90 text-white text-[10px] font-bold py-0.5 px-2 rounded text-center backdrop-blur-xs">
            মাত্র {product.stock} টি স্টক বাকি!
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
              {product.categoryBn}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
            title={product.nameBn}
          >
            {product.nameBn}
          </h3>

          {/* Price Section */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base sm:text-lg font-black text-emerald-700">
              {formatBDT(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatBDT(product.originalPrice)}
              </span>
            )}
            {product.unit && (
              <span className="text-[11px] text-gray-400 ml-auto">
                {product.unit}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Quick Buy (COD) & Add to Cart */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={() => onAddToCart(product)}
            className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              isInCart
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
            title="শপিং কার্টে যোগ করুন"
          >
            {isInCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span>যোগ করা আছে</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>কার্ট</span>
              </>
            )}
          </button>

          <button
            onClick={() => onQuickBuy(product)}
            className="py-2 px-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center gap-1 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            title="সরাসরি ক্যাশ অন ডেলিভারিতে অর্ডার করুন"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>অর্ডার করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
