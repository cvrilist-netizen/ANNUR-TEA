import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, SellerProfile, UserRole, Language } from '../types';

interface RegisterData {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
  role: 'buyer' | 'seller'; // Admin is strictly NOT selectable during signup
  storeName?: string;
  storeDesc?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  sellerProfile: SellerProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSellerProfile: (updates: Partial<SellerProfile>) => void;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'annur_tea_auth_user';
const AUTH_SELLER_KEY = 'annur_tea_auth_seller';

// Seed demo profiles
const DEMO_BUYER: UserProfile = {
  id: 'usr_buyer_101',
  email: 'anvar.qodirov@example.uz',
  fullName: 'Anvar Qodirov',
  phone: '+998 90 123 45 67',
  preferredLanguage: 'uz',
  avatarUrl: '',
  role: 'buyer',
  createdAt: '2025-01-15T09:00:00Z',
};

const DEMO_SELLER_USER: UserProfile = {
  id: 'usr_seller_202',
  email: 'zafar.choy@annurtea.uz',
  fullName: 'Zafar Karimov',
  phone: '+998 93 987 65 43',
  preferredLanguage: 'uz',
  avatarUrl: '',
  role: 'seller',
  createdAt: '2024-11-20T10:00:00Z',
};

const DEMO_SELLER_PROFILE: SellerProfile = {
  id: 'sel_202',
  userId: 'usr_seller_202',
  storeName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
  description: 'Tog‘ etaklarida yetishtirilgan, 100% tabiiy va qo‘lda terilgan organik choylar yetkazib beruvchisi.',
  approvalStatus: 'approved',
  contactDetails: {
    email: 'zafar.choy@annurtea.uz',
    phone: '+998 93 987 65 43',
    region: 'Jizzax, Zomin tog‘lari',
  },
  totalSales: 48500000,
  createdAt: '2024-11-20T10:30:00Z',
};

const DEMO_ADMIN: UserProfile = {
  id: 'usr_admin_001',
  email: 'admin@annurtea.uz',
  fullName: 'ANNUR Bosh Administrator',
  phone: '+998 71 200 00 00',
  preferredLanguage: 'uz',
  avatarUrl: '',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00Z',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_BUYER;
      }
    }
    // Default to authenticated buyer for smooth immediate usability
    return DEMO_BUYER;
  });

  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(() => {
    const saved = localStorage.getItem(AUTH_SELLER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return user?.role === 'seller' ? DEMO_SELLER_PROFILE : null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (sellerProfile) {
      localStorage.setItem(AUTH_SELLER_KEY, JSON.stringify(sellerProfile));
    } else {
      localStorage.removeItem(AUTH_SELLER_KEY);
    }
  }, [sellerProfile]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400)); // simulated secure authentication verification
    setIsLoading(false);

    const lower = email.toLowerCase().trim();
    if (lower.includes('admin')) {
      setUser(DEMO_ADMIN);
      setSellerProfile(null);
      return true;
    } else if (lower.includes('seller') || lower.includes('zafar')) {
      setUser(DEMO_SELLER_USER);
      setSellerProfile(DEMO_SELLER_PROFILE);
      return true;
    } else {
      // Default to buyer
      const buyerUser: UserProfile = {
        ...DEMO_BUYER,
        email: lower || 'buyer@annurtea.uz',
      };
      setUser(buyerUser);
      setSellerProfile(null);
      return true;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));
    setIsLoading(false);

    // Prevent client-side escalation to admin
    const safeRole: UserRole = data.role === 'seller' ? 'seller' : 'buyer';
    const newUserId = `usr_${Date.now()}`;

    const newUser: UserProfile = {
      id: newUserId,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone || '',
      preferredLanguage: 'uz',
      role: safeRole,
      createdAt: new Date().toISOString(),
    };

    setUser(newUser);

    if (safeRole === 'seller') {
      const newSeller: SellerProfile = {
        id: `sel_${Date.now()}`,
        userId: newUserId,
        storeName: data.storeName || `${data.fullName} Choy Ekotizimi`,
        description: data.storeDesc || 'Yangi ro‘yxatdan o‘tgan choy yetkazib beruvchi korxona.',
        approvalStatus: 'pending', // Requires admin review as per specs
        contactDetails: {
          email: data.email,
          phone: data.phone || '',
          region: 'O‘zbekiston',
        },
        totalSales: 0,
        createdAt: new Date().toISOString(),
      };
      setSellerProfile(newSeller);
    } else {
      setSellerProfile(null);
    }

    return true;
  };

  const logout = () => {
    setUser(null);
    setSellerProfile(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
  };

  const updateSellerProfile = (updates: Partial<SellerProfile>) => {
    if (!sellerProfile) return;
    const updated = { ...sellerProfile, ...updates };
    setSellerProfile(updated);
  };

  const switchDemoRole = (role: UserRole) => {
    if (role === 'admin') {
      setUser(DEMO_ADMIN);
      setSellerProfile(null);
    } else if (role === 'seller') {
      setUser(DEMO_SELLER_USER);
      setSellerProfile(DEMO_SELLER_PROFILE);
    } else {
      setUser(DEMO_BUYER);
      setSellerProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sellerProfile,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        updateSellerProfile,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
