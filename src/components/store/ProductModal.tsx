import React, { useState } from 'react';
import { Product } from '../../types/ecommerce';
import { formatBDT } from '../../services/storageService';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onDirectCheckout: (product: Product, quantity: number) => void;
  isInCart?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
  isInCart = false,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const allImages = [product.image, ...(product.additionalImages || [])];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
          
          {/* Images Section */}
          <div className="p-4 sm:p-6 bg-gray-50 flex flex-col justify-between">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-xs mb-4">
              <img
                src={selectedImage}
                alt={product.nameBn}
                className="w-full h-full object-cover"
              />
              {product.discountPercent && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-lg">
                  -{product.discountPercent}% ছাড়
                </span>
              )}
            </div>

            {/* Thumbnail selection */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      selectedImage === img
                        ? 'border-emerald-600 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Delivery Assurance */}
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>সারাদেশে ক্যাশ অন ডেলিভারি</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>১০০% খাঁটি ও আসল পণ্য</span>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="p-5 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {product.categoryBn}
                </span>
                {product.badge && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {product.badge}
                  </span>
                )}
                {product.sku && (
                  <span className="text-[11px] text-gray-400 ml-auto">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
                {product.nameBn}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2 text-sm">
                <div className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-gray-500 text-xs">
                  {product.reviewCount} টি কাস্টমার রিভিউ
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  ইন স্টক ({product.stock} টি)
                </span>
              </div>

              {/* Price */}
              <div className="bg-emerald-50/70 rounded-2xl p-3.5 my-4 border border-emerald-100 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-emerald-800">
                  {formatBDT(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatBDT(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 ml-auto">
                    সাশ্রয় {formatBDT(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <div className="mb-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                  পণ্যের বিবরণ
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features List */}
              {product.features && product.features.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                    মূল বৈশিষ্ট্যসমূহ:
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-700">পরিমাণ:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={handleDecrease}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrease}
                    disabled={quantity >= product.stock}
                    className="p-2 hover:bg-gray-100 text-gray-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity);
                  }}
                  className={`py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    isInCart
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isInCart ? 'কার্টে যোগ করা আছে' : 'কার্টে যোগ করুন'}</span>
                </button>

                <button
                  onClick={() => {
                    onDirectCheckout(product, quantity);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-md shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>ক্যাশ অন ডেলিভারিতে অর্ডার</span>
                </button>
              </div>

              <p className="text-[11px] text-center text-gray-400 mt-2">
                * কোনো অগ্রিম টাকা লাগবে না, ডেলিভারি ম্যানের থেকে পণ্য বুঝে পেয়ে টাকা দিন
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
