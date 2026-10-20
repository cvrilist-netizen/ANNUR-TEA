import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { t, language } = useLanguage();
  const { siteSettings } = useStore();

  const handleLink = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#0D241D] text-[#F5F0E6] border-t border-[#174638] pt-16 pb-12 overflow-hidden z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#174638]/70">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-3xl tracking-[0.2em] font-semibold text-[#F5F0E6]">
              ANNUR TEA
            </span>
            <p className="text-sm text-[#A5B7A0] leading-relaxed max-w-sm">
              {t('footer.description')}
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-[#F5F0E6]/80">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span>{siteSettings.companyAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span>{siteSettings.companyPhone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span>{siteSettings.companyEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#C8A96B]">
              {t('footer.quick_links')}
            </h4>
            <ul className="space-y-2 text-sm text-[#A5B7A0]">
              <li>
                <button
                  onClick={() => handleLink('home')}
                  className="hover:text-[#F5F0E6] transition-colors"
                >
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('products')}
                  className="hover:text-[#F5F0E6] transition-colors"
                >
                  {t('nav.products')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('about')}
                  className="hover:text-[#F5F0E6] transition-colors"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('contact')}
                  className="hover:text-[#F5F0E6] transition-colors"
                >
                  {t('nav.contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Sellers */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#C8A96B]">
              {t('footer.business')}
            </h4>
            <ul className="space-y-2 text-sm text-[#A5B7A0]">
              <li>
                <button
                  onClick={() => handleLink('sellers')}
                  className="hover:text-[#F5F0E6] transition-colors"
                >
                  {t('nav.sellers')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('seller_dashboard')}
                  className="hover:text-[#F5F0E6] transition-colors"
                >
                  {t('nav.seller_dashboard')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLink('admin_panel')}
                  className="hover:text-[#F5F0E6] transition-colors"
                >
                  {t('nav.admin_panel')}
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Channel */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-[#C8A96B]">
              Ijtimoiy tarmoqlar
            </h4>
            <p className="text-xs text-[#A5B7A0]">
              Eng so‘nggi yig‘imlar va eksklyuziv takliflar:
            </p>
            <div className="flex flex-col gap-2 pt-1 text-xs">
              <a
                href="https://t.me/annurtea"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#C8A96B] hover:underline"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram: {siteSettings.socialTelegram}</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#A5B7A0] hover:text-[#F5F0E6]"
              >
                <span>Instagram: {siteSettings.socialInstagram}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A5B7A0]">
          <div>
            &copy; {new Date().getFullYear()} {siteSettings.brandName}. {t('footer.rights')}
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono tracking-wider text-[#C8A96B]/80">
            <span>UZBEKISTAN · TASHKENT</span>
            <span>·</span>
            <span>{t('footer.demo_badge')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
