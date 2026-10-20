import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Leaf,
  Layers,
  Award,
  Star,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
  onOpenProduct: (product: Product) => void;
  onRequestWholesale: (product: Product) => void;
  openAuthModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentTab,
  onOpenProduct,
  onRequestWholesale,
  openAuthModal,
}) => {
  const { t, formatCurrency } = useLanguage();
  const { products, categories, addToCart, toggleFavorite, isFavorite, reviews } = useStore();
  const { user } = useAuth();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const featuredProducts = products.filter((p) => p.isFeatured && p.status === 'active');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 4500);
  };

  return (
    <div className="relative z-10 space-y-24 sm:space-y-32 pb-16">
      
      {/* 1. Cinematic Hero Section */}
      <section className="relative min-h-[85vh] sm:min-h-[88vh] flex items-center pt-8 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 z-10 text-left">
              
              {/* Refined single-line text kicker without pill boxes */}
              <div className="flex items-center gap-2 text-xs text-[#C8A96B] tracking-[0.25em] uppercase font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('hero.badge')}</span>
                <span aria-hidden="true" className="text-[#A5B7A0]/60">·</span>
                <span className="text-[#A5B7A0]">{t('brand.name')}</span>
              </div>

              {/* Dominant Headline */}
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F0E6] leading-[1.08] [text-wrap:balance]">
                {t('hero.title')}
              </h1>

              {/* Body Prose */}
              <p className="text-base sm:text-lg text-[#A5B7A0] max-w-2xl font-light leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentTab('products');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-7 py-3.5 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow-xl transition-all flex items-center gap-2"
                >
                  <span>{t('hero.cta_explore')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (user?.role === 'seller') {
                      setCurrentTab('seller_dashboard');
                    } else {
                      setCurrentTab('sellers');
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-transparent hover:bg-[#174638]/40 border border-[#174638] text-[#F5F0E6] font-medium text-xs tracking-wider uppercase rounded transition-colors"
                >
                  {t('hero.cta_seller')}
                </button>
              </div>

              {/* Adjacent Quantitative Proof Strip */}
              <div className="pt-8 border-t border-[#174638]/70 grid grid-cols-3 gap-6 text-left">
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-semibold text-[#F5F0E6] tabular-nums">
                    1,800m
                  </span>
                  <span className="text-xs text-[#A5B7A0] mt-0.5 block">
                    {t('hero.stat_origins')}
                  </span>
                </div>
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-semibold text-[#C8A96B] tabular-nums">
                    24+
                  </span>
                  <span className="text-xs text-[#A5B7A0] mt-0.5 block">
                    {t('hero.stat_varieties')}
                  </span>
                </div>
                <div>
                  <span className="block font-serif text-2xl sm:text-3xl font-semibold text-[#F5F0E6] tabular-nums">
                    100%
                  </span>
                  <span className="text-xs text-[#A5B7A0] mt-0.5 block">
                    {t('hero.stat_quality')}
                  </span>
                </div>
              </div>

            </div>

            {/* Right Media Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-[#174638] shadow-2xl bg-[#0D241D] group">
                <div className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden">
                  <img
                    src="/src/assets/images/hero_annur_tea_plantation_1792516194131.jpg"
                    alt="ANNUR High Mountain Tea Plantation Terraces"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                {/* Measured Scrim & Caption */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#102C24] via-[#102C24]/80 to-transparent">
                  <div className="flex items-center justify-between text-xs text-[#C8A96B] font-medium mb-1">
                    <span>ZOMIN & BOYSUN TERROIR</span>
                    <span className="text-[11px] font-mono">SPRING FIRST FLUSH</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">
                    Tonggi Shudringda Terilgan Kurtaklar
                  </h3>
                  <p className="text-xs text-[#A5B7A0] mt-1 line-clamp-2">
                    Tog‘ cho‘qqisidagi toza havo va tabiiy minerallar bilan boyitilgan oliy navli barglar.
                  </p>
                </div>
              </div>

              {/* Decorative Subtle Gold Frame accent */}
              <div className="hidden sm:block absolute -bottom-3 -right-3 w-full h-full border border-[#C8A96B]/20 rounded-2xl -z-10 pointer-events-none" />
            </div>

          </div>
        </div>
      </section>

      {/* 2. Curated Tea Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-[#174638]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A96B] block mb-2">
              Kolleksiya
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
              {t('categories.title')}
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-medium text-[#C8A96B] hover:text-[#d6bc83] flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <span>{t('categories.view_all')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setCurrentTab('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer rounded-xl overflow-hidden bg-[#0D241D] border border-[#174638] hover:border-[#C8A96B]/60 transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#102C24]">
                <img
                  src={cat.imageUrl}
                  alt={cat.name.uz}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-xl font-semibold text-[#F5F0E6] group-hover:text-[#C8A96B] transition-colors">
                  {cat.name.uz}
                </h3>
                <p className="text-xs text-[#A5B7A0] leading-relaxed line-clamp-2">
                  {cat.description.uz}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-semibold text-[#C8A96B] gap-1 group-hover:translate-x-1 transition-transform">
                <span>Ko‘rish</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Signature Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A96B]">
            Eksklyuziv Tanlov
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
            {t('featured.title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#A5B7A0]">
            {t('featured.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group rounded-xl overflow-hidden bg-[#0D241D] border border-[#174638] hover:border-[#C8A96B]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              {/* Image & Quick Actions */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#102C24]">
                <img
                  src={prod.images[0]}
                  alt={prod.name.uz}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => onOpenProduct(prod)}
                  referrerPolicy="no-referrer"
                />

                {/* Favorite button */}
                <button
                  onClick={() => toggleFavorite(prod.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-[#102C24]/75 text-[#F5F0E6] hover:text-[#C8A96B] transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(prod.id) ? 'fill-[#C8A96B] text-[#C8A96B]' : ''
                    }`}
                  />
                </button>

                {/* Unboxed Metadata kicker */}
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#102C24]/85 text-[10px] uppercase font-mono tracking-wider text-[#C8A96B]">
                  {prod.origin}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 cursor-pointer" onClick={() => onOpenProduct(prod)}>
                  <div className="text-[11px] text-[#A5B7A0] flex items-center gap-1.5">
                    <span>{prod.weightGrams}g</span>
                    <span>·</span>
                    <span>{prod.packaging}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] group-hover:text-[#C8A96B] transition-colors leading-snug">
                    {prod.name.uz}
                  </h3>
                  <p className="text-xs text-[#A5B7A0] line-clamp-2 leading-relaxed">
                    {prod.description.uz}
                  </p>
                </div>

                {/* Price Baseline */}
                <div className="pt-3 border-t border-[#174638] flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#A5B7A0] block">
                      {t('featured.retail_price')}
                    </span>
                    <span className="text-base font-semibold text-[#C8A96B] tabular-nums">
                      {formatCurrency(prod.retailPrice)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#A5B7A0] block">
                      Ulgurji (kamida {prod.minWholesaleQty} ta)
                    </span>
                    <span className="text-xs font-semibold text-[#F5F0E6] tabular-nums">
                      {formatCurrency(prod.wholesalePrice)}
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="py-2.5 px-3 bg-[#174638] hover:bg-[#1f5c4a] text-xs font-semibold text-[#F5F0E6] rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('featured.add_to_cart')}</span>
                  </button>

                  <button
                    onClick={() => onRequestWholesale(prod)}
                    className="py-2.5 px-3 bg-transparent hover:bg-[#174638]/30 border border-[#C8A96B]/40 text-[#C8A96B] text-xs font-medium rounded transition-colors text-center"
                  >
                    Ulgurji so‘rov
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Craft & Heritage Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0D241D] border border-[#174638] p-8 sm:p-12 lg:p-16 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Story Image */}
            <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#174638] shadow-2xl">
              <div className="aspect-[4/3] lg:aspect-square">
                <img
                  src="/src/assets/images/craft_tea_ceremony_1792516197448.jpg"
                  alt="Artisanal Tea Master Ceremony"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A96B] block">
                {t('story.eyebrow')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#F5F0E6] leading-tight">
                {t('story.title')}
              </h2>
              <p className="text-sm sm:text-base text-[#A5B7A0] leading-relaxed font-light">
                {t('story.p1')}
              </p>
              <p className="text-sm text-[#A5B7A0] leading-relaxed font-light">
                {t('story.p2')}
              </p>

              {/* 3 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#174638]/70">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A96B]">
                    <Leaf className="w-4 h-4" />
                    <span>{t('story.feature_1_title')}</span>
                  </div>
                  <p className="text-[11px] text-[#A5B7A0]">
                    {t('story.feature_1_desc')}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A96B]">
                    <Award className="w-4 h-4" />
                    <span>{t('story.feature_2_title')}</span>
                  </div>
                  <p className="text-[11px] text-[#A5B7A0]">
                    {t('story.feature_2_desc')}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C8A96B]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('story.feature_3_title')}</span>
                  </div>
                  <p className="text-[11px] text-[#A5B7A0]">
                    {t('story.feature_3_desc')}
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. B2B Wholesale Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#174638] to-[#102C24] border border-[#C8A96B]/30 p-8 sm:p-12 shadow-2xl">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8A96B]">
              <Layers className="w-4 h-4" />
              <span>B2B & Korporativ Hamkorlik</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#F5F0E6]">
              {t('b2b.title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#A5B7A0] leading-relaxed">
              {t('b2b.subtitle')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-[#F5F0E6]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span>{t('b2b.benefit_1')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span>{t('b2b.benefit_2')}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span>{t('b2b.benefit_3')}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => {
                  setCurrentTab('contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow transition-colors"
              >
                {t('b2b.cta')}
              </button>
              <button
                onClick={() => {
                  setCurrentTab('sellers');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-transparent hover:bg-[#102C24]/50 border border-[#C8A96B]/40 text-[#F5F0E6] text-xs font-semibold tracking-wider uppercase rounded transition-colors"
              >
                Sotuvchilar Shartlari
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Connoisseur Impressions / Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C8A96B]">
            Haqiqiy Baholar
          </span>
          <h2 className="font-serif text-3xl font-semibold text-[#F5F0E6]">
            {t('reviews.title')}
          </h2>
          <p className="text-xs text-[#A5B7A0]">
            {t('reviews.subtitle')} {t('reviews.demo_notice')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] flex flex-col justify-between space-y-4 shadow"
            >
              <div className="space-y-3">
                <div className="flex text-[#C8A96B]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'fill-[#C8A96B]' : 'opacity-25'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-[#A5B7A0] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-[#174638]/70 flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F5F0E6]">{rev.buyerName}</span>
                <span className="text-[10px] text-[#C8A96B] font-mono">
                  {rev.productName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Newsletter Subscription with Proper Consent */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl p-8 sm:p-10 bg-[#174638]/30 border border-[#174638] text-center space-y-4">
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F5F0E6]">
            {t('newsletter.title')}
          </h3>
          <p className="text-xs text-[#A5B7A0] max-w-md mx-auto">
            {t('newsletter.subtitle')}
          </p>

          {newsletterSuccess ? (
            <div className="p-3 bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs rounded max-w-md mx-auto">
              {t('newsletter.success')}
            </div>
          ) : (
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder={t('newsletter.placeholder')}
                className="flex-1 p-3 text-xs rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded transition-colors whitespace-nowrap"
              >
                {t('newsletter.button')}
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  );
};
