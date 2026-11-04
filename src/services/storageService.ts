import { Product, Order, CartItem, StoreSettings, OrderStatus } from '../types/ecommerce';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/mockData';

const STORAGE_KEYS = {
  PRODUCTS: 'ecom_products_v1',
  ORDERS: 'ecom_orders_v1',
  CART: 'ecom_cart_v1',
  SETTINGS: 'ecom_settings_v2',
  TELEGRAM_LOGS: 'ecom_telegram_logs_v1',
};

export interface TelegramLog {
  id: string;
  orderNumber: string;
  sentAt: string;
  message: string;
  status: 'simulated' | 'sent' | 'failed';
}

// Format Bangladeshi Taka
export function formatBDT(amount: number): string {
  return `৳${amount.toLocaleString('en-IN')}`;
}

// Convert English digits to Bengali numerals if needed
export function toBengaliNumber(num: number | string): string {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num
    .toString()
    .replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

// Generate random order number like BD-89324
export function generateOrderNumber(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `BD-${randomNum}`;
}

// Products CRUD
export function getProducts(): Product[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(data);
  } catch (e) {
    console.error('Error reading products from storage:', e);
    return INITIAL_PRODUCTS;
  }
}

export function saveProduct(product: Product): Product[] {
  const current = getProducts();
  const existingIndex = current.findIndex((p) => p.id === product.id);
  let updated: Product[];

  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = product;
  } else {
    updated = [product, ...current];
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  return updated;
}

export function deleteProduct(productId: string): Product[] {
  const current = getProducts();
  const updated = current.filter((p) => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  return updated;
}

export function resetProducts(): Product[] {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

export const PRIMARY_ADMIN_EMAIL = 'sobujbd679@gmail.com';

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
}

const STORAGE_KEYS_AUTH = 'ecom_admin_user_v1';

export function getCurrentAdminUser(): { uid: string; email: string; displayName: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_AUTH);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (isAdminEmail(user.email)) return user;
    return null;
  } catch {
    return null;
  }
}

export function setCurrentAdminUser(user: { uid: string; email: string; displayName: string } | null): void {
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS_AUTH);
  } else {
    localStorage.setItem(STORAGE_KEYS_AUTH, JSON.stringify(user));
  }
}

// Orders CRUD
export function getOrders(): Order[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
      return [];
    }
    const parsed: Order[] = JSON.parse(data);
    // Purge any lingering sample orders
    const cleaned = parsed.filter(
      (ord) => !['ord-101', 'ord-102', 'ord-103'].includes(ord.id) &&
               !['BD-84910', 'BD-84909', 'BD-84882'].includes(ord.orderNumber)
    );
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    console.error('Error reading orders from storage:', e);
    return [];
  }
}

export function clearAllOrders(): Order[] {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  return [];
}

export function createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'statusHistory'>): Order {
  const current = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: `ord-${Date.now()}`,
    orderNumber: generateOrderNumber(),
    createdAt: new Date().toISOString(),
    statusHistory: [
      {
        status: orderData.status,
        timestamp: new Date().toISOString(),
        note: 'ক্যাশ অন ডেলিভারিতে অর্ডার জমা পড়েছে।'
      }
    ]
  };

  const updated = [newOrder, ...current];
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

  // Trigger simulated/real Telegram notification
  sendTelegramNotification(newOrder);

  return newOrder;
}

export function updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order[] {
  const current = getOrders();
  const updated = current.map((ord) => {
    if (ord.id === orderId) {
      const history = ord.statusHistory || [];
      return {
        ...ord,
        status: newStatus,
        paymentStatus: newStatus === 'delivered' ? ('paid' as const) : ord.paymentStatus,
        statusHistory: [
          ...history,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            note: note || `অর্ডার স্ট্যাটাস আপডেট করা হয়েছে: ${getStatusLabelBn(newStatus)}`
          }
        ]
      };
    }
    return ord;
  });

  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  return updated;
}

export function getStatusLabelBn(status: OrderStatus): string {
  switch (status) {
    case 'pending':
      return 'অপেক্ষমান (Pending)';
    case 'processing':
      return 'প্রসেসিং হচ্ছে (Processing)';
    case 'shipped':
      return 'কুরিয়ারে পাঠানো হয়েছে (Shipped)';
    case 'delivered':
      return 'ডেলিভারি সম্পন্ন (Delivered)';
    case 'cancelled':
      return 'বাতিল (Cancelled)';
    default:
      return status;
  }
}

// Cart Storage
export function getStoredCart(): CartItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(cart: CartItem[]): void {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
}

// Settings
export function getSettings(): StoreSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS) || localStorage.getItem('ecom_settings_v1');
    if (!data) return INITIAL_SETTINGS;
    const parsed = JSON.parse(data);
    if (!parsed.storePhone || parsed.storePhone === '০১৭০০-১২৩৪৫৬' || parsed.storePhone === '(আপনার নম্বর)' || parsed.storePhone === '01XXXXXXXXX') {
      parsed.storePhone = '01989183031';
    }
    if (!parsed.storeName || parsed.storeName === 'E-commerce (ই-কমার্স)' || parsed.storeName === '(আপনার দোকানের নাম)' || parsed.storeName === 'XXXXXX') {
      parsed.storeName = 'E-commerce';
    }
    const merged = { ...INITIAL_SETTINGS, ...parsed };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
    return merged;
  } catch {
    return INITIAL_SETTINGS;
  }
}

export function saveSettings(settings: StoreSettings): StoreSettings {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  return settings;
}

// Telegram Notifications Simulation / Dispatch
export async function sendTelegramNotification(order: Order): Promise<TelegramLog> {
  const settings = getSettings();
  
  const itemsText = order.items
    .map((item, idx) => `${idx + 1}. ${item.productName} (${item.quantity}টি x ${formatBDT(item.price)})`)
    .join('\n');

  const deliveryAreaBn = order.deliveryArea === 'inside_dhaka' ? 'ঢাকার ভেতরে (৬০৳)' : 'ঢাকার বাইরে (১২০৳)';
  const message = `🔔 *নতুন অনলাইন অর্ডার এসেছে!* (#${order.orderNumber})
━━━━━━━━━━━━━━━━━━
👤 *গ্রাহক:* ${order.customerName}
📞 *ফোন নম্বর:* ${order.phone}
📍 *ঠিকানা:* ${order.address}, ${order.district}
🚚 *ডেলিভারি জোন:* ${deliveryAreaBn}
💵 *পেমেন্ট পদ্ধতি:* ক্যাশ অন ডেলিভারি (হাতে পেয়ে টাকা)

📦 *অর্ডারকৃত পণ্যসমূহ:*
${itemsText}

💰 *উপ-মোট:* ${formatBDT(order.subtotal)}
🚚 *ডেলিভারি চার্জ:* ${formatBDT(order.deliveryFee)}
✨ *সর্বমোট বিল:* ${formatBDT(order.total)}

📝 *বিশেষ নোট:* ${order.orderNotes || 'নেই'}
⏰ *সময়:* ${new Date(order.createdAt).toLocaleString('bn-BD')}`;

  let status: 'simulated' | 'sent' | 'failed' = 'simulated';

  // If real Telegram credentials are configured in settings
  if (settings.telegramEnabled && settings.telegramBotToken && settings.telegramChatId) {
    try {
      const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.telegramChatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      if (res.ok) {
        status = 'sent';
      } else {
        status = 'failed';
      }
    } catch {
      status = 'failed';
    }
  }

  const log: TelegramLog = {
    id: `tg-${Date.now()}`,
    orderNumber: order.orderNumber,
    sentAt: new Date().toISOString(),
    message,
    status
  };

  try {
    const existingLogs = getTelegramLogs();
    const updatedLogs = [log, ...existingLogs.slice(0, 20)];
    localStorage.setItem(STORAGE_KEYS.TELEGRAM_LOGS, JSON.stringify(updatedLogs));
  } catch (e) {
    console.error('Failed to save telegram log:', e);
  }

  return log;
}

export function getTelegramLogs(): TelegramLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TELEGRAM_LOGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
