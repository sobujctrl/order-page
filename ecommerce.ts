export interface Product {
  id: string;
  name: string;
  nameBn: string;
  category: string;
  categoryBn: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  additionalImages?: string[];
  description: string;
  features?: string[];
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  badge?: string; // e.g. 'ধামাকা অফার', 'সেরা বিক্রি', 'নতুন'
  unit?: string; // e.g. '১টি', '১ কেজি', '১ সেট'
  sku?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "BD-84729"
  createdAt: string;
  customerName: string;
  phone: string;
  alternativePhone?: string;
  division: string;
  district: string;
  address: string;
  deliveryArea: 'inside_dhaka' | 'outside_dhaka';
  deliveryFee: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentStatus: 'unpaid' | 'paid';
  orderNotes?: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  statusHistory?: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  nameEn: string;
  iconName: string;
  itemCount: number;
  image: string;
  color: string;
}

export interface BangladeshLocation {
  division: string;
  divisionBn: string;
  districts: {
    nameEn: string;
    nameBn: string;
  }[];
}

export interface StoreSettings {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryThreshold: number;
  telegramEnabled: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;
  supabaseConfigured: boolean;
  adminEmail: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}
