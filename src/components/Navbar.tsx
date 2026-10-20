import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Globe, Menu, X, User } from 'lucide-react';
import { Language } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openCart: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openCart,
  openAuthModal,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const { cartCount } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: t('nav.home') },
    { id: 'products', label: t('nav.products') },
    { id: 'about', label: t('nav.about') },
    { id: 'sellers', label: t('nav.sellers') },
    { id: 'contact', label: t('nav.contact') },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDashboardTab = () => {
    if (!user) return 'buyer_dashboard';
    if (user.role === 'admin') return 'admin_panel';
    if (user.role === 'seller') return 'seller_dashboard';
    return 'buyer_dashboard';
  };

  const getDashboardLabel = () => {
    if (!user) return t('nav.buyer_dashboard');
    if (user.role === 'admin') return t('nav.admin_panel');
    if (user.role === 'seller') return t('nav.seller_dashboard');
    return t('nav.buyer_dashboard');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#102C24]/85 border-b border-[#174638]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand Wordmark (Single text element in editorial serif) */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.2em] font-semibold text-[#F5F0E6] group-hover:text-[#C8A96B] transition-colors whitespace-nowrap shrink-0">
              ANNUR TEA
            </span>
          </button>

          {/* Zone 2: 4–5 single-line navigation links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-8">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative text-sm tracking-wide font-medium transition-colors whitespace-nowrap shrink-0 py-1 ${
                    isActive ? 'text-[#C8A96B]' : 'text-[#F5F0E6]/80 hover:text-[#F5F0E6]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C8A96B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Controls & Primary Action */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#F5F0E6]/80 hover:text-[#C8A96B] rounded border border-[#174638] bg-[#174638]/40 transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span className="uppercase font-semibold tracking-wider">
                  {language === 'uz' ? 'O‘Z' : language === 'ru' ? 'РУ' : 'EN'}
                </span>
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-50"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-36 py-1.5 bg-[#174638] border border-[#C8A96B]/30 rounded-lg shadow-2xl z-50 backdrop-blur-xl">
                    <button
                      onClick={() => {
                        setLanguage('uz');
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                        language === 'uz' ? 'text-[#C8A96B] bg-[#102C24]/50' : 'text-[#F5F0E6] hover:bg-[#102C24]/30'
                      }`}
                    >
                      O‘zbekcha (UZ)
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ru');
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                        language === 'ru' ? 'text-[#C8A96B] bg-[#102C24]/50' : 'text-[#F5F0E6] hover:bg-[#102C24]/30'
                      }`}
                    >
                      Русский (RU)
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors ${
                        language === 'en' ? 'text-[#C8A96B] bg-[#102C24]/50' : 'text-[#F5F0E6] hover:bg-[#102C24]/30'
                      }`}
                    >
                      English (EN)
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-[#F5F0E6]/90 hover:text-[#C8A96B] transition-colors rounded-lg hover:bg-[#174638]/50"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-[#102C24] bg-[#C8A96B] rounded-full tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth CTA */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick(getDashboardTab())}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#102C24] bg-[#C8A96B] hover:bg-[#d6bc83] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{getDashboardLabel()}</span>
                  <span className="sm:hidden font-mono text-[10px] uppercase">
                    {user.role}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-4 py-2 text-xs font-medium text-[#102C24] bg-[#C8A96B] hover:bg-[#d6bc83] rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                {t('nav.login')}
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#F5F0E6] hover:text-[#C8A96B] transition-colors rounded"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#102C24] border-b border-[#174638] px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`block w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                currentTab === link.id
                  ? 'text-[#C8A96B] bg-[#174638]/40'
                  : 'text-[#F5F0E6]/85 hover:text-[#F5F0E6] hover:bg-[#174638]/20'
              }`}
            >
              {link.label}
            </button>
          ))}

          {user && (
            <div className="pt-3 mt-3 border-t border-[#174638]/80 flex flex-col gap-2">
              <button
                onClick={() => handleNavClick(getDashboardTab())}
                className="w-full text-left px-3 py-2 text-xs font-medium text-[#C8A96B] bg-[#174638]/30 rounded"
              >
                {getDashboardLabel()} ({user.fullName})
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-xs font-medium text-red-300 hover:text-red-200"
              >
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
