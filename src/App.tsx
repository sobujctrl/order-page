import React, { useState, useEffect, useMemo } from 'react';
import { Product, Order, CartItem, StoreSettings, OrderStatus, AdminUser } from './types/ecommerce';
import { INITIAL_CATEGORIES } from './data/mockData';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  resetProducts,
  getOrders,
  clearAllOrders,
  createOrder,
  updateOrderStatus,
  getStoredCart,
  saveStoredCart,
  getSettings,
  saveSettings,
  formatBDT,
  getCurrentAdminUser,
  setCurrentAdminUser,
  PRIMARY_ADMIN_EMAIL,
  isAdminEmail,
} from './services/storageService';

import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { HeroBanner } from './components/store/HeroBanner';
import { TrustBadges } from './components/store/TrustBadges';
import { CategoryGrid } from './components/store/CategoryGrid';
import { FlashDeals } from './components/store/FlashDeals';
import { ProductCard } from './components/store/ProductCard';
import { ProductModal } from './components/store/ProductModal';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/store/CheckoutModal';
import { OrderSuccessModal } from './components/store/OrderSuccessModal';
import { OrderTrackingModal } from './components/store/OrderTrackingModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';

import { 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  ArrowUpDown, 
  ShieldCheck, 
  ThumbsUp, 
  Headphones, 
  RefreshCw 
} from 'lucide-react';

export default function App() {
  // Core Entities from Storage
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getSettings());

  // Navigation & View State
  const [adminUser, setAdminUser] = useState<AdminUser | null>(getCurrentAdminUser());
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoginModalOpen, setAdminLoginModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'discount'>('featured');
  const [mobileTab, setMobileTab] = useState('home');

  // Interactive Modals
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [orderTrackingModalOpen, setOrderTrackingModalOpen] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);
  const [recentSuccessOrder, setRecentSuccessOrder] = useState<Order | null>(null);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Initialize data from LocalStorage
  useEffect(() => {
    setProducts(getProducts());
    setOrders(getOrders());
    setCart(getStoredCart());
    setSettings(getSettings());

    // Check URL hash for #admin routing
    const handleHashCheck = () => {
      const isHashAdmin = window.location.hash.toLowerCase().includes('admin');
      if (isHashAdmin) {
        const savedUser = getCurrentAdminUser();
        if (savedUser && isAdminEmail(savedUser.email)) {
          setAdminUser(savedUser);
          setIsAdmin(true);
          setAdminLoginModalOpen(false);
        } else {
          setIsAdmin(false);
          setAdminLoginModalOpen(true);
        }
      }
    };

    handleHashCheck();
    window.addEventListener('hashchange', handleHashCheck);
    return () => window.removeEventListener('hashchange', handleHashCheck);
  }, []);

  // Sync cart changes with LocalStorage
  useEffect(() => {
    saveStoredCart(cart);
  }, [cart]);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartProductIds = useMemo(() => {
    return cart.map((i) => i.product.id);
  }, [cart]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`✓ "${product.nameBn}" কার্টে যোগ করা হয়েছে`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    showToast('আইটেমটি কার্ট থেকে সরানো হয়েছে');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('কার্ট খালি করা হয়েছে');
  };

  // Instant Quick Buy (Adds to cart and immediately triggers Cash on Delivery checkout)
  const handleQuickBuy = (product: Product) => {
    const exists = cart.find((i) => i.product.id === product.id);
    if (!exists) {
      setCart((prev) => [...prev, { product, quantity: 1 }]);
    }
    setCheckoutModalOpen(true);
  };

  // Direct checkout from product modal with custom quantity
  const handleDirectCheckoutFromModal = (product: Product, quantity: number) => {
    setCart((prev) => {
      const filtered = prev.filter((i) => i.product.id !== product.id);
      return [...filtered, { product, quantity }];
    });
    setCheckoutModalOpen(true);
  };

  // Process and save new order
  const handleProcessOrder = (orderData: Parameters<typeof createOrder>[0]) => {
    const newOrder = createOrder(orderData);
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart after successful checkout
    return newOrder;
  };

  // When order completes
  const handleOrderSuccess = (order: Order) => {
    setCheckoutModalOpen(false);
    setRecentSuccessOrder(order);
  };

  // Admin Actions
  const handleSaveProduct = (product: Product) => {
    const updated = saveProduct(product);
    setProducts(updated);
    showToast(`✓ পণ্য "${product.nameBn}" সংরক্ষণ করা হয়েছে`);
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = deleteProduct(productId);
    setProducts(updated);
    showToast('পণ্য মুছে ফেলা হয়েছে');
  };

  const handleResetProducts = () => {
    const defaultList = resetProducts();
    setProducts(defaultList);
    showToast('সব পণ্য ডিফল্ট তালিকায় রিসেট করা হয়েছে');
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const updated = updateOrderStatus(orderId, status, note);
    setOrders(updated);
    showToast('অর্ডারের স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে');
  };

  const handleSaveSettings = (newSettings: StoreSettings) => {
    const saved = saveSettings(newSettings);
    setSettings(saved);
  };

  // Product Filtering and Sorting
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nameBn.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.categoryBn.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        result.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  // If Admin mode is toggled, render AdminDashboard
  if (isAdmin) {
    return (
      <AdminDashboard
        products={products}
        orders={orders}
        categories={INITIAL_CATEGORIES}
        settings={settings}
        adminEmail={adminUser?.email || PRIMARY_ADMIN_EMAIL}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onSaveSettings={handleSaveSettings}
        onExitAdmin={() => {
          setIsAdmin(false);
          if (window.location.hash.includes('admin')) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onLogout={() => {
          setCurrentAdminUser(null);
          setAdminUser(null);
          setIsAdmin(false);
          if (window.location.hash.includes('admin')) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
          showToast('অ্যাডমিন অ্যাকাউন্ট লগআউট করা হয়েছে');
        }}
        onClearAllOrders={() => {
          const emptied = clearAllOrders();
          setOrders(emptied);
          showToast('সকল অর্ডার ডাটা সফলভাবে মুছে ফেলা হয়েছে');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] text-gray-900 flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-gray-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-xl border border-gray-700 flex items-center gap-2 animate-in slide-in-from-top-4 duration-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Store Header */}
      <Header
        categories={INITIAL_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setMobileTab('home');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenTracking={() => setOrderTrackingModalOpen(true)}
        isAdminLoggedIn={!!adminUser}
        onOpenAdmin={() => setIsAdmin(true)}
        storeName={settings.storeName}
        storePhone={settings.storePhone}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1">
        
        {/* Promotional Hero Banner */}
        <HeroBanner
          onShopNow={() => {
            const el = document.getElementById('all-products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreDeals={() => {
            const el = document.getElementById('flash-deals-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Reassurance Trust Badges */}
        <TrustBadges />

        {/* Visual Category Selector */}
        <CategoryGrid
          categories={INITIAL_CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={(slug) => {
            setSelectedCategory(slug);
            const el = document.getElementById('all-products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Flash Deals Section (with live countdown) */}
        <div id="flash-deals-section">
          <FlashDeals
            products={products}
            onAddToCart={handleAddToCart}
            onQuickBuy={handleQuickBuy}
            onQuickView={(p) => setSelectedQuickViewProduct(p)}
            cartProductIds={cartProductIds}
          />
        </div>

        {/* Main Product Catalog Section */}
        <section id="all-products-section" className="my-10">
          {/* Section Header with Sort Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {selectedCategory === 'all'
                    ? 'আমাদের পণ্যসমূহ'
                    : INITIAL_CATEGORIES.find((c) => c.slug === selectedCategory)?.nameBn || 'পণ্যসমূহ'}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  {filteredAndSortedProducts.length} টি পণ্য
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                ক্যাশ অন ডেলিভারিতে পছন্দের পণ্য অর্ডার করুন এবং ঘরে বসে বুঝে নিন
              </p>
            </div>

            {/* Sorting Dropdown & Reset Filter */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs text-rose-600 font-bold hover:underline cursor-pointer mr-1"
                >
                  ফিল্টার মুছুন ✕
                </button>
              )}

              <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-500">সাজান:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-bold text-gray-800 bg-transparent focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">জনপ্রিয়তা ও ফিচার্ড</option>
                  <option value="price-low">দাম: কম থেকে বেশি</option>
                  <option value="price-high">দাম: বেশি থেকে কম</option>
                  <option value="discount">সর্বোচ্চ ছাড়</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredAndSortedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 mt-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickBuy={handleQuickBuy}
                  onQuickView={(p) => setSelectedQuickViewProduct(p)}
                  isInCart={cartProductIds.includes(product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center my-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <SlidersHorizontal className="w-8 h-8 opacity-50" />
              </div>
              <h3 className="text-base font-bold text-gray-800">
                কোনো পণ্য খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি। দয়া করে অন্য কোনো শব্দ দিয়ে খুঁজুন অথবা সকল পণ্য ক্যাটাগরিতে ফিরে যান।
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          )}
        </section>

        {/* Why Buy From Us Trust Section */}
        <section className="my-14 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-10 shadow-xs">
          <div className="max-w-3xl mx-auto text-center space-y-2 mb-8">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              আমাদের বিশ্বস্ততা
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
              কেন লক্ষাধিক গ্রাহক আমাদের ওপর ভরসা করেন?
            </h3>
            <p className="text-xs sm:text-sm text-gray-500">
              অনলাইনে নিরাপদ কেনাকাটা ও দ্রুততম ডেলিভারি নিশ্চিত করতে আমরা প্রতিশ্রুতিবদ্ধ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">মানসম্মত ও পরীক্ষিত পণ্য</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                আমরা সরাসরি বিশ্বস্ত প্রস্তুতকারক ও সোর্স থেকে প্রতিটি পণ্য সংগ্রহ করি এবং গুণগত মান যাচাই করে ডেলিভারি করি।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">৭ দিনের সহজ রিটার্ন ও এক্সচেঞ্জ</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                পণ্য হাতে পাওয়ার পর কোনো সমস্যা বা সাইজে অমিল থাকলে ৭ দিনের মধ্যে কোনো ঝামেলা ছাড়াই পরিবর্তন করা যাবে।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gray-50/80 border border-gray-100 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto sm:mx-0 shadow-sm">
                <Headphones className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">২৪/৭ সার্বক্ষণিক গ্রাহক সেবা</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                অর্ডার সংক্রান্ত যেকোনো তথ্য জানতে আমাদের হটলাইনে সরাসরি কল অথবা মেসেজ দিতে পারেন।
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer
        onOpenTracking={() => setOrderTrackingModalOpen(true)}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          const el = document.getElementById('all-products-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        storeName={settings.storeName}
        storePhone={settings.storePhone}
        storeEmail={settings.storeEmail}
        storeAddress={settings.storeAddress}
        onOpenAdminLogin={() => {
          if (adminUser) {
            setIsAdmin(true);
          } else {
            setAdminLoginModalOpen(true);
          }
        }}
      />

      {/* Mobile Sticky Bottom Nav (Admin tab visible only if verified admin is logged in) */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={(tab) => {
          setMobileTab(tab);
          if (tab === 'categories') {
            const el = document.getElementById('all-products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        cartCount={cartCount}
        onOpenCart={() => setCartDrawerOpen(true)}
        onOpenTracking={() => setOrderTrackingModalOpen(true)}
        isAdminLoggedIn={!!adminUser}
        onToggleAdmin={() => setIsAdmin(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => setCheckoutModalOpen(true)}
        freeDeliveryThreshold={settings.freeDeliveryThreshold}
      />

      {/* Checkout Form Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cartItems={cart}
        settings={settings}
        onOrderSuccess={handleOrderSuccess}
        onProcessOrder={handleProcessOrder}
      />

      {/* Order Success / Receipt Modal */}
      <OrderSuccessModal
        order={recentSuccessOrder}
        onClose={() => setRecentSuccessOrder(null)}
        onTrackOrder={(ord) => {
          setRecentSuccessOrder(null);
          setOrderTrackingModalOpen(true);
        }}
        storePhone={settings.storePhone}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={orderTrackingModalOpen}
        onClose={() => setOrderTrackingModalOpen(false)}
        orders={orders}
        preSelectedOrder={recentSuccessOrder}
        storePhone={settings.storePhone}
      />

      {/* Product Quick View Modal */}
      <ProductModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
        onAddToCart={(p, qty) => handleAddToCart(p, qty)}
        onDirectCheckout={(p, qty) => handleDirectCheckoutFromModal(p, qty)}
        isInCart={selectedQuickViewProduct ? cartProductIds.includes(selectedQuickViewProduct.id) : false}
      />

      {/* Admin Login Modal (Strictly verifies sobujbd679@gmail.com) */}
      <AdminLoginModal
        isOpen={adminLoginModalOpen}
        onClose={() => {
          setAdminLoginModalOpen(false);
          if (window.location.hash.includes('admin')) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }}
        onLoginSuccess={(user) => {
          setAdminUser(user);
          setIsAdmin(true);
          window.location.hash = 'admin';
          showToast(`✓ স্বাগতম ${user.displayName}! অ্যাডমিন প্যানেলে প্রবেশ করেছেন`);
        }}
      />

    </div>
  );
}
