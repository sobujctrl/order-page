import React, { useState } from 'react';
import { Order, OrderStatus } from '../../types/ecommerce';
import { formatBDT, getStatusLabelBn } from '../../services/storageService';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone,
  AlertCircle 
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  preSelectedOrder?: Order | null;
  storePhone?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  preSelectedOrder = null,
  storePhone = '01989183031',
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState(
    preSelectedOrder ? preSelectedOrder.orderNumber : ''
  );
  const [activeOrder, setActiveOrder] = useState<Order | null>(preSelectedOrder || null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Strict matching: only match full order number or full 11-digit phone number for privacy
    const found = orders.find((ord) => {
      const matchOrder = ord.orderNumber.toLowerCase() === query ||
        ord.orderNumber.toLowerCase() === `bd-${query}` ||
        `#${ord.orderNumber.toLowerCase()}` === query;
      const matchPhone = ord.phone.replace(/[^0-9]/g, '') === query.replace(/[^0-9]/g, '');
      return matchOrder || matchPhone;
    });

    setActiveOrder(found || null);
  };

  const statusSteps: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
    { key: 'pending', label: 'অর্ডার জমা হয়েছে', icon: Clock },
    { key: 'processing', label: 'অর্ডার প্রসেসিং', icon: Package },
    { key: 'shipped', label: 'কুরিয়ারে পাঠানো হয়েছে', icon: Truck },
    { key: 'delivered', label: 'ডেলিভারি সম্পন্ন', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'processing':
        return 1;
      case 'shipped':
        return 2;
      case 'delivered':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = activeOrder ? getStepIndex(activeOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <Truck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                অর্ডার লাইভ ট্র্যাকিং
              </h2>
              <p className="text-xs text-emerald-200">
                আপনার মোবাইল নম্বর বা অর্ডার নম্বর দিয়ে পার্সেলের বর্তমান অবস্থান জানুন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-6 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="অর্ডার নম্বর (যেমন: BD-84910) বা মোবাইল নম্বর লিখুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 text-sm bg-white border border-gray-300 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              ট্র্যাক করুন
            </button>
          </form>
        </div>

        {/* Tracking Details */}
        <div className="p-5 sm:p-7 max-h-[70vh] overflow-y-auto">
          {activeOrder ? (
            <div className="space-y-6">
              
              {/* Order Status Badge & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    অর্ডার নম্বর: #{activeOrder.orderNumber}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gray-900 mt-0.5">
                    স্ট্যাটাস: <span className="text-emerald-700">{getStatusLabelBn(activeOrder.status)}</span>
                  </h3>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-500 block">মোট বিল (COD):</span>
                  <span className="text-base font-black text-emerald-800">
                    {formatBDT(activeOrder.total)}
                  </span>
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              {activeOrder.status === 'cancelled' ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 shrink-0 text-rose-600" />
                  <div>
                    <h4 className="font-bold text-sm">এই অর্ডারটি বাতিল করা হয়েছে</h4>
                    <p className="text-xs mt-0.5">যে কোনো সহায়তার জন্য আমাদের হটলাইনে যোগাযোগ করুন।</p>
                  </div>
                </div>
              ) : (
                <div className="py-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    ডেলিভারি অগ্রগতি
                  </h4>

                  <div className="relative">
                    {/* Connecting line */}
                    <div className="absolute top-5 left-4 right-4 h-1 bg-gray-200 -z-0 hidden sm:block">
                      <div 
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${(Math.max(0, currentStep) / (statusSteps.length - 1)) * 100}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative z-10">
                      {statusSteps.map((step, idx) => {
                        const Icon = step.icon;
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.key} className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                                  : 'bg-gray-100 text-gray-400 border border-gray-300'
                              } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            <div>
                              <p className={`text-xs font-bold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                                {step.label}
                              </p>
                              <span className="text-[10px] text-gray-400">
                                {isCurrent ? 'চলমান ধাপ' : isDone ? 'সম্পন্ন' : 'অপেক্ষমান'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Destination & Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
                <div>
                  <span className="font-bold text-gray-400 uppercase text-[10px] block mb-1">
                    গ্রাহকের নাম ও ফোন
                  </span>
                  <p className="font-bold text-gray-800">{activeOrder.customerName}</p>
                  <p className="flex items-center gap-1.5 text-gray-600 mt-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeOrder.phone}</span>
                  </p>
                </div>

                <div>
                  <span className="font-bold text-gray-400 uppercase text-[10px] block mb-1">
                    ডেলিভারি ঠিকানা
                  </span>
                  <p className="flex items-start gap-1.5 text-gray-700">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{activeOrder.address}, {activeOrder.district}</span>
                  </p>
                </div>
              </div>

              {/* Items in this order */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  অর্ডারকৃত পণ্য তালিকা
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {activeOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{item.productName}</p>
                          <p className="text-gray-400 text-[11px]">পরিমাণ: {item.quantity} টি</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        {formatBDT(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-300 mx-auto" />
              <h4 className="text-sm font-bold text-gray-700">
                {searched ? 'কোনো অর্ডার খুঁজে পাওয়া যায়নি' : 'অর্ডার নম্বর বা ফোন নম্বর দিয়ে খুঁজুন'}
              </h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                আপনি অর্ডার করার সময় যে ১১ ডিজিটের মোবাইল নম্বরটি দিয়েছিলেন সেটি দিয়ে ট্র্যাকিং করতে পারেন।
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>জরুরি সহায়তা হটলাইন: {storePhone}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold rounded-xl cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
