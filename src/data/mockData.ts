import { Product, Category, BangladeshLocation, Order, StoreSettings } from '../types/ecommerce';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'gadgets',
    nameBn: 'গ্যাজেট ও ইলেকট্রনিক্স',
    nameEn: 'Gadgets & Electronics',
    iconName: 'Smartphone',
    itemCount: 18,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=400&q=80',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'cat-2',
    slug: 'fashion',
    nameBn: 'ফ্যাশন ও লাইফস্টাইল',
    nameEn: 'Fashion & Lifestyle',
    iconName: 'Shirt',
    itemCount: 24,
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=400&q=80',
    color: 'bg-teal-50 text-teal-700 border-teal-200'
  },
  {
    id: 'cat-3',
    slug: 'grocery',
    nameBn: 'অর্গানিক ও খাঁটি খাবার',
    nameEn: 'Organic & Pure Food',
    iconName: 'Apple',
    itemCount: 15,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  {
    id: 'cat-4',
    slug: 'home-kitchen',
    nameBn: 'হোম ও কিচেন অ্যাপ্লায়েন্স',
    nameEn: 'Home & Kitchen',
    iconName: 'Home',
    itemCount: 16,
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&q=80',
    color: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'cat-5',
    slug: 'beauty',
    nameBn: 'রূপচর্চা ও বিউটি কেয়ার',
    nameEn: 'Beauty & Personal Care',
    iconName: 'Sparkles',
    itemCount: 12,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
    color: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'cat-6',
    slug: 'watch-jewelry',
    nameBn: 'ঘড়ি ও এক্সেসরিজ',
    nameEn: 'Watches & Accessories',
    iconName: 'Watch',
    itemCount: 10,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'T900 Ultra 2 Smartwatch - HD Display with Calling',
    nameBn: 'টি৯০০ আল্ট্রা ২ ব্লুটুথ কলিং স্মার্টওয়াচ',
    category: 'gadgets',
    categoryBn: 'গ্যাজেট ও ইলেকট্রনিক্স',
    price: 1350,
    originalPrice: 2200,
    discountPercent: 38,
    rating: 4.8,
    reviewCount: 124,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80'
    ],
    description: '২.০৯ ইঞ্চি ফুল এইচডি বেজেললেস ডিসপ্লে। ওয়াটারপ্রুফ ডিজাইন এবং শক্তিশালী ব্যাটারি ব্যাকআপ। সরাসরি ঘড়ি থেকেই কথা বলার ব্লুটুথ কলিং সুবিধা। হার্ট রেট, অক্সিজেন ও স্লিপ ট্র্যাকার সংযুক্ত।',
    features: ['ব্লুটুথ ৫.২ কলিং সুবিধা', '২.০৯ ইঞ্চি সুপার এইচডি ডিসপ্লে', 'ওয়্যারলেস ফাস্ট চার্জিং', 'IP67 ওয়াটার রেজিস্ট্যান্স', 'ব্যাটারি ব্যাকআপ ৩-৫ দিন'],
    isFeatured: true,
    isFlashDeal: true,
    badge: 'সেরা অফার 🔥',
    unit: '১ পিস',
    sku: 'ECOM-WCH-01'
  },
  {
    id: 'prod-2',
    name: 'M10 TWS Bluetooth Earbuds with 2000mAh Power Bank Case',
    nameBn: 'এম১০ টিডব্লিউএস অরিজিনাল ব্লুটুথ ইয়ারবাডস',
    category: 'gadgets',
    categoryBn: 'গ্যাজেট ও ইলেকট্রনিক্স',
    price: 550,
    originalPrice: 950,
    discountPercent: 42,
    rating: 4.6,
    reviewCount: 310,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=600&q=80'
    ],
    description: 'এইচডি ডিজিটাল এলইডি ডিসপ্লে। হাই-ফাই স্টেরিও সুপার বাস মিউজিক সাউন্ড। কেসিংটি মোবাইল ইমার্জেন্সি চার্জের জন্য পাওয়ার ব্যাংক হিসেবেও ব্যবহারযোগ্য। নয়েজ ক্যান্সেলেশন প্রযুক্তি।',
    features: ['৯ডি হাইফাই স্টেরিও সুপার বাস', '২০০০ এমএএইচ চার্জিং কেস (পাওয়ার ব্যাংক)', 'এলইডি ডিজিটাল ব্যাটারি পারসেন্টেজ', 'টাচ কন্ট্রোল ও ভয়েস অ্যাসিস্ট্যান্ট'],
    isFeatured: true,
    isFlashDeal: true,
    badge: 'হট ডিল',
    unit: '১ সেট',
    sku: 'ECOM-TWS-02'
  },
  {
    id: 'prod-3',
    name: 'Sundarban Raw Natural Organic Honey 500g',
    nameBn: 'সুন্দরবনের খাঁটি প্রাকৃতিক মধু (৫০০ গ্রাম)',
    category: 'grocery',
    categoryBn: 'অর্গানিক ও খাঁটি খাবার',
    price: 650,
    originalPrice: 800,
    discountPercent: 19,
    rating: 4.9,
    reviewCount: 88,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    description: 'সুন্দরবনের গভীর জঙ্গল থেকে মোয়ালদের দ্বারা সংগ্রহ করা শতভাগ খাঁটি ও প্রাকৃতিক মধু। কোনো প্রকার চিনি বা কৃত্রিম মিষ্টি মুক্ত। নিয়মিত মধু সেবনে রোগ প্রতিরোধ ক্ষমতা ও কর্মক্ষমতা বৃদ্ধি পায়।',
    features: ['১০০% খাঁটি ও প্রাকৃতিক সুন্দরবনের মধু', 'রাসায়নিক ও প্রিজারভেটিভ মুক্ত', 'স্বাস্থ্যকর কাচের বয়ামে প্যাকড', 'ল্যাব টেস্টে পরীক্ষিত'],
    isFeatured: true,
    isFlashDeal: false,
    badge: '১০০% খাঁটি',
    unit: '৫০০ গ্রাম',
    sku: 'ECOM-HNY-03'
  },
  {
    id: 'prod-4',
    name: 'Premium Semi-Pure Mustard Oil (ঘানি ভাঙা সরিষার তেল) 1 Litre',
    nameBn: 'খাঁটি কাঠের ঘানি ভাঙা সরিষার তেল (১ লিটার)',
    category: 'grocery',
    categoryBn: 'অর্গানিক ও খাঁটি খাবার',
    price: 320,
    originalPrice: 380,
    discountPercent: 16,
    rating: 4.9,
    reviewCount: 95,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    description: 'বাছাইকৃত দেশি মাঘী সরিষা থেকে কাঠের ঘানিতে মৃদু চাপে নিষ্কাশিত ঝাঁঝালো ও স্বাস্থ্যসম্মত সরিষার তেল। খাঁটি স্বাদ ও ঐতিহ্যবাহী রান্নার প্রকৃত সুবাস ফিরিয়ে দেয়।',
    features: ['কাঠের ঘানিতে কোল্ড প্রেসড', 'প্রাকৃতিক ঝাঁঝ ও উজ্জ্বল সোনালী রঙ', 'কোলেস্টেরল মুক্ত ও হৃদযন্ত্রের জন্য উপকারী', 'কোনো ভেজাল নেই'],
    isFeatured: false,
    isFlashDeal: false,
    badge: 'স্বাস্থ্যকর',
    unit: '১ লিটার',
    sku: 'ECOM-OIL-04'
  },
  {
    id: 'prod-5',
    name: 'Mens Premium Cotton Embroidered Panjabi',
    nameBn: 'প্রিমিয়াম সুতি সেমি-লং ডিজিটাল কাজ করা পাঞ্জাবি',
    category: 'fashion',
    categoryBn: 'ফ্যাশন ও লাইফস্টাইল',
    price: 1850,
    originalPrice: 2800,
    discountPercent: 34,
    rating: 4.7,
    reviewCount: 62,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=600&q=80',
    description: '১০০% সুতি আরামদায়ক কাপড়ে প্রিমিয়াম কলার ও বুকের এমব্রয়ডারি ওয়ার্ক। শুক্রবারের জুমার নামাজ, ঈদ ও যেকোন পারিবারিক অনুষ্ঠানে পরার উপযোগী আভিজাত্যপূর্ণ লুক।',
    features: ['১০০% কটন কাপড়', 'কম্ফোর্ট স্লিম ফিট কাটিং', 'উচ্চমানের বাটন ফিনিশিং', 'রং ওঠার ভয় নেই'],
    isFeatured: true,
    isFlashDeal: true,
    badge: 'সেরা বিক্রি',
    unit: '১ পিস',
    sku: 'ECOM-PJB-05'
  },
  {
    id: 'prod-6',
    name: 'Traditional Jamdani Saree with Matching Blouse Piece',
    nameBn: 'আভিজাত্যপূর্ণ হ্যান্ডলুম ঢাকাই জামদানি শাড়ি',
    category: 'fashion',
    categoryBn: 'ফ্যাশন ও লাইফস্টাইল',
    price: 2450,
    originalPrice: 3900,
    discountPercent: 37,
    rating: 4.9,
    reviewCount: 54,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    description: 'আমাদের নিজস্ব দক্ষ তাঁতিদের নিখুঁত বুননে তৈরি ঢাকাই জামদানি শাড়ি। বিয়ে, উৎসব কিংবা উপহার দেওয়ার জন্য সেরা পছন্দ। নরম এবং শরীরে খুব সুন্দরভাবে বসে।',
    features: ['আরামদায়ক সফট ফেব্রিক', '১২ হাত বহর শাড়ি', 'ম্যাচিং ব্লাউজ পিস অন্তর্ভুক্ত', 'হালকা ও সহজে পরিধেয়'],
    isFeatured: true,
    isFlashDeal: false,
    badge: 'ঐতিহ্যবাহী',
    unit: '১ সেট',
    sku: 'ECOM-SRE-06'
  },
  {
    id: 'prod-7',
    name: 'Portable USB Rechargeable Mini Fruit Juicer Blender',
    nameBn: 'পোর্টেবল ইউএসবি রিচার্জেবল মিনি জুসার ব্লেন্ডার',
    category: 'home-kitchen',
    categoryBn: 'হোম ও কিচেন অ্যাপ্লায়েন্স',
    price: 890,
    originalPrice: 1400,
    discountPercent: 36,
    rating: 4.5,
    reviewCount: 142,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=600&q=80',
    description: 'মাত্র ৩০ সেকেন্ডে তৈরি করুন টাটকা ফ্রুট জুস, মিল্কশেক বা প্রোটিন শেক। ৬টি স্টেইনলেস স্টিল ব্লেড এবং শক্তিশালী রিচার্জেবল ব্যাটারি। ভ্রমণ, অফিস বা জিমে সাথে নেওয়ার জন্য পারফেক্ট।',
    features: ['৬ টি শক্ত স্টেইনলেস স্টিল ব্লেড', 'ইউএসবি টাইপ-সি ফাস্ট চার্জিং', '৩৮০ মিলি ক্যাপাসিটি', 'ফুড-গ্রেড নন-টক্সিক ম্যাটেরিয়াল'],
    isFeatured: true,
    isFlashDeal: true,
    badge: 'জনপ্রিয়',
    unit: '১ পিস',
    sku: 'ECOM-JCR-07'
  },
  {
    id: 'prod-8',
    name: 'Electric Stainless Steel Cordless Fast Boil Kettle 2L',
    nameBn: '২ লিটার স্টেইনলেস স্টিল ইলেকট্রিক কেটলি',
    category: 'home-kitchen',
    categoryBn: 'হোম ও কিচেন অ্যাপ্লায়েন্স',
    price: 950,
    originalPrice: 1500,
    discountPercent: 37,
    rating: 4.7,
    reviewCount: 78,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1594213114663-ddf4f24cf710?auto=format&fit=crop&w=600&q=80',
    description: 'মাত্র ৩ মিনিটে দ্রুত পানি গরম করুন। অটোমেটিক শাট-অফ সুবিধা থাকায় পানি ফুটে উঠলেই নিজে থেকেই বন্ধ হয়ে যায়। চা, কফি, নুডুলস এবং শিশুদের খাবার তৈরির জন্য অত্যন্ত নিরাপদ।',
    features: ['২.০ লিটার ধারণক্ষমতা', '১৫০০ ওয়াট ফাস্ট হিটিং এলিমেন্ট', 'অটো শাট-অফ ও ড্রাই বয়েল প্রোটেকশন', '৩৬০ ডিগ্রি রোটেটিং বেস'],
    isFeatured: false,
    isFlashDeal: false,
    badge: 'টেকসই',
    unit: '১ পিস',
    sku: 'ECOM-KTL-08'
  },
  {
    id: 'prod-9',
    name: 'Soothing Aloe Vera 99% Moisturizing Gel 300ml',
    nameBn: 'অর্গানিক ৯৯% অ্যালোভেরা সুদিং ময়েশ্চারাইজিং জেল',
    category: 'beauty',
    categoryBn: 'রূপচর্চা ও বিউটি কেয়ার',
    price: 450,
    originalPrice: 700,
    discountPercent: 36,
    rating: 4.8,
    reviewCount: 165,
    stock: 65,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
    description: 'ত্বকের উজ্জ্বলতা বৃদ্ধি ও রোদে পোড়া ভাব দূর করতে শতভাগ কার্যকর। ত্বকে ব্রণের দাগ হালকা করে এবং ত্বক রাখে কোমল, মসৃণ ও হাইড্রেটেড। চুল পড়া বন্ধ করতে ও কন্ডিশনার হিসেবেও উপযোগী।',
    features: ['৯৯% প্রাকৃতিক খাঁটি অ্যালোভেরা রস', 'ত্বক ও চুলের দ্বিমুখী যত্ন', 'অল স্কিন টাইপের জন্য নিরাপদ', 'অ্যালকোহল ও প্যারাবেন মুক্ত'],
    isFeatured: true,
    isFlashDeal: false,
    badge: 'বেস্ট সেলার',
    unit: '৩০০ মিলি',
    sku: 'ECOM-ALO-09'
  },
  {
    id: 'prod-10',
    name: '20,000mAh PD 22.5W Fast Charging Power Bank with Digital Screen',
    nameBn: '২০,০০০ এমএএইচ ফাস্ট চার্জিং ডিজিটাল পাওয়ার ব্যাংক',
    category: 'gadgets',
    categoryBn: 'গ্যাজেট ও ইলেকট্রনিক্স',
    price: 1850,
    originalPrice: 2900,
    discountPercent: 36,
    rating: 4.8,
    reviewCount: 92,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=600&q=80',
    description: '২২.৫ ওয়াট সুপার ফাস্ট চার্জিং সাপোর্ট। একসাথে ৩টি ফোন ফুল স্পিডে চার্জ করতে পারবেন। ডিজিটাল এলইডি ডিসপ্লেতে ব্যাটারির শতকরা পরিমাণ স্পষ্টভাবে দেখা যায়।',
    features: ['২০,০০০ এমএএইচ লিথিয়াম পলিমার ব্যাটারি', '২২.৫ ওয়াট সুপার ফাস্ট চার্জ', 'মাল্টিপল সিকিউরিটি প্রোটেকশন চিপ', 'টাইপ-সি ইনপুট ও আউটপুট'],
    isFeatured: false,
    isFlashDeal: true,
    badge: 'পাওয়ার প্যাকড',
    unit: '১ পিস',
    sku: 'ECOM-PBK-10'
  },
  {
    id: 'prod-11',
    name: 'Genuine Leather Mens Long Bi-fold Wallet with Box',
    nameBn: '১০০% খাঁটি লেদারের প্রিমিয়াম জেন্টস ওয়ালেট',
    category: 'watch-jewelry',
    categoryBn: 'ঘড়ি ও এক্সেসরিজ',
    price: 850,
    originalPrice: 1400,
    discountPercent: 39,
    rating: 4.7,
    reviewCount: 47,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    description: 'খাঁটি গরুর চামড়ায় নিখুঁত হাতে তৈরি ক্লাসিক ওয়ালেট। এটি টেকসই, দীর্ঘস্থায়ী এবং সহজে নষ্ট হয় না। একাধিক কার্ড স্লট, টাকা রাখার স্পেস ও কয়েন পকেট বিদ্যমান। উপহারের জন্য চমৎকার গিফট বক্স সহ।',
    features: ['১০০% জেনুইন লেদার গ্যারান্টি', '১২টি এটিএম কার্ড স্লট ও আইডি উইন্ডো', 'স্মার্ট স্লিম ডিজাইন', 'লাক্সারি গিফট বক্স সহ'],
    isFeatured: false,
    isFlashDeal: false,
    badge: 'জেনুইন লেদার',
    unit: '১ পিস',
    sku: 'ECOM-WLT-11'
  },
  {
    id: 'prod-12',
    name: 'Premium Gawa Ghee 500g (খাঁটি গাওয়া ঘি)',
    nameBn: 'গ্রাম্য চারণভূমির খাঁটি গাওয়া ঘি (৫০০ গ্রাম)',
    category: 'grocery',
    categoryBn: 'অর্গানিক ও খাঁটি খাবার',
    price: 850,
    originalPrice: 1100,
    discountPercent: 23,
    rating: 5.0,
    reviewCount: 118,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?auto=format&fit=crop&w=600&q=80',
    description: 'পাবনা ও সিরাজগঞ্জের খাঁটি গরুর দুধের ননি থেকে তৈরি ঐতিহ্যবাহী দানাদার গাওয়া ঘি। এর মোহনীয় সুবাস ও অনন্য স্বাদ আপনার প্রতিদিনের খাবারে যোগ করবে অতুলনীয় তৃপ্তি।',
    features: ['শতভাগ খাঁটি দেশি গরুর দুধের ঘি', 'প্রাকৃতিক সুবাস ও চমৎকার দানাদার টেক্সচার', 'ভেজাল ও ফ্লেভারিং রাসায়নিক মুক্ত', 'স্বাস্থ্যকর পুষ্টি উপাদানে ভরপুর'],
    isFeatured: true,
    isFlashDeal: false,
    badge: 'সেরা স্বাদ',
    unit: '৫০০ গ্রাম',
    sku: 'ECOM-GHE-12'
  }
];

export const BANGLADESH_LOCATIONS: BangladeshLocation[] = [
  {
    division: 'Dhaka',
    divisionBn: 'ঢাকা',
    districts: [
      { nameEn: 'Dhaka City', nameBn: 'ঢাকা সিটি' },
      { nameEn: 'Gazipur', nameBn: 'গাজীপুর' },
      { nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ' },
      { nameEn: 'Tangail', nameBn: 'টাঙ্গাইল' },
      { nameEn: 'Faridpur', nameBn: 'ফরিদপুর' },
      { nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ' },
      { nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ' },
      { nameEn: 'Narsingdi', nameBn: 'নরসিংদী' },
      { nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ' },
      { nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ' },
      { nameEn: 'Madaripur', nameBn: 'মাদারীপুর' },
      { nameEn: 'Rajbari', nameBn: 'রাজবাড়ী' },
      { nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর' }
    ]
  },
  {
    division: 'Chattogram',
    divisionBn: 'চট্টগ্রাম',
    districts: [
      { nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
      { nameEn: "Cox's Bazar", nameBn: "কক্সবাজার" },
      { nameEn: 'Cumilla', nameBn: 'কুমিল্লা' },
      { nameEn: 'Feni', nameBn: 'ফেনী' },
      { nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া' },
      { nameEn: 'Noakhali', nameBn: 'নোয়াখালী' },
      { nameEn: 'Chandpur', nameBn: 'চাঁদপুর' },
      { nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর' }
    ]
  },
  {
    division: 'Rajshahi',
    divisionBn: 'রাজশাহী',
    districts: [
      { nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
      { nameEn: 'Bogura', nameBn: 'বগুড়া' },
      { nameEn: 'Pabna', nameBn: 'পাবনা' },
      { nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ' },
      { nameEn: 'Naogaon', nameBn: 'নওগাঁ' },
      { nameEn: 'Natore', nameBn: 'নাটোর' }
    ]
  },
  {
    division: 'Khulna',
    divisionBn: 'খুলনা',
    districts: [
      { nameEn: 'Khulna', nameBn: 'খুলনা' },
      { nameEn: 'Jashore', nameBn: 'যশোর' },
      { nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া' },
      { nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা' },
      { nameEn: 'Bagerhat', nameBn: 'বাগেরহাট' },
      { nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ' }
    ]
  },
  {
    division: 'Sylhet',
    divisionBn: 'সিলেট',
    districts: [
      { nameEn: 'Sylhet', nameBn: 'সিলেট' },
      { nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার' },
      { nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ' },
      { nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ' }
    ]
  },
  {
    division: 'Barishal',
    divisionBn: 'বরিশাল',
    districts: [
      { nameEn: 'Barishal', nameBn: 'বরিশাল' },
      { nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী' },
      { nameEn: 'Bhola', nameBn: 'ভোলা' },
      { nameEn: 'Pirojpur', nameBn: 'পিরোজপুর' }
    ]
  },
  {
    division: 'Rangpur',
    divisionBn: 'রংপুর',
    districts: [
      { nameEn: 'Rangpur', nameBn: 'রংপুর' },
      { nameEn: 'Dinajpur', nameBn: 'দিনাজপুর' },
      { nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম' },
      { nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা' }
    ]
  },
  {
    division: 'Mymensingh',
    divisionBn: 'ময়মনসিংহ',
    districts: [
      { nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' },
      { nameEn: 'Jamalpur', nameBn: 'জামালপুর' },
      { nameEn: 'Netrokona', nameBn: 'নেত্রকোণা' },
      { nameEn: 'Sherpur', nameBn: 'শেরপুর' }
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'E-commerce',
  storePhone: '01989183031',
  storeEmail: 'support@example.com',
  storeAddress: 'ঢাকা, বাংলাদেশ',
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  freeDeliveryThreshold: 2500,
  telegramEnabled: false,
  telegramBotToken: '',
  telegramChatId: '',
  supabaseConfigured: false,
  adminEmail: 'sobujbd679@gmail.com'
};

