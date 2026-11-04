import React from 'react';
import { Order } from '../../types/ecommerce';
import { formatBDT } from '../../services/storageService';
import { 
  CheckCircle, 
  Package, 
  MapPin, 
  Phone, 
  Printer, 
  ArrowRight, 
  Send, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
  storePhone?: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
  storePhone = '01989183031',
}) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Success Banner */}
        <div className="bg-emerald-600 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xs text-white mx-auto flex items-center justify-center mb-3">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            অভিনন্দন! আপনার অর্ডারটি নিশ্চিত হয়েছে
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            আমরা খুব শীঘ্রই আপনার ঠিকানায় ক্যাশ অন ডেলিভারিতে পণ্য পৌঁছে দেব।
          </p>

          <div className="inline-block mt-4 bg-white/15 backdrop-blur-xs border border-white/25 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider">
            অর্ডার নম্বর: #{order.orderNumber}
          </div>
        </div>

        {/* Telegram Notification Toast Banner */}
        <div className="bg-teal-50 border-b border-teal-100 px-5 py-2.5 flex items-center justify-between text-xs text-teal-800">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-teal-600 animate-pulse" />
            <span className="font-semibold">
              টেলিগ্রাম নোটিফিকেশন সিস্টেম প্রস্তুত: অর্ডারের বিবরণ অ্যাডমিনের কাছে সফলভাবে জমা হয়েছে
            </span>
          </div>
          <span className="text-[11px] bg-teal-200/60 px-2 py-0.5 rounded font-mono">
            {new Date(order.createdAt).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Order Details Body */}
        <div className="p-5 sm:p-7 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Customer & Delivery Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-gray-400 uppercase tracking-wider block text-[10px]">
                গ্রাহকের তথ্য:
              </span>
              <p className="font-bold text-gray-900 text-sm">{order.customerName}</p>
              <p className="flex items-center gap-1.5 text-gray-600">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{order.phone}</span>
              </p>
              {order.alternativePhone && (
                <p className="text-gray-500">বিকল্প নম্বর: {order.alternativePhone}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-gray-400 uppercase tracking-wider block text-[10px]">
                ডেলিভারি ঠিকানা:
              </span>
              <p className="flex items-start gap-1.5 text-gray-800">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{order.address}, {order.district}, {order.division}</span>
              </p>
              <p className="text-emerald-700 font-medium">
                এলাকা: {order.deliveryArea === 'inside_dhaka' ? 'ঢাকা সিটির ভেতরে' : 'ঢাকার বাইরে'}
              </p>
            </div>
          </div>

          {/* Ordered Items Table */}
          <div>
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>অর্ডারকৃত পণ্যসমূহ ({order.items.length} টি)</span>
            </h4>

            <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50/50">
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <img
                      src={item.image}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-gray-800 truncate">{item.productName}</p>
                      <p className="text-gray-400 text-[11px]">
                        {formatBDT(item.price)} x {item.quantity} টি
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900 shrink-0">
                    {formatBDT(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-xs space-y-1.5">
            <div className="flex justify-between text-gray-600">
              <span>পণ্য উপ-মোট:</span>
              <span className="font-bold text-gray-800">{formatBDT(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>ডেলিভারি চার্জ:</span>
              <span className="font-bold text-emerald-700">
                {order.deliveryFee === 0 ? 'ফ্রি' : formatBDT(order.deliveryFee)}
              </span>
            </div>
            <div className="pt-2 border-t border-emerald-200/80 flex justify-between items-baseline text-sm">
              <span className="font-bold text-gray-900">ডেলিভারিতে প্রদেয় মোট টাকা:</span>
              <span className="text-xl font-black text-emerald-800">{formatBDT(order.total)}</span>
            </div>
            <div className="pt-1 text-[11px] text-emerald-800 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা পরিশোধ করবেন)</span>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে কল করে অর্ডার নিশ্চিত করবে এবং পার্সেল পাঠিয়ে দেবে।
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 self-start sm:self-auto shrink-0">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>হটলাইন: {storePhone}</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>রিসিট প্রিন্ট করুন</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => {
                onTrackOrder(order);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors cursor-pointer"
            >
              অর্ডার ট্র্যাক করুন
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <span>আরও কেনাকাটা করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
