import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { WholesaleModal } from './components/WholesaleModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ForSellersPage } from './pages/ForSellersPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { SellerDashboard } from './pages/SellerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

import { Product, UserRole } from './types';
import { Shield, Store, User, X } from 'lucide-react';

function AppContent() {
  const { user, switchDemoRole } = useAuth();
  const { toasts, removeToast, products } = useStore();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wholesaleProduct, setWholesaleProduct] = useState<Product | null>(null);

  const isDashboardView =
    currentTab === 'buyer_dashboard' ||
    currentTab === 'seller_dashboard' ||
    currentTab === 'admin_panel';

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOpenProductById = (productId: string) => {
    const found = products.find((p) => p.id === productId);
    if (found) {
      setSelectedProduct(found);
    }
  };

  const handleRequestWholesale = (product: Product) => {
    setWholesaleProduct(product);
  };

  const handleAuthSuccess = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentTab('admin_panel');
    } else if (role === 'seller') {
      setCurrentTab('seller_dashboard');
    } else {
      setCurrentTab('buyer_dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#102C24] text-[#F5F0E6] relative selection:bg-[#C8A96B] selection:text-[#102C24]">
      {/* Signature Animated Multidirectional Background */}
      <AnimatedBackground subtle={isDashboardView} />

      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCart={() => setIsCartOpen(true)}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Role Quick-Switch QA Helper Bar */}
      <div className="relative z-30 bg-[#0A1D18] border-b border-[#174638] px-4 py-1.5 text-[11px] text-[#A5B7A0] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#F5F0E6] flex items-center gap-1.5">
            <span>Faol rol:</span>
            <span className="uppercase text-[#C8A96B] font-mono font-bold">
              {user ? user.role : 'Mehmon'}
            </span>
          </span>
          <span className="hidden sm:inline">({user ? user.fullName : 'Tizimga kirmagan'})</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span className="hidden md:inline mr-1 text-[10px] uppercase text-[#A5B7A0]">
            Sinov uchun almashtirish:
          </span>
          <button
            onClick={() => {
              switchDemoRole('buyer');
              setCurrentTab('buyer_dashboard');
            }}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              user?.role === 'buyer' && currentTab === 'buyer_dashboard'
                ? 'bg-[#C8A96B] text-[#102C24] font-bold'
                : 'bg-[#174638]/50 hover:bg-[#174638] text-[#F5F0E6]'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Xaridor</span>
          </button>
          <button
            onClick={() => {
              switchDemoRole('seller');
              setCurrentTab('seller_dashboard');
            }}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              user?.role === 'seller' && currentTab === 'seller_dashboard'
                ? 'bg-[#C8A96B] text-[#102C24] font-bold'
                : 'bg-[#174638]/50 hover:bg-[#174638] text-[#F5F0E6]'
            }`}
          >
            <Store className="w-3 h-3" />
            <span>Sotuvchi</span>
          </button>
          <button
            onClick={() => {
              switchDemoRole('admin');
              setCurrentTab('admin_panel');
            }}
            className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
              user?.role === 'admin' && currentTab === 'admin_panel'
                ? 'bg-[#C8A96B] text-[#102C24] font-bold'
                : 'bg-[#174638]/50 hover:bg-[#174638] text-[#F5F0E6]'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            setCurrentTab={setCurrentTab}
            onOpenProduct={handleOpenProduct}
            onRequestWholesale={handleRequestWholesale}
            openAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {currentTab === 'products' && (
          <ProductsPage
            onOpenProduct={handleOpenProduct}
            onRequestWholesale={handleRequestWholesale}
          />
        )}

        {currentTab === 'about' && <AboutPage />}

        {currentTab === 'sellers' && (
          <ForSellersPage
            openAuthModal={() => setIsAuthModalOpen(true)}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === 'contact' && <ContactPage />}

        {currentTab === 'checkout' && <CheckoutPage setCurrentTab={setCurrentTab} />}

        {currentTab === 'buyer_dashboard' && (
          <BuyerDashboard
            setCurrentTab={setCurrentTab}
            openCart={() => setIsCartOpen(true)}
            onOpenProductById={handleOpenProductById}
          />
        )}

        {currentTab === 'seller_dashboard' && <SellerDashboard />}

        {currentTab === 'admin_panel' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

      {/* Global Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setCurrentTab('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onRequestWholesale={(prod) => {
          setSelectedProduct(null);
          setWholesaleProduct(prod);
        }}
        onSelectRelated={(prod) => setSelectedProduct(prod)}
      />

      <WholesaleModal
        product={wholesaleProduct}
        isOpen={!!wholesaleProduct}
        onClose={() => setWholesaleProduct(null)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg border text-xs shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md transition-all ${
              toast.type === 'error'
                ? 'bg-red-950/90 border-red-700 text-red-200'
                : toast.type === 'info'
                ? 'bg-[#174638]/95 border-[#C8A96B]/50 text-[#F5F0E6]'
                : 'bg-[#102C24]/95 border-[#C8A96B] text-[#F5F0E6]'
            }`}
          >
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#A5B7A0] hover:text-[#F5F0E6] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
