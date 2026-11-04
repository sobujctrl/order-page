import React, { useState } from 'react';
import { Product, Order, Category, OrderStatus, StoreSettings } from '../../types/ecommerce';
import { 
  formatBDT, 
  getStatusLabelBn, 
  getTelegramLogs, 
  sendTelegramNotification,
  TelegramLog 
} from '../../services/storageService';
import { 
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Printer, 
  ArrowLeft, 
  Search, 
  SlidersHorizontal, 
  Save, 
  RotateCcw, 
  Send, 
  Database, 
  Phone, 
  MapPin, 
  X,
  FileSpreadsheet,
  AlertCircle,
  LogOut
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  categories: Category[];
  settings: StoreSettings;
  adminEmail?: string;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetProducts: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  onSaveSettings: (settings: StoreSettings) => void;
  onExitAdmin: () => void;
  onLogout?: () => void;
  onClearAllOrders?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  categories,
  settings,
  adminEmail = 'sobujbd679@gmail.com',
  onSaveProduct,
  onDeleteProduct,
  onResetProducts,
  onUpdateOrderStatus,
  onSaveSettings,
  onExitAdmin,
  onLogout,
  onClearAllOrders,
}) => {
  // Navigation Tabs: 'overview' | 'products' | 'orders' | 'integrations'
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'integrations'>('overview');

  // Product management modal states
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order detail modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Search & Filter states
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');

  // Settings local state
  const [localSettings, setLocalSettings] = useState<StoreSettings>({ ...settings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Telegram test status
  const [telegramLogs, setTelegramLogs] = useState<TelegramLog[]>(getTelegramLogs());
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [telegramTestMessage, setTelegramTestMessage] = useState<string | null>(null);

  // Key metrics calculation
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const processingOrdersCount = orders.filter((o) => o.status === 'processing').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameBn.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.phone.includes(orderSearch);
    const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle open add product
  const handleAddNewProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: '',
      nameBn: '',
      category: categories[0]?.slug || 'gadgets',
      categoryBn: categories[0]?.nameBn || 'গ্যাজেট ও ইলেকট্রনিক্স',
      price: 990,
      originalPrice: 1500,
      discountPercent: 34,
      rating: 4.8,
      reviewCount: 1,
      stock: 30,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
      description: 'উচ্চমানের নির্ভরযোগ্য পণ্য। সারাদেশে দ্রুত ক্যাশ অন ডেলিভারি সুবিধা।',
      features: ['১০০% অরিজিনাল কোয়ালিটি', 'ক্যাশ অন ডেলিভারি সুবিধা', 'সহজ রিটার্ন পলিসি'],
      isFeatured: true,
      badge: 'নতুন',
      unit: '১ পিস',
      sku: `ECOM-${Math.floor(100 + Math.random() * 900)}`
    });
    setProductModalOpen(true);
  };

  // Handle open edit product
  const handleEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setProductModalOpen(true);
  };

  // Handle save product form
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.nameBn) return;

    // sync categoryBn
    const cat = categories.find((c) => c.slug === editingProduct.category);
    const finalized = {
      ...editingProduct,
      categoryBn: cat ? cat.nameBn : editingProduct.categoryBn,
      discountPercent: editingProduct.originalPrice && editingProduct.originalPrice > editingProduct.price
        ? Math.round(((editingProduct.originalPrice - editingProduct.price) / editingProduct.originalPrice) * 100)
        : 0
    };

    onSaveProduct(finalized);
    setProductModalOpen(false);
    setEditingProduct(null);
  };

  // Handle send Telegram test
  const handleTestTelegramNotification = async () => {
    setTestingTelegram(true);
    setTelegramTestMessage(null);
    try {
      const sampleOrder = orders[0] || {
        id: `ord-${Date.now()}`,
        orderNumber: 'BD-TEST01',
        createdAt: new Date().toISOString(),
        customerName: 'আব্দুর রহিম',
        phone: '01711223344',
        division: 'Dhaka',
        district: 'ঢাকা সিটি',
        address: 'ধানমন্ডি ২৭, ঢাকা',
        deliveryArea: 'inside_dhaka' as const,
        deliveryFee: 60,
        paymentMethod: 'cod' as const,
        paymentStatus: 'unpaid' as const,
        items: [
          {
            productId: 'sample-1',
            productName: 'টি৯০০ আল্ট্রা ২ ব্লুটুথ কলিং স্মার্টওয়াচ',
            price: 1350,
            quantity: 1,
            image: ''
          }
        ],
        subtotal: 1350,
        total: 1410,
        status: 'pending' as const
      };

      const res = await sendTelegramNotification(sampleOrder);
      setTelegramLogs(getTelegramLogs());
      if (res.status === 'sent') {
        setTelegramTestMessage('✅ টেলিগ্রাম চ্যানেলে সরাসরি নোটিফিকেশন পাঠানো সফল হয়েছে!');
      } else {
        setTelegramTestMessage('ℹ️ টেলিগ্রাম টেস্ট মেসেজ তৈরি হয়েছে এবং লগ সংরক্ষণ করা হয়েছে। (টোকেন সেট করা থাকলে সরাসরি চ্যানেলে চলে যাবে)');
      }
    } catch {
      setTelegramTestMessage('⚠️ নোটিফিকেশন টেস্ট করতে সমস্যা হয়েছে');
    } finally {
      setTestingTelegram(false);
    }
  };

  const handleSaveSettingsClick = () => {
    onSaveSettings(localSettings);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      
      {/* Admin Top Navbar */}
      <header className="bg-emerald-900 text-white sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight">
                  E-commerce অ্যাডমিন প্যানেল
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700">
                  ম্যানেজমেন্ট
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                পণ্য যোগ, এডিট, ডিলিট এবং লাইভ অর্ডার ব্যবস্থাপনা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] text-emerald-300">লগইনকৃত অ্যাডমিন:</span>
              <span className="text-xs font-mono font-bold text-white bg-emerald-800/80 px-2 py-0.5 rounded border border-emerald-700">
                {adminEmail}
              </span>
            </div>

            <button
              onClick={onExitAdmin}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold border border-emerald-600 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>দোকান</span>
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-700 hover:bg-rose-800 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold border border-rose-600 transition-all cursor-pointer"
                title="লগআউট করুন"
              >
                <LogOut className="w-4 h-4" />
                <span>লগআউট</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto border-t border-emerald-800/70 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-emerald-300 text-white font-bold bg-emerald-800/40'
                : 'border-transparent text-emerald-200 hover:text-white'
            }`}
          >
            <span>ড্যাশবোর্ড ওভারভিউ</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'products'
                ? 'border-emerald-300 text-white font-bold bg-emerald-800/40'
                : 'border-transparent text-emerald-200 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>পণ্য ব্যবস্থাপনা ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-emerald-300 text-white font-bold bg-emerald-800/40'
                : 'border-transparent text-emerald-200 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>অর্ডার ব্যবস্থাপনা</span>
            {pendingOrdersCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'integrations'
                ? 'border-emerald-300 text-white font-bold bg-emerald-800/40'
                : 'border-transparent text-emerald-200 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>ইন্টিগ্রেশন ও সেটিংস</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* ======================= TAB 1: OVERVIEW ======================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-emerald-700 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    মোট বিক্রি (বিক্রয় মূল্য)
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900">
                  {formatBDT(totalSales)}
                </div>
                <p className="text-xs text-gray-400 mt-1">সব সফল ও রানিং অর্ডারের যোগফল</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-blue-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    মোট অর্ডার
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-gray-900">
                  {orders.length} টি
                </div>
                <p className="text-xs text-gray-400 mt-1">ক্যাশ অন ডেলিভারি অর্ডার</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-amber-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    অপেক্ষমান (পেন্ডিং)
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-600">
                  {pendingOrdersCount} টি
                </div>
                <p className="text-xs text-gray-400 mt-1">কল করে কনফার্ম করা প্রয়োজন</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-emerald-600 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    ডেলিভারি সম্পন্ন
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                  {deliveredOrdersCount} টি
                </div>
                <p className="text-xs text-gray-400 mt-1">টাকা সংগ্রহ সম্পন্ন</p>
              </div>
            </div>

            {/* Quick Action & Architecture Ready Banner */}
            <div className="bg-linear-to-r from-emerald-800 to-teal-900 rounded-2xl p-5 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold">
                  <span>Supabase & Telegram প্রস্তুত</span>
                </div>
                <h3 className="text-lg font-bold">
                  ক্লিন ও মডুলার কোডবেস: প্রস্তুত ভবিষ্যতের ইন্টিগ্রেশনের জন্য
                </h3>
                <p className="text-xs text-emerald-200 max-w-xl">
                  ডাটাবেস কানেকশনের জন্য প্রস্তুত রয়েছে স্কিমা। এখনই আপনি নতুন পণ্য যোগ, এডিট বা ডিলিট করতে পারেন যা ব্রাউজারে সুরক্ষিত থাকবে।
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={handleAddNewProduct}
                  className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-700" />
                  <span>নতুন পণ্য যোগ করুন</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-600 border border-emerald-500 transition-colors cursor-pointer"
                >
                  <span>অর্ডার দেখুন</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-base">সাম্প্রতিক অর্ডারসমূহ</h3>
                  <p className="text-xs text-gray-500">গ্রাহকদের সর্বশেষ প্লেস করা অর্ডার</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  সবগুলো অর্ডার দেখুন →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
                    <tr>
                      <th className="py-3 px-4">অর্ডার আইডি</th>
                      <th className="py-3 px-4">গ্রাহক</th>
                      <th className="py-3 px-4">ফোন নম্বর</th>
                      <th className="py-3 px-4">পণ্য</th>
                      <th className="py-3 px-4">বিল</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-mono font-bold text-gray-800">
                          #{ord.orderNumber}
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {ord.customerName}
                        </td>
                        <td className="py-3 px-4 text-gray-600 font-mono">
                          {ord.phone}
                        </td>
                        <td className="py-3 px-4 text-gray-600 truncate max-w-[150px]">
                          {ord.items.map((i) => i.productName).join(', ')}
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-700">
                          {formatBDT(ord.total)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            ord.status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'shipped'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {getStatusLabelBn(ord.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="বিস্তারিত দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================= TAB 2: PRODUCT MANAGEMENT ======================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-1 items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="পণ্য বা মডেল দিয়ে খুঁজুন..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full py-2 pl-9 pr-3 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="py-2 px-2.5 text-xs border border-gray-300 rounded-xl bg-white focus:outline-hidden focus:border-emerald-600"
                  >
                    <option value="all">সব ক্যাটাগরি</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onResetProducts}
                  className="px-3 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-300 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  title="ডিফল্ট পণ্যের তালিকায় রিসেট করুন"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>রিসেট</span>
                </button>

                <button
                  onClick={handleAddNewProduct}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন পণ্য যোগ করুন</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">ছবি</th>
                      <th className="py-3 px-4">পণ্যের নাম</th>
                      <th className="py-3 px-4">ক্যাটাগরি</th>
                      <th className="py-3 px-4">বিক্রয় মূল্য</th>
                      <th className="py-3 px-4">আসল মূল্য</th>
                      <th className="py-3 px-4">স্টক</th>
                      <th className="py-3 px-4">রেটিং</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <img
                            src={p.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
                          />
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-bold text-gray-900 text-xs line-clamp-1">{p.nameBn}</p>
                          <p className="text-gray-400 text-[11px] truncate">{p.name}</p>
                          {p.badge && (
                            <span className="inline-block bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5">
                              {p.badge}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                            {p.categoryBn}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-emerald-700 text-sm">
                          {formatBDT(p.price)}
                        </td>
                        <td className="py-3 px-4 text-gray-400 line-through">
                          {p.originalPrice ? formatBDT(p.originalPrice) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${p.stock <= 5 ? 'text-rose-600' : 'text-gray-700'}`}>
                            {p.stock} টি
                          </span>
                        </td>
                        <td className="py-3 px-4 text-amber-500 font-bold">
                          ★ {p.rating}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditProduct(p)}
                              className="p-1.5 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="এডিট করুন"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`আপনি কি "${p.nameBn}" পণ্যটি ডিলিট করতে নিশ্চিত?`)) {
                                  onDeleteProduct(p.id);
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="ডিলিট করুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-xs">
                  কোনো পণ্য খুঁজে পাওয়া যায়নি।
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================= TAB 3: ORDER MANAGEMENT ======================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter and Status Sub-tabs */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="অর্ডার নম্বর, গ্রাহকের নাম বা মোবাইল দিয়ে খুঁজুন..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full py-2 pl-9 pr-3 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">
                    মোট অর্ডার: <strong>{filteredOrders.length}</strong> টি
                  </div>

                  {onClearAllOrders && orders.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('আপনি কি নিশ্চিত যে সকল অর্ডার তালিকা মুছে ফেলতে চান?')) {
                          onClearAllOrders();
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] text-rose-700 hover:bg-rose-50 border border-rose-300 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      title="সব অর্ডার ডাটা মুছুন"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>সব অর্ডার মুছুন</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      orderStatusFilter === st
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {st === 'all' ? 'সব অর্ডার' : getStatusLabelBn(st)}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">অর্ডার নং ও সময়</th>
                      <th className="py-3 px-4">গ্রাহকের নাম ও ফোন</th>
                      <th className="py-3 px-4">ডেলিভারি ঠিকানা</th>
                      <th className="py-3 px-4">পণ্য সংখ্যা</th>
                      <th className="py-3 px-4">বিল (COD)</th>
                      <th className="py-3 px-4">বর্তমান স্ট্যাটাস পরিবর্তন</th>
                      <th className="py-3 px-4 text-right">ভিউ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-gray-900 text-xs">
                            #{ord.orderNumber}
                          </p>
                          <span className="text-[11px] text-gray-400">
                            {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-gray-800">{ord.customerName}</p>
                          <a
                            href={`tel:${ord.phone}`}
                            className="text-emerald-700 hover:underline flex items-center gap-1 font-mono text-[11px] mt-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{ord.phone}</span>
                          </a>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="text-gray-700 text-xs line-clamp-1">{ord.address}</p>
                          <p className="text-gray-400 text-[11px]">{ord.district}, {ord.division}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          <span className="font-semibold">{ord.items.length} টি আইটেম</span>
                          <span className="text-[11px] text-gray-400 block truncate max-w-[120px]">
                            {ord.items[0]?.productName}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-emerald-800 text-sm">
                          {formatBDT(ord.total)}
                          <span className="text-[10px] text-gray-400 font-normal block">হাতে পেয়ে টাকা</span>
                        </td>
                        <td className="py-3 px-4">
                          {/* Live Status Selector */}
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold border focus:outline-hidden cursor-pointer ${
                              ord.status === 'delivered'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ord.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : ord.status === 'processing'
                                ? 'bg-blue-50 text-blue-800 border-blue-300'
                                : ord.status === 'shipped'
                                ? 'bg-purple-50 text-purple-800 border-purple-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="pending">অপেক্ষমান (Pending)</option>
                            <option value="processing">প্রসেসিং হচ্ছে (Processing)</option>
                            <option value="shipped">কুরিয়ারে পাঠানো হয়েছে (Shipped)</option>
                            <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                            <option value="cancelled">বাতিল (Cancelled)</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                            title="সম্পূর্ণ অর্ডার মেমো দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-xs">
                  কোনো অর্ডার পাওয়া যায়নি।
                </div>
              )}
            </div>

          </div>
        )}

        {/* ======================= TAB 4: INTEGRATIONS & SETTINGS ======================= */}
        {activeTab === 'integrations' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Telegram Order Notifications Setup */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    টেলিগ্রাম অর্ডার নোটিফিকেশন (Telegram Notifications)
                  </h3>
                  <p className="text-xs text-gray-500">
                    কোনো গ্রাহক অর্ডার করলেই সঙ্গে সঙ্গে টেলিগ্রাম বট আপনার চ্যানেলে বিস্তারিত পাঠিয়ে দেবে
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    টেলিগ্রাম বট টোকেন (Telegram Bot Token):
                  </label>
                  <input
                    type="password"
                    placeholder="যেমন: 123456789:ABCdefGhIJKlmNoPQRstuVWXyz"
                    value={localSettings.telegramBotToken || ''}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, telegramBotToken: e.target.value })
                    }
                    className="w-full py-2 px-3 rounded-xl border border-gray-300 font-mono text-xs focus:outline-hidden focus:border-emerald-600"
                  />
                  <span className="text-[11px] text-gray-400 mt-0.5 block">
                    Telegram @BotFather থেকে বট বানিয়ে টোকেনটি এখানে বসাতে পারেন।
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    টেলিগ্রাম চ্যানেল / গ্রুপ বা ইউজার চ্যাট আইডি (Chat ID):
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: -100123456789 অথবা @your_channel_name"
                    value={localSettings.telegramChatId || ''}
                    onChange={(e) =>
                      setLocalSettings({ ...localSettings, telegramChatId: e.target.value })
                    }
                    className="w-full py-2 px-3 rounded-xl border border-gray-300 font-mono text-xs focus:outline-hidden focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={localSettings.telegramEnabled}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, telegramEnabled: e.target.checked })
                      }
                      className="accent-emerald-600 w-4 h-4 rounded"
                    />
                    <span>টেলিগ্রাম নোটিফিকেশন সক্রিয় রাখুন</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleTestTelegramNotification}
                    disabled={testingTelegram}
                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{testingTelegram ? 'পাঠানো হচ্ছে...' : 'টেস্ট নোটিফিকেশন পাঠান'}</span>
                  </button>

                  <button
                    onClick={handleSaveSettingsClick}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সেভ করুন</span>
                  </button>
                </div>

                {telegramTestMessage && (
                  <p className="text-xs p-2.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
                    {telegramTestMessage}
                  </p>
                )}

                {/* Telegram Log viewer */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <h4 className="font-bold text-gray-700 mb-2">সাম্প্রতিক নোটিফিকেশন লগ:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {telegramLogs.length === 0 ? (
                      <p className="text-gray-400 text-[11px]">এখনো কোনো লগ নেই।</p>
                    ) : (
                      telegramLogs.map((log) => (
                        <div key={log.id} className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-[11px]">
                          <div className="flex justify-between font-bold text-gray-800">
                            <span>অর্ডার #{log.orderNumber}</span>
                            <span className="text-gray-400 font-mono">
                              {new Date(log.sentAt).toLocaleTimeString('bn-BD')}
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1 whitespace-pre-line line-clamp-2">{log.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Supabase Database Readiness Guide */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">
                    Supabase ডাটাবেস প্রস্তুতি
                  </h3>
                  <p className="text-xs text-gray-500">
                    পরবর্তী ধাপে সুপাবেস কানেক্ট করার জন্য প্রস্তুত স্ট্রাকচার ও টেবিল স্কিমা
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-gray-600 leading-relaxed">
                  আমাদের অ্যাপের টাইপস (`Product`, `Order`, `CartItem`) ইতিমধ্যে সুপাবেসের রিলেশনাল টেবিলের সাথে ১০০% সামঞ্জস্যপূর্ণভাবে সাজানো হয়েছে। আপনি যেকোনো সময় আপনার সুপাবেস প্রজেক্টের সাথে এটি সরাসরি যুক্ত করতে পারেন।
                </p>

                <div className="bg-gray-900 text-emerald-400 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
                  <pre>{`-- Supabase SQL Schema for Products & Orders:
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name_bn TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INT DEFAULT 10,
  image TEXT NOT NULL,
  description TEXT
);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  order_number TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending'
);`}</pre>
                </div>

                {/* Store Branding & Contact Settings */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <h4 className="font-bold text-gray-800">দোকানের নাম ও হটলাইন নম্বর:</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">
                        দোকানের নাম:
                      </label>
                      <input
                        type="text"
                        value={localSettings.storeName}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, storeName: e.target.value })
                        }
                        placeholder="E-commerce"
                        className="w-full py-1.5 px-3 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">
                        হটলাইন নম্বর:
                      </label>
                      <input
                        type="text"
                        value={localSettings.storePhone}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, storePhone: e.target.value })
                        }
                        placeholder="01989183031"
                        className="w-full py-1.5 px-3 border border-gray-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Settings */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  <h4 className="font-bold text-gray-800">ডেলিভারি চার্জ কনফিগারেশন:</h4>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">
                        ঢাকা সিটির ভিতরে (টাকা):
                      </label>
                      <input
                        type="number"
                        value={localSettings.deliveryInsideDhaka}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, deliveryInsideDhaka: Number(e.target.value) })
                        }
                        className="w-full py-1.5 px-3 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-600 font-semibold mb-1">
                        ঢাকার বাইরে (টাকা):
                      </label>
                      <input
                        type="number"
                        value={localSettings.deliveryOutsideDhaka}
                        onChange={(e) =>
                          setLocalSettings({ ...localSettings, deliveryOutsideDhaka: Number(e.target.value) })
                        }
                        className="w-full py-1.5 px-3 border border-gray-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-600 font-semibold mb-1">
                      কত টাকার বেশি কেনাকাটায় ফ্রি ডেলিভারি (টাকা):
                    </label>
                    <input
                      type="number"
                      value={localSettings.freeDeliveryThreshold}
                      onChange={(e) =>
                        setLocalSettings({ ...localSettings, freeDeliveryThreshold: Number(e.target.value) })
                      }
                      className="w-full py-1.5 px-3 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>

                  <button
                    onClick={handleSaveSettingsClick}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সেটিংস সেভ করুন</span>
                  </button>

                  {settingsSavedToast && (
                    <p className="text-xs text-emerald-700 font-bold animate-pulse">
                      ✓ সেটিংস সফলভাবে সেভ হয়েছে!
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ======================= PRODUCT ADD / EDIT MODAL ======================= */}
      {productModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-700 text-white">
              <h3 className="text-lg font-black">
                {products.some((p) => p.id === editingProduct.id) ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যোগ করুন (Add Product)'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              {/* Product Name Bangla */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  পণ্যের নাম (বাংলায়) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: টি৯০০ আল্ট্রা ২ কলিং স্মার্টওয়াচ"
                  value={editingProduct.nameBn}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameBn: e.target.value })}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              {/* Product Name English */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  পণ্যের নাম (ইংরেজিতে)
                </label>
                <input
                  type="text"
                  placeholder="e.g. T900 Ultra 2 Smartwatch"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-gray-300 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.nameBn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    হাইলাইট ব্যাজ (যেমন: সেরা অফার, হট ডিল)
                  </label>
                  <input
                    type="text"
                    placeholder="হট ডিল 🔥"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full py-2 px-3 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              {/* Price, Original Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    বিক্রয় মূল্য (৳) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-xl border border-gray-300 font-bold text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 mb-1">
                    আসল মূল্য (কাটা দাগের জন্য ৳)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-xl border border-gray-300 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    স্টক পরিমাণ
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full py-2 px-3 rounded-xl border border-gray-300 font-semibold"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  পণ্যের ছবির লিংক (Image URL) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-gray-300 font-mono"
                />
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-gray-400">প্রিভিউ:</span>
                  <img
                    src={editingProduct.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  পণ্যের বিবরণ
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl border border-gray-300 leading-relaxed"
                ></textarea>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>পণ্য সংরক্ষণ করুন</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================= ORDER DETAIL MEMO MODAL ======================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative my-6 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-800 text-white">
              <div>
                <span className="text-[10px] text-emerald-200 uppercase tracking-wider block">
                  ক্যাশ অন ডেলিভারি ইনভয়েস
                </span>
                <h3 className="text-lg font-black">
                  অর্ডার মেমো: #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-emerald-200 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-7 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Order Meta & Status update */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-gray-500 block">বর্তমান স্ট্যাটাস:</span>
                  <span className="font-bold text-sm text-emerald-800">
                    {getStatusLabelBn(selectedOrder.status)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-600 font-semibold">স্ট্যাটাস পরিবর্তন:</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => {
                      const newSt = e.target.value as OrderStatus;
                      onUpdateOrderStatus(selectedOrder.id, newSt);
                      setSelectedOrder({ ...selectedOrder, status: newSt });
                    }}
                    className="py-1 px-2.5 rounded-lg border border-emerald-300 bg-white font-bold text-emerald-800"
                  >
                    <option value="pending">অপেক্ষমান (Pending)</option>
                    <option value="processing">প্রসেসিং (Processing)</option>
                    <option value="shipped">কুরিয়ারে পাঠানো হয়েছে (Shipped)</option>
                    <option value="delivered">ডেলিভারি সম্পন্ন (Delivered)</option>
                    <option value="cancelled">বাতিল (Cancelled)</option>
                  </select>
                </div>
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="space-y-1">
                  <span className="font-bold text-gray-400 uppercase text-[10px] block">
                    গ্রাহকের তথ্য
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{selectedOrder.customerName}</p>
                  <a
                    href={`tel:${selectedOrder.phone}`}
                    className="text-emerald-700 font-bold flex items-center gap-1 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrder.phone}</span>
                  </a>
                  {selectedOrder.alternativePhone && (
                    <p className="text-gray-500">বিকল্প নম্বর: {selectedOrder.alternativePhone}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="font-bold text-gray-400 uppercase text-[10px] block">
                    ডেলিভারি ঠিকানা
                  </span>
                  <p className="flex items-start gap-1 text-gray-800">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{selectedOrder.address}, {selectedOrder.district}, {selectedOrder.division}</span>
                  </p>
                  <p className="text-emerald-700 font-medium">
                    {selectedOrder.deliveryArea === 'inside_dhaka' ? 'ঢাকার ভেতরে (৬০৳)' : 'ঢাকার বাইরে (১২০৳)'}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
                  অর্ডারকৃত পণ্যের তালিকা
                </h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{item.productName}</p>
                          <p className="text-gray-400 text-[11px]">
                            {formatBDT(item.price)} x {item.quantity} টি
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Calculation */}
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 space-y-1.5">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্য সাব-টোটাল:</span>
                  <span className="font-bold text-gray-800">{formatBDT(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-emerald-700">
                    {selectedOrder.deliveryFee === 0 ? 'ফ্রি' : formatBDT(selectedOrder.deliveryFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-gray-900">ক্যাশ অন ডেলিভারিতে প্রদেয় মোট:</span>
                  <span className="text-xl font-black text-emerald-800">
                    {formatBDT(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {selectedOrder.orderNotes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                  <span className="font-bold block mb-0.5">গ্রাহকের বিশেষ নোট:</span>
                  <p>{selectedOrder.orderNotes}</p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>মেমো প্রিন্ট করুন</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
