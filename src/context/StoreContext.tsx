import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  WholesaleRequest,
  ContactMessage,
  Review,
  AuditLog,
  SiteSettings,
  Address,
} from '../types';
import { useAuth } from './AuthContext';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  favorites: string[];
  wholesaleRequests: WholesaleRequest[];
  contactMessages: ContactMessage[];
  reviews: Review[];
  auditLogs: AuditLog[];
  siteSettings: SiteSettings;
  addresses: Address[];
  toasts: Toast[];

  // Cart operations
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Favorites
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Orders
  placeOrder: (orderData: {
    shippingAddress: {
      recipientName: string;
      phone: string;
      city: string;
      street: string;
    };
    paymentMethod: 'cash_on_delivery' | 'bank_transfer' | 'card_online';
    notes?: string;
  }) => Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }>;
  cancelOrder: (orderId: string) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus, reason?: string) => boolean;

  // Wholesale
  submitWholesaleRequest: (data: {
    productId: string;
    requestedQty: number;
    message: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
  }) => Promise<boolean>;
  respondToWholesaleRequest: (requestId: string, status: 'quoted' | 'declined' | 'completed', quoteNote?: string) => void;

  // Products (Seller & Admin)
  addProduct: (productData: Omit<Product, 'id' | 'createdAt'>) => string;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;

  // Seller Approval (Admin)
  approveSeller: (sellerId: string) => void;
  rejectSeller: (sellerId: string) => void;

  // Contact & Messages
  submitContactMessage: (name: string, email: string, subject: string, message: string) => boolean;
  updateMessageStatus: (id: string, status: 'new' | 'reviewed' | 'resolved') => void;

  // Settings & Reviews
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  submitReview: (productId: string, rating: number, comment: string) => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial Categories
const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat_green',
    slug: 'green-tea',
    name: {
      uz: 'Yashil Choylar',
      ru: 'Зеленый Чай',
      en: 'Green Tea Reserve',
    },
    description: {
      uz: 'Tog‘ shabadasida yetilgan, antioksidantlarga boy tabiiy yashil choy barglari.',
      ru: 'Высокогорный зеленый чай первой весенней сборки, богатый антиоксидантами.',
      en: 'First-flush high-mountain green tea leaves rich in antioxidants and vital energy.',
    },
    imageUrl: '/src/assets/images/product_imperial_green_1792516195534.jpg',
    isActive: true,
  },
  {
    id: 'cat_black',
    slug: 'black-tea',
    name: {
      uz: 'Qora Choylar',
      ru: 'Черный Чай',
      en: 'Black Tea & Oolong',
    },
    description: {
      uz: 'Chuqur fermentatsiyalangan, to‘yingan qahrabo rangli elita qora choy navlari.',
      ru: 'Глубокая классическая ферментация, насыщенный янтарный настой и бархатный вкус.',
      en: 'Deeply fermented amber liquor with velvet notes of dried fruit and wildflower honey.',
    },
    imageUrl: '/src/assets/images/product_royal_black_1792516196560.jpg',
    isActive: true,
  },
  {
    id: 'cat_herbal',
    slug: 'herbal-infusions',
    name: {
      uz: 'Dorivor Giyohlar',
      ru: 'Травяные Сборы',
      en: 'Artisanal Herbal Blends',
    },
    description: {
      uz: 'Ipak yo‘li anʼanalari asosida tog‘ yalpizi, zaʼfaron va naʼmatak gullari uyg‘unligi.',
      ru: 'Изысканные купажи с горной мятой, шафраном, цветками шиповника и пряностями.',
      en: 'Silk Road mountain botanical infusions crafted with wild mint, saffron, and blossoms.',
    },
    imageUrl: '/src/assets/images/product_samarkand_blend_1792516196912.jpg',
    isActive: true,
  },
  {
    id: 'cat_white',
    slug: 'white-tea',
    name: {
      uz: 'Oq Choy & Kurtaklar',
      ru: 'Белый Чай и Почки',
      en: 'Rare White Tips',
    },
    description: {
      uz: 'Quyoshda tabiiy quritilgan eng nozik bahorgi kumush kurtaklar.',
      ru: 'Нежнейшие серебристые почки, высушенные на весеннем горном солнце.',
      en: 'Ultra-rare silver needle harvest sun-dried on mountain slopes for delicate sweetness.',
    },
    imageUrl: '/src/assets/images/craft_tea_ceremony_1792516197448.jpg',
    isActive: true,
  },
];

// Initial Products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prd_01',
    sellerId: 'sel_202',
    sellerStoreName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
    categoryId: 'cat_green',
    name: {
      uz: 'ANNUR Imperator Zangori Yashil Choyi',
      ru: 'Императорский Изумрудный Чай ANNUR',
      en: 'ANNUR Imperial Emerald Mountain Green',
    },
    description: {
      uz: '1800 metr balandlikdagi tog‘ yonbag‘irlaridan qo‘lda terilgan, dastlabki bahor kurtaklaridan iborat oliy toifali choy. Nozik gul ifori va tetiklantiruvchi taʼmga ega.',
      ru: 'Ручной сбор на высоте 1800 метров. Только нежнейшие весенние почки. Свежий цветочный аромат с долгим шелковистым послевкусием.',
      en: 'Single-estate high-mountain green tea harvested at 1,800m elevation. Delicate floral bouquet with a crisp, refreshing, mineral-rich finish.',
    },
    origin: 'Zomin Milliy Bog‘i, Jizzax',
    retailPrice: 145000,
    wholesalePrice: 98000,
    minWholesaleQty: 10,
    stockQty: 85,
    weightGrams: 100,
    packaging: 'Vakuumli alyuminiy quti & ipak xalta',
    images: ['/src/assets/images/product_imperial_green_1792516195534.jpg'],
    isFeatured: true,
    status: 'active',
    tasteNotes: ['Gul ifori', 'Tog‘ havosi', 'Yashil olma', 'Yengil yalpiz'],
    caffeineLevel: 'Medium',
    brewingTemp: '80°C - 85°C',
    brewingTime: '2-3 daqiqa',
    createdAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'prd_02',
    sellerId: 'sel_202',
    sellerStoreName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
    categoryId: 'cat_black',
    name: {
      uz: 'ANNUR Oltin Kurtakli Qora Choy (Golden Tips)',
      ru: 'Королевский Черный Чай Золотые Типсы',
      en: 'ANNUR Royal Golden Tips Amber Black',
    },
    description: {
      uz: 'Quyoshda uzoq vaqt toblangan oltin rangli kurtaklardan tayyorlangan quyuq qahrabo tusli qora choy. Asal va qora olxo‘ri notalari bilan boyitilgan.',
      ru: 'Коллекционный черный чай с максимальным содержанием золотистых типсов. Плотный настой с медовыми и черносливовыми обертонами.',
      en: 'Master reserve black tea generously woven with golden velvet buds. Unveils a luminous amber liquor with sweet dried plum and malted honey nuances.',
    },
    origin: 'Surxondaryo, Boysun tog‘lari',
    retailPrice: 175000,
    wholesalePrice: 120000,
    minWholesaleQty: 12,
    stockQty: 64,
    weightGrams: 120,
    packaging: 'Metall qopqoqli klassik banka',
    images: ['/src/assets/images/product_royal_black_1792516196560.jpg'],
    isFeatured: true,
    status: 'active',
    tasteNotes: ['Tog‘ asali', 'Qora olxo‘ri', 'Karamel', 'Yog‘ochli hid'],
    caffeineLevel: 'High',
    brewingTemp: '95°C',
    brewingTime: '3-4 daqiqa',
    createdAt: '2025-02-05T12:00:00Z',
  },
  {
    id: 'prd_03',
    sellerId: 'sel_202',
    sellerStoreName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
    categoryId: 'cat_herbal',
    name: {
      uz: 'ANNUR Buyuk Ipak Yo‘li Shifobaxsh To‘plami',
      ru: 'Купаж Шелковый Путь с Шафраном и Травами',
      en: 'ANNUR Silk Road Saffron & Wild Herb Blend',
    },
    description: {
      uz: 'Samarqand va Buxoro karvon yo‘llari anʼanasi: tog‘ kakligi, yovvoyi naʼmatak, zaʼfaron va limon o‘ti uyg‘unligi. Tinchlantiruvchi va immunitetni ko‘taruvchi xususiyatga ega.',
      ru: 'Восточный сбор по рецептам караван-сараев: горный чабрец, лепестки шафрана, сушеный шиповник и лимонная мелисса.',
      en: 'Ancient caravan oasis blend marrying wild thyme, high-grade saffron threads, mountain rosehips, and lemon balm for holistic restoration.',
    },
    origin: 'Samarqand & Buxoro vohalari',
    retailPrice: 125000,
    wholesalePrice: 85000,
    minWholesaleQty: 15,
    stockQty: 120,
    weightGrams: 90,
    packaging: 'Zarhallangan sovg‘abop quti',
    images: ['/src/assets/images/product_samarkand_blend_1792516196912.jpg'],
    isFeatured: true,
    status: 'active',
    tasteNotes: ['Zaʼfaron', 'Yovvoyi naʼmatak', 'Kaklik o‘ti', 'Sitrus'],
    caffeineLevel: 'Zero',
    brewingTemp: '90°C - 95°C',
    brewingTime: '5-7 daqiqa',
    createdAt: '2025-02-10T14:00:00Z',
  },
  {
    id: 'prd_04',
    sellerId: 'sel_202',
    sellerStoreName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
    categoryId: 'cat_white',
    name: {
      uz: 'ANNUR Kumush Ignakor Oq Choyi (Silver Needle)',
      ru: 'Серебряные Иглы Белый Чай ANNUR',
      en: 'ANNUR Imperial Silver Needle White Tea',
    },
    description: {
      uz: 'Yiliga bor-yo‘g‘i ikki hafta mobaynida teriladigan oppoq mayin tuklar bilan qoplangan kurtaklar. Dunyodagi eng toza va xushbo‘y choy turlaridan biri.',
      ru: 'Сбор длится всего две недели в году. Цельные нераскрывшиеся почки с серебристым пушком. Нежнейший сладковатый настой.',
      en: 'Exquisite single-bud white tea harvested during an ephemeral two-week early spring window. Envelops the palate with white melon and sweet melon blossom.',
    },
    origin: 'Chotqol tog‘ tizmasi',
    retailPrice: 240000,
    wholesalePrice: 165000,
    minWholesaleQty: 8,
    stockQty: 32,
    weightGrams: 75,
    packaging: 'Ipak lenta bilan bezatilgan shisha idish',
    images: ['/src/assets/images/craft_tea_ceremony_1792516197448.jpg'],
    isFeatured: true,
    status: 'active',
    tasteNotes: ['Oq shaftoli', 'Qovun guli', 'Tog‘ suvi', 'Shirin shudring'],
    caffeineLevel: 'Low',
    brewingTemp: '75°C - 80°C',
    brewingTime: '3-5 daqiqa',
    createdAt: '2025-02-12T09:00:00Z',
  },
];

// Initial Demo Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_101',
    orderNumber: 'ANN-78291',
    buyerId: 'usr_buyer_101',
    buyerName: 'Anvar Qodirov',
    buyerEmail: 'anvar.qodirov@example.uz',
    buyerPhone: '+998 90 123 45 67',
    status: 'shipped',
    subtotal: 320000,
    deliveryFee: 0,
    total: 320000,
    currency: 'UZS',
    shippingAddress: {
      recipientName: 'Anvar Qodirov',
      phone: '+998 90 123 45 67',
      city: 'Toshkent',
      street: 'Amir Temur shoh ko‘chasi, 45-uy',
    },
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    items: [
      {
        id: 'item_101_1',
        productId: 'prd_01',
        sellerId: 'sel_202',
        sellerStoreName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
        productName: 'ANNUR Imperator Zangori Yashil Choyi',
        productImage: '/src/assets/images/product_imperial_green_1792516195534.jpg',
        quantity: 1,
        unitPrice: 145000,
        lineTotal: 145000,
      },
      {
        id: 'item_101_2',
        productId: 'prd_02',
        sellerId: 'sel_202',
        sellerStoreName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
        productName: 'ANNUR Oltin Kurtakli Qora Choy',
        productImage: '/src/assets/images/product_royal_black_1792516196560.jpg',
        quantity: 1,
        unitPrice: 175000,
        lineTotal: 175000,
      },
    ],
    createdAt: '2025-02-14T11:20:00Z',
    updatedAt: '2025-02-15T08:30:00Z',
  },
  {
    id: 'ord_102',
    orderNumber: 'ANN-78140',
    buyerId: 'usr_buyer_101',
    buyerName: 'Anvar Qodirov',
    buyerEmail: 'anvar.qodirov@example.uz',
    buyerPhone: '+998 90 123 45 67',
    status: 'delivered',
    subtotal: 125000,
    deliveryFee: 25000,
    total: 150000,
    currency: 'UZS',
    shippingAddress: {
      recipientName: 'Anvar Qodirov',
      phone: '+998 90 123 45 67',
      city: 'Toshkent',
      street: 'Amir Temur shoh ko‘chasi, 45-uy',
    },
    paymentMethod: 'card_online',
    paymentStatus: 'paid',
    items: [
      {
        id: 'item_102_1',
        productId: 'prd_03',
        sellerId: 'sel_202',
        sellerStoreName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
        productName: 'ANNUR Buyuk Ipak Yo‘li Shifobaxsh To‘plami',
        productImage: '/src/assets/images/product_samarkand_blend_1792516196912.jpg',
        quantity: 1,
        unitPrice: 125000,
        lineTotal: 125000,
      },
    ],
    createdAt: '2025-01-28T15:10:00Z',
    updatedAt: '2025-01-30T14:00:00Z',
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_01',
    buyerId: 'usr_buyer_101',
    buyerName: 'Anvar Qodirov (Toshkent)',
    productId: 'prd_01',
    productName: 'ANNUR Imperator Zangori Yashil Choyi',
    rating: 5,
    comment: 'Choy barglari butun va ifori aqlbovar qilmas darajada toza. Haqiqiy tog‘ shabadasini his qilasiz. Qadoqlanishi ham juda hashamatli.',
    moderationStatus: 'approved',
    createdAt: '2025-02-12T16:00:00Z',
  },
  {
    id: 'rev_02',
    buyerId: 'usr_buyer_103',
    buyerName: 'Elena V. (Samarqand)',
    productId: 'prd_02',
    productName: 'ANNUR Oltin Kurtakli Qora Choy',
    rating: 5,
    comment: 'Великолепный янтарный цвет и медовое послевкусие. Для вечернего чаепития ничего лучше не найти. Доставили быстро!',
    moderationStatus: 'approved',
    createdAt: '2025-02-10T12:00:00Z',
  },
  {
    id: 'rev_03',
    buyerId: 'usr_buyer_104',
    buyerName: 'David S. (International Guest)',
    productId: 'prd_04',
    productName: 'ANNUR Kumush Ignakor Oq Choyi',
    rating: 5,
    comment: 'Subtle, sweet, and remarkably clean. The silver tips are completely intact. A truly world-class artisanal tea experience.',
    moderationStatus: 'approved',
    createdAt: '2025-02-08T09:30:00Z',
  },
];

const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'ANNUR TEA',
  companyPhone: '+998 71 200 45 45',
  companyEmail: 'concierge@annurtea.uz',
  companyAddress: 'Toshkent sh., Mirobod tumani, Afrosiyob ko‘chasi, 12-uy',
  defaultCurrency: 'UZS',
  deliveryFee: 25000,
  freeDeliveryThreshold: 300000,
  wholesaleDiscountPercent: 30,
  requireSellerApproval: true,
  socialInstagram: '@annurtea.uz',
  socialTelegram: '@annurtea_official',
};

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud_01',
    actorId: 'usr_admin_001',
    actorEmail: 'admin@annurtea.uz',
    action: 'SELLER_VERIFICATION_APPROVED',
    entityType: 'seller',
    entityId: 'sel_202',
    details: 'Zomin Tog‘ Choykorlari seller application verified and approved.',
    createdAt: '2024-11-20T11:00:00Z',
  },
  {
    id: 'aud_02',
    actorId: 'usr_seller_202',
    actorEmail: 'zafar.choy@annurtea.uz',
    action: 'PRODUCT_PUBLISHED',
    entityType: 'product',
    entityId: 'prd_01',
    details: 'Product ANNUR Imperator Zangori Yashil Choyi published.',
    createdAt: '2025-02-01T10:00:00Z',
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('annur_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Categories
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('annur_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('annur_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('annur_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('annur_favorites');
    return saved ? JSON.parse(saved) : ['prd_01', 'prd_02'];
  });

  // Wholesale Requests
  const [wholesaleRequests, setWholesaleRequests] = useState<WholesaleRequest[]>(() => {
    const saved = localStorage.getItem('annur_wholesale');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'ws_01',
            buyerId: 'usr_buyer_101',
            buyerName: 'Anvar Qodirov (Choyxona Grand)',
            buyerEmail: 'anvar.qodirov@example.uz',
            buyerPhone: '+998 90 123 45 67',
            sellerId: 'sel_202',
            sellerStoreName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
            productId: 'prd_01',
            productName: 'ANNUR Imperator Zangori Yashil Choyi',
            requestedQty: 25,
            proposedBudget: '2 400 000 UZS',
            message: 'Oliy toifali mehmonxona choyxonasiga har oy 25 kg yetkazib berish bo‘yicha shartnoma tuzmoqchimiz.',
            status: 'quoted',
            quoteNote: 'Hurmatli Anvar aka, 25 kg hajm uchun 1 kg narxini 95,000 so‘mdan taqdim etamiz. Namuna yuborishga tayyormiz.',
            createdAt: '2025-02-11T10:00:00Z',
            updatedAt: '2025-02-12T14:30:00Z',
          },
        ];
  });

  // Contact Messages
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('annur_messages');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'msg_01',
            name: 'Bobur Mirzayev',
            email: 'bobur@tashkenttea.uz',
            subject: 'Eksport imkoniyatlari bo‘yicha hamkorlik',
            message: 'Assalomu alaykum! Biz Yevropa bozoriga choy eksport qiluvchi kompaniyamiz. Mahsulotlaringiz laboratoriya tahlil sertifikatlarini ko‘rishimiz mumkinmi?',
            status: 'new',
            createdAt: '2025-02-14T09:15:00Z',
          },
        ];
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('annur_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('annur_audit');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('annur_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 'addr_01',
      userId: 'usr_buyer_101',
      recipientName: 'Anvar Qodirov',
      phone: '+998 90 123 45 67',
      city: 'Toshkent',
      street: 'Amir Temur shoh ko‘chasi, 45-uy',
      postalCode: '100000',
      isDefault: true,
    },
  ]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('annur_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('annur_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('annur_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('annur_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('annur_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('annur_wholesale', JSON.stringify(wholesaleRequests));
  }, [wholesaleRequests]);

  useEffect(() => {
    localStorage.setItem('annur_messages', JSON.stringify(contactMessages));
  }, [contactMessages]);

  useEffect(() => {
    localStorage.setItem('annur_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('annur_audit', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('annur_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = `tst_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1): boolean => {
    if (product.stockQty <= 0) {
      addToast('Kechirasiz, ushbu choy hozirda omborda tugagan.', 'error');
      return false;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        if (newQty > product.stockQty) {
          addToast(`Maksimal mavjud miqdor: ${product.stockQty} dona`, 'info');
          return prev.map((item) =>
            item.product.id === product.id ? { ...item, quantity: product.stockQty } : item
          );
        }
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stockQty) }];
    });

    addToast(`"${product.name.uz}" savatga qo‘shildi`, 'success');
    return true;
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product && quantity > product.stockQty) {
      addToast(`Omborda faqat ${product.stockQty} dona mavjud`, 'info');
      quantity = product.stockQty;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Mahsulot savatdan olib tashlandi', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.retailPrice * item.quantity, 0);
  const cartDeliveryFee =
    cartSubtotal >= siteSettings.freeDeliveryThreshold || cartSubtotal === 0
      ? 0
      : siteSettings.deliveryFee;
  const cartTotal = cartSubtotal + cartDeliveryFee;

  // Favorites
  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Sevimli choylardan olib tashlandi', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Sevimli choylar ro‘yxatiga qo‘shildi', 'success');
        return [...prev, productId];
      }
    });
  };

  const isFavorite = (productId: string) => favorites.includes(productId);

  // Place Order (Atomic inventory check + creation)
  const placeOrder = async (orderData: {
    shippingAddress: {
      recipientName: string;
      phone: string;
      city: string;
      street: string;
    };
    paymentMethod: 'cash_on_delivery' | 'bank_transfer' | 'card_online';
    notes?: string;
  }): Promise<{ success: boolean; orderId?: string; orderNumber?: string; error?: string }> => {
    if (cart.length === 0) {
      return { success: false, error: 'Savat bo‘sh' };
    }

    // 1. Stock validation
    for (const item of cart) {
      const liveProduct = products.find((p) => p.id === item.product.id);
      if (!liveProduct || liveProduct.stockQty < item.quantity) {
        return {
          success: false,
          error: `Ombordagi qoldiq yetarli emas: ${item.product.name.uz}`,
        };
      }
    }

    // 2. Decrement inventory atomically
    setProducts((prev) =>
      prev.map((p) => {
        const cartMatch = cart.find((c) => c.product.id === p.id);
        if (cartMatch) {
          return {
            ...p,
            stockQty: Math.max(0, p.stockQty - cartMatch.quantity),
          };
        }
        return p;
      })
    );

    // 3. Create Order
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `ANN-${randomSuffix}`;
    const newOrderId = `ord_${Date.now()}`;

    const newOrder: Order = {
      id: newOrderId,
      orderNumber,
      buyerId: user?.id || 'usr_guest',
      buyerName: orderData.shippingAddress.recipientName,
      buyerEmail: user?.email || 'guest@annurtea.uz',
      buyerPhone: orderData.shippingAddress.phone,
      status: 'pending',
      subtotal: cartSubtotal,
      deliveryFee: cartDeliveryFee,
      total: cartTotal,
      currency: 'UZS',
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'card_online' ? 'paid' : 'pending',
      items: cart.map((item, idx) => ({
        id: `oi_${newOrderId}_${idx}`,
        productId: item.product.id,
        sellerId: item.product.sellerId,
        sellerStoreName: item.product.sellerStoreName,
        productName: item.product.name.uz,
        productImage: item.product.images[0] || '',
        quantity: item.quantity,
        unitPrice: item.product.retailPrice,
        lineTotal: item.product.retailPrice * item.quantity,
      })),
      notes: orderData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // 4. Log audit
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      actorId: user?.id || 'guest',
      actorEmail: user?.email || 'guest@annurtea.uz',
      action: 'ORDER_PLACED',
      entityType: 'order',
      entityId: newOrderId,
      details: `New order ${orderNumber} placed for ${cartTotal} UZS.`,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    addToast(`Buyurtma #${orderNumber} muvaffaqiyatli rasmiylashtirildi!`, 'success');
    return { success: true, orderId: newOrderId, orderNumber };
  };

  const cancelOrder = (orderId: string): boolean => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;

    // Only pending orders can be cancelled as per rules
    if (order.status !== 'pending') {
      addToast('Faqat "Kutilmoqda" holatidagi buyurtmalarni bekor qilish mumkin.', 'error');
      return false;
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() } : o))
    );

    // Restore inventory
    setProducts((prev) =>
      prev.map((p) => {
        const item = order.items.find((i) => i.productId === p.id);
        if (item) {
          return { ...p, stockQty: p.stockQty + item.quantity };
        }
        return p;
      })
    );

    addToast(`Buyurtma #${order.orderNumber} bekor qilindi`, 'info');
    return true;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus): boolean => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );

    const log: AuditLog = {
      id: `aud_${Date.now()}`,
      actorId: user?.id || 'system',
      actorEmail: user?.email || 'system',
      action: 'ORDER_STATUS_UPDATED',
      entityType: 'order',
      entityId: orderId,
      details: `Order status transitioned to: ${status}`,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    addToast(`Buyurtma holati yangilandi: ${status}`, 'success');
    return true;
  };

  // Wholesale
  const submitWholesaleRequest = async (data: {
    productId: string;
    requestedQty: number;
    message: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
  }): Promise<boolean> => {
    const product = products.find((p) => p.id === data.productId);
    if (!product) return false;

    const newReq: WholesaleRequest = {
      id: `ws_${Date.now()}`,
      buyerId: user?.id || 'usr_guest',
      buyerName: data.buyerName,
      buyerEmail: data.buyerEmail,
      buyerPhone: data.buyerPhone,
      sellerId: product.sellerId,
      sellerStoreName: product.sellerStoreName,
      productId: product.id,
      productName: product.name.uz,
      requestedQty: data.requestedQty,
      message: data.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWholesaleRequests((prev) => [newReq, ...prev]);
    addToast('Ulgurji so‘rovingiz qabul qilindi! Ishlab chiqaruvchi tez orada taklif yuboradi.', 'success');
    return true;
  };

  const respondToWholesaleRequest = (
    requestId: string,
    status: 'quoted' | 'declined' | 'completed',
    quoteNote?: string
  ) => {
    setWholesaleRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status, quoteNote: quoteNote || r.quoteNote, updatedAt: new Date().toISOString() }
          : r
      )
    );
    addToast('Ulgurji so‘rovga javob yuborildi', 'success');
  };

  // Product management
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>): string => {
    const id = `prd_${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);

    const log: AuditLog = {
      id: `aud_${Date.now()}`,
      actorId: user?.id || 'seller',
      actorEmail: user?.email || '',
      action: 'PRODUCT_CREATED',
      entityType: 'product',
      entityId: id,
      details: `Product "${newProduct.name.uz}" listed.`,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);

    addToast('Yangi choy mahsuloti muvaffaqiyatli qo‘shildi', 'success');
    return id;
  };

  const updateProduct = (productId: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, ...updates } : p)));
    addToast('Mahsulot maʼlumotlari yangilandi', 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('Mahsulot o‘chirildi', 'info');
  };

  // Seller Approvals
  const approveSeller = (sellerId: string) => {
    const log: AuditLog = {
      id: `aud_${Date.now()}`,
      actorId: user?.id || 'admin',
      actorEmail: user?.email || 'admin@annurtea.uz',
      action: 'SELLER_APPROVED',
      entityType: 'seller',
      entityId: sellerId,
      details: `Seller ${sellerId} approved by administrator.`,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
    addToast('Sotuvchi faoliyati tasdiqlandi', 'success');
  };

  const rejectSeller = (sellerId: string) => {
    const log: AuditLog = {
      id: `aud_${Date.now()}`,
      actorId: user?.id || 'admin',
      actorEmail: user?.email || 'admin@annurtea.uz',
      action: 'SELLER_REJECTED',
      entityType: 'seller',
      entityId: sellerId,
      details: `Seller ${sellerId} application was rejected.`,
      createdAt: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
    addToast('Sotuvchi arizasi rad etildi', 'info');
  };

  // Contact messages
  const submitContactMessage = (name: string, email: string, subject: string, message: string): boolean => {
    const newMsg: ContactMessage = {
      id: `msg_${Date.now()}`,
      name,
      email,
      subject,
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    addToast('Xabaringiz qabul qilindi! Rahmat.', 'success');
    return true;
  };

  const updateMessageStatus = (id: string, status: 'new' | 'reviewed' | 'resolved') => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => ({ ...prev, ...updates }));
    addToast('Sayt sozlamalari yangilandi', 'success');
  };

  const submitReview = (productId: string, rating: number, comment: string) => {
    const product = products.find((p) => p.id === productId);
    const newRev: Review = {
      id: `rev_${Date.now()}`,
      buyerId: user?.id || 'usr_guest',
      buyerName: user?.fullName || 'Mehmon Xaridor',
      productId,
      productName: product?.name.uz || 'Choy',
      rating,
      comment,
      moderationStatus: 'approved',
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
    addToast('Sharhingiz uchun tashakkur!', 'success');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        orders,
        favorites,
        wholesaleRequests,
        contactMessages,
        reviews,
        auditLogs,
        siteSettings,
        addresses,
        toasts,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDeliveryFee,
        cartTotal,
        toggleFavorite,
        isFavorite,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        submitWholesaleRequest,
        respondToWholesaleRequest,
        addProduct,
        updateProduct,
        deleteProduct,
        approveSeller,
        rejectSeller,
        submitContactMessage,
        updateMessageStatus,
        updateSiteSettings,
        submitReview,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
