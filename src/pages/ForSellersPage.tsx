import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Store, TrendingUp, ShieldCheck, Truck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ForSellersPageProps {
  openAuthModal: () => void;
  setCurrentTab: (tab: string) => void;
}

export const ForSellersPage: React.FC<ForSellersPageProps> = ({ openAuthModal, setCurrentTab }) => {
  const { user } = useAuth();

  const handleStartSelling = () => {
    if (user?.role === 'seller') {
      setCurrentTab('seller_dashboard');
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96B] font-semibold">
          Hamkorlik Dasturi
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#F5F0E6] leading-tight">
          Choy Yetishtiruvchilar va Fermerlar Uchun Milliy Savdo Maydoni
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B7A0] leading-relaxed max-w-xl mx-auto">
          O‘zbekiston va mintaqadagi oliy sifatli choy mahsulotlaringizni to‘g‘ridan-to‘g‘ri minglab xaridorlar, restoranlar va mehmonxonalarga soting.
        </p>

        <div className="pt-2">
          <button
            onClick={handleStartSelling}
            className="px-8 py-3.5 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow-xl transition-all inline-flex items-center gap-2"
          >
            <span>Sotuvchi sifatida qo‘shilish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-3">
          <Store className="w-6 h-6 text-[#C8A96B]" />
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">
            Shaxsiy Brend Rastalari
          </h3>
          <p className="text-xs text-[#A5B7A0] leading-relaxed">
            O‘z fermangiz yoki do‘koningiz nomidan mahsulotlar joylang, o‘z hikoyangizni aytib bering va xaridorlar ishonchini qozoning.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-3">
          <TrendingUp className="w-6 h-6 text-[#C8A96B]" />
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">
            Kafolatlangan B2B Talab
          </h3>
          <p className="text-xs text-[#A5B7A0] leading-relaxed">
            Katta hajmdagi choy xaridlari qiluvchi restoranlar, choyxonalar va distribyutorlardan to‘g‘ridan-to‘g‘ri ulgurji so‘rovlar oling.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-3">
          <ShieldCheck className="w-6 h-6 text-[#C8A96B]" />
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">
            Shaffof To‘lovlar
          </h3>
          <p className="text-xs text-[#A5B7A0] leading-relaxed">
            Har bir buyurtma bo‘yicha to‘liq hisob-kitob, xavfsiz to‘lov shartlari va aniq tushumlar hisoboti.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-3">
          <Truck className="w-6 h-6 text-[#C8A96B]" />
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">
            Yagona Logistika Zanjiri
          </h3>
          <p className="text-xs text-[#A5B7A0] leading-relaxed">
            ANNUR TEA kurʼyerlik hamkorlari orqali butun respublika bo‘ylab mahsulotlaringizni xaridorga yetkazib berish imkoniyati.
          </p>
        </div>
      </div>

      {/* Onboarding Steps */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#0D241D] border border-[#174638] space-y-8">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-[#C8A96B] font-semibold">
            Oddiy 3 qadam
          </span>
          <h3 className="font-serif text-3xl font-semibold text-[#F5F0E6]">
            Qanday qilib sotuvchi bo‘lish mumkin?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div className="space-y-2 text-center sm:text-left">
            <span className="font-serif text-3xl font-bold text-[#C8A96B] tabular-nums">01</span>
            <h4 className="text-sm font-semibold text-[#F5F0E6]">Ro‘yxatdan o‘ting</h4>
            <p className="text-xs text-[#A5B7A0] leading-relaxed">
              "Sotuvchi" turini tanlang, korxonangiz yoki fermangiz haqida maʼlumotlarni kiriting.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <span className="font-serif text-3xl font-bold text-[#C8A96B] tabular-nums">02</span>
            <h4 className="text-sm font-semibold text-[#F5F0E6]">Moderatsiyadan o‘ting</h4>
            <p className="text-xs text-[#A5B7A0] leading-relaxed">
              Administratorlarimiz mahsulot sifati va sertifikatlarni tekshirib, do‘koningizni tasdiqlashadi.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <span className="font-serif text-3xl font-bold text-[#C8A96B] tabular-nums">03</span>
            <h4 className="text-sm font-semibold text-[#F5F0E6]">Choylaringizni soting</h4>
            <p className="text-xs text-[#A5B7A0] leading-relaxed">
              Katalogga yangi choy navlarini qo‘shing, buyurtmalarni qabul qiling va biznesingizni kengaytiring.
            </p>
          </div>
        </div>

        <div className="pt-4 text-center">
          <button
            onClick={handleStartSelling}
            className="px-8 py-3 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow transition-all"
          >
            Arizani to‘ldirish
          </button>
        </div>
      </div>

    </div>
  );
};
