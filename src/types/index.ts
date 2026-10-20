export type UserRole = 'buyer' | 'seller' | 'admin';

export type Language = 'uz' | 'ru' | 'en';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  preferredLanguage: Language;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  description: string;
  approvalStatus: 'approved' | 'pending' | 'rejected';
  contactDetails: {
    email: string;
    phone: string;
    region: string;
  };
  totalSales: number;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  description: {
    uz: string;
    ru: string;
    en: string;
  };
  imageUrl: string;
  isActive: boolean;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerStoreName: string;
  categoryId: string;
  name: {
    uz: string;
    ru: string;
    en: string;
  };
  description: {
    uz: string;
    ru: string;
    en: string;
  };
  origin: string;
  retailPrice: number; // in UZS
  wholesalePrice: number; // in UZS
  minWholesaleQty: number;
  stockQty: number;
  weightGrams: number;
  packaging: string;
  images: string[];
  isFeatured?: boolean;
  status: 'active' | 'draft' | 'pending_approval';
  tasteNotes?: string[];
  caffeineLevel?: 'Zero' | 'Low' | 'Medium' | 'High';
  brewingTemp?: string;
  brewingTime?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedWeightOption?: string;
}

export interface Address {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  city: string;
  street: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  sellerId: string;
  sellerStoreName: string;
  productName: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  shippingAddress: {
    recipientName: string;
    phone: string;
    city: string;
    street: string;
  };
  paymentMethod: 'cash_on_delivery' | 'bank_transfer' | 'card_online';
  paymentStatus: 'pending' | 'paid' | 'verified';
  items: OrderItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WholesaleRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  sellerId: string;
  sellerStoreName: string;
  productId: string;
  productName: string;
  requestedQty: number;
  proposedBudget?: string;
  message: string;
  status: 'pending' | 'quoted' | 'declined' | 'completed';
  quoteNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface Review {
  id: string;
  buyerId: string;
  buyerName: string;
  productId: string;
  productName: string;
  rating: number; // 1-5
  comment: string;
  moderationStatus: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  entityType: 'order' | 'product' | 'seller' | 'user' | 'category' | 'settings';
  entityId: string;
  details: string;
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  companyPhone: string;
  companyEmail: string;
  companyAddress: string;
  defaultCurrency: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  wholesaleDiscountPercent: number;
  requireSellerApproval: boolean;
  socialInstagram: string;
  socialTelegram: string;
}
