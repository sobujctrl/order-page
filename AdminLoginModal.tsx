import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, Lock, ArrowRight, Mail } from 'lucide-react';
import { PRIMARY_ADMIN_EMAIL, isAdminEmail, setCurrentAdminUser } from '../../services/storageService';
import { AdminUser } from '../../types/ecommerce';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [inputEmail, setInputEmail] = useState(PRIMARY_ADMIN_EMAIL);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Authenticate as Admin
  const handleGoogleSignIn = (emailToVerify: string) => {
    setLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setLoading(false);
      if (isAdminEmail(emailToVerify)) {
        const user: AdminUser = {
          uid: 'admin-sobuj-01',
          email: PRIMARY_ADMIN_EMAIL,
          displayName: 'Sobuj (Admin)',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        };
        setCurrentAdminUser(user);
        onLoginSuccess(user);
        onClose();
      } else {
        setErrorMessage('আপনার অনুমতি নেই');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-emerald-200 hover:text-white rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-700 flex items-center justify-center text-emerald-300 mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-black">অ্যাডমিন লগইন (Admin Login)</h3>
          <p className="text-xs text-emerald-200 mt-1">
            শুধুমাত্র অনুমোদিত অ্যাডমিন গুগল অ্যাকাউন্টের মাধ্যমে প্রবেশ করতে পারবেন।
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Authorized Admin Notice */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>অনুমোদিত অ্যাডমিন ইমেইল:</span>
            </div>
            <p className="font-mono bg-white px-2.5 py-1 rounded-md border border-emerald-200 text-emerald-800 font-bold select-all">
              {PRIMARY_ADMIN_EMAIL}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-center gap-2 font-bold animate-shake">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="text-sm font-black">{errorMessage}</span>
            </div>
          )}

          {/* Primary "Google দিয়ে লগইন" button */}
          <div className="space-y-3">
            <button
              onClick={() => handleGoogleSignIn(PRIMARY_ADMIN_EMAIL)}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-emerald-600 rounded-2xl text-gray-800 font-bold text-sm flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {/* Google G logo */}
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'লগইন হচ্ছে...' : 'Google দিয়ে লগইন'}</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="grow border-t border-gray-200"></div>
              <span className="shrink mx-4 text-[10px] text-gray-400 font-semibold uppercase">অন্য অ্যাকাউন্টের পরীক্ষা</span>
              <div className="grow border-t border-gray-200"></div>
            </div>

            {/* Test other email validation */}
            <div className="space-y-2">
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="অন্য ইমেইল লিখুন (যেমন: user@gmail.com)"
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-3 text-xs border border-gray-300 rounded-xl focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              <button
                onClick={() => handleGoogleSignIn(inputEmail)}
                disabled={loading || !inputEmail.trim()}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 active:scale-98 text-gray-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>এই ইমেইল দিয়ে চেষ্টা করুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-[11px] text-center text-gray-400 pt-2 border-t border-gray-100">
            * একবার লগইন করলে এই ডিভাইসে স্বয়ংক্রিয়ভাবে মনে রাখা হবে।
          </p>
        </div>
      </div>
    </div>
  );
};
