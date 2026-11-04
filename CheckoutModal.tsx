import React, { useState } from 'react';
import { CartItem, Order, StoreSettings } from '../../types/ecommerce';
import { BANGLADESH_LOCATIONS } from '../../data/mockData';
import { formatBDT } from '../../services/storageService';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  settings: StoreSettings;
  onOrderSuccess: (order: Order) => void;
  onProcessOrder: (orderData: {
    customerName: string;
    phone: string;
    alternativePhone?: string;
    division: string;
    district: string;
    address: string;
    deliveryArea: 'inside_dhaka' | 'outside_dhaka';
    deliveryFee: number;
    paymentMethod: 'cod';
    paymentStatus: 'unpaid';
    orderNotes?: string;
    items: {
      productId: string;
      productName: string;
      price: number;
      quantity: number;
      image: string;
    }[];
    subtotal: number;
    total: number;
    status: 'pending';
  }) => Order;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  settings,
  onOrderSuccess,
  onProcessOrder,
}) => {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternativePhone, setAlternativePhone] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState('ঢাকা সিটি');
  const [address, setAddress] = useState('');
  const [deliveryArea, setDeliveryArea] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Validation & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryFee =
    subtotal >= settings.freeDeliveryThreshold
      ? 0
      : deliveryArea === 'inside_dhaka'
      ? settings.deliveryInsideDhaka
      : settings.deliveryOutsideDhaka;

  const total = subtotal + deliveryFee;

  // Handle division change to update districts
  const currentDivisionObj = BANGLADESH_LOCATIONS.find(
    (d) => d.division === selectedDivision
  ) || BANGLADESH_LOCATIONS[0];

  const handleDivisionChange = (div: string) => {
    setSelectedDivision(div);
    const divObj = BANGLADESH_LOCATIONS.find((d) => d.division === div);
    if (divObj && divObj.districts.length > 0) {
      setSelectedDistrict(divObj.districts[0].nameBn);
    }
    // Auto toggle delivery area based on division
    if (div === 'Dhaka') {
      setDeliveryArea('inside_dhaka');
    } else {
      setDeliveryArea('outside_dhaka');
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName = 'অনুগ্রহ করে আপনার সঠিক নাম লিখুন';
    }

    // BD Phone validation: 11 digits starting with 01
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      errs.phone = 'মোবাইল নম্বর আবশ্যক';
    } else if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01712345678)';
    }

    if (!address.trim() || address.trim().length < 8) {
      errs.address = 'অনুগ্রহ করে বাড়ির নম্বর, রোড, এলাকা সহ বিস্তারিত ঠিকানা দিন';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        alternativePhone: alternativePhone.trim() || undefined,
        division: selectedDivision,
        district: selectedDistrict,
        address: address.trim(),
        deliveryArea,
        deliveryFee,
        paymentMethod: 'cod' as const,
        paymentStatus: 'unpaid' as const,
        orderNotes: orderNotes.trim() || undefined,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.nameBn,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
        subtotal,
        total,
        status: 'pending' as const,
      };

      const newOrder = onProcessOrder(orderPayload);

      try {
        const webhookUrl = import.meta.env.VITE_LEAD_WEBHOOK_URL;
        if (webhookUrl) {
          fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: customerName.trim(),
              phone: phone.trim(),
              address: address.trim(),
              products: cartItems.map((item) => ({
                name: item.product.nameBn,
                qty: item.quantity,
              })),
              total,
              note: orderNotes.trim() || undefined,
              pageUrl: window.location.href,
            }),
          }).catch((err) => {
            console.error('Webhook POST failed:', err);
          });
        }
      } catch (webhookErr) {
        console.error('Webhook error:', webhookErr);
      }

      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative my-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <Truck className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                অর্ডার সম্পন্ন করুন (ক্যাশ অন ডেলিভারি)
              </h2>
              <p className="text-xs text-emerald-200">
                পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন • কোনো অগ্রিম টাকা লাগবে না
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

        {/* Content Grid */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              <span>আপনার ডেলিভারি তথ্য দিন</span>
            </h3>

            {/* Customer Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                আপনার পুরো নাম <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: মো: তানভীর আহমেদ"
                value={customerName}
                onChange={(e) => {
                  setCustomerName(e.target.value);
                  if (errors.customerName) setErrors({ ...errors, customerName: '' });
                }}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-sm focus:outline-hidden transition-all ${
                  errors.customerName
                    ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500'
                    : 'border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200'
                }`}
              />
              {errors.customerName && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.customerName}</span>
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  মোবাইল নম্বর <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="01712345678"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    className={`w-full py-2.5 pl-9 pr-3 rounded-xl border text-sm focus:outline-hidden transition-all ${
                      errors.phone
                        ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500'
                        : 'border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-rose-600 text-[11px] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.phone}</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  বিকল্প ফোন নম্বর (ঐচ্ছিক)
                </label>
                <input
                  type="tel"
                  placeholder="জরুরি যোগাযোগের জন্য"
                  value={alternativePhone}
                  onChange={(e) => setAlternativePhone(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-300 text-sm focus:outline-hidden focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Division & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  বিভাগ নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-300 text-sm bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {BANGLADESH_LOCATIONS.map((div) => (
                    <option key={div.division} value={div.division}>
                      {div.divisionBn} বিভাগ
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  জেলা / শহর <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-xl border border-gray-300 text-sm bg-white focus:outline-hidden focus:border-emerald-600"
                >
                  {currentDivisionObj.districts.map((dist) => (
                    <option key={dist.nameEn} value={dist.nameBn}>
                      {dist.nameBn}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delivery Zone Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                ডেলিভারি এরিয়া বেছে নিন <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${
                    deliveryArea === 'inside_dhaka'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">ঢাকা সিটির ভিতরে</span>
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryArea === 'inside_dhaka'}
                      onChange={() => setDeliveryArea('inside_dhaka')}
                      className="accent-emerald-600"
                    />
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 mt-1">
                    {formatBDT(settings.deliveryInsideDhaka)} (১-২ দিন)
                  </span>
                </label>

                <label
                  className={`p-3 rounded-xl border flex flex-col cursor-pointer transition-all ${
                    deliveryArea === 'outside_dhaka'
                      ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">ঢাকার বাইরে (সারাদেশ)</span>
                    <input
                      type="radio"
                      name="deliveryZone"
                      checked={deliveryArea === 'outside_dhaka'}
                      onChange={() => setDeliveryArea('outside_dhaka')}
                      className="accent-emerald-600"
                    />
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 mt-1">
                    {formatBDT(settings.deliveryOutsideDhaka)} (২-৪ দিন)
                  </span>
                </label>
              </div>
            </div>

            {/* Full Detailed Address */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  placeholder="বাসা নং, রোড নং, বাড়ি/মহল্লা, ল্যান্ডমার্ক বা পোস্ট অফিস লিখুন..."
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors({ ...errors, address: '' });
                  }}
                  className={`w-full py-2.5 pl-9 pr-3 rounded-xl border text-sm focus:outline-hidden transition-all ${
                    errors.address
                      ? 'border-rose-300 bg-rose-50/40 focus:border-rose-500'
                      : 'border-gray-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-200'
                  }`}
                ></textarea>
              </div>
              {errors.address && (
                <p className="text-rose-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.address}</span>
                </p>
              )}
            </div>

            {/* Order Note */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-gray-400" />
                <span>ডেলিভারি বিষয়ে কোনো বিশেষ নির্দেশিকা (ঐচ্ছিক)</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: অফিস টাইমে ডেলিভারি বা নির্দিষ্ট সময়..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-gray-300 text-xs focus:outline-hidden focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation */}
          <div className="lg:col-span-5 bg-gray-50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between border border-gray-200">
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                অর্ডার সারসংক্ষেপ
              </h3>

              {/* Items List */}
              <div className="divide-y divide-gray-200 max-h-48 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <img
                        src={item.product.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-bold text-gray-800 truncate">{item.product.nameBn}</p>
                        <p className="text-gray-400 text-[11px]">
                          {formatBDT(item.product.price)} x {item.quantity} টি
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900 shrink-0">
                      {formatBDT(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculations */}
              <div className="pt-4 border-t border-gray-200 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>পণ্য উপ-মোট:</span>
                  <span className="font-bold text-gray-900">{formatBDT(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ডেলিভারি চার্জ:</span>
                  <span className="font-bold text-emerald-700">
                    {deliveryFee === 0 ? 'ফ্রি ডেলিভারি' : formatBDT(deliveryFee)}
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-300 flex justify-between items-baseline">
                  <span className="text-sm font-black text-gray-900">সর্বমোট প্রদেয় বিল:</span>
                  <span className="text-xl font-black text-emerald-700">{formatBDT(total)}</span>
                </div>
              </div>

              {/* Payment Method Badge */}
              <div className="mt-4 p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">
                      ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      ডেলিভারি ম্যানের কাছ থেকে পণ্য বুঝে নিয়ে মূল্য পরিশোধ করুন।
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust message & Hotline */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>আপনার তথ্য সম্পূর্ণ সুরক্ষিত থাকবে এবং দ্রুত ডেলিভারি নিশ্চিত করা হবে।</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-emerald-800">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>অর্ডারে সহায়তার হটলাইন:</span>
                  </div>
                  <a href={`tel:${settings.storePhone.replace(/[^0-9]/g, '') || '01989183031'}`} className="font-bold hover:underline">
                    {settings.storePhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Confirm Order Button */}
            <div className="mt-6 pt-3 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white rounded-xl font-bold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>অর্ডার কনফার্ম করুন ({formatBDT(total)})</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-center text-gray-400 mt-2">
                * বোতামে চাপ দিয়ে আপনার অর্ডারটি আমাদের সিস্টেমে পাঠিয়ে দিন
              </p>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
