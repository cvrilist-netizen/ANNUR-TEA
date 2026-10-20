import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Leaf, Award, HeartHandshake, Compass, Mountain, Droplet } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const milestones = [
    {
      year: '2021',
      title: 'Tog‘ Plantatsiyalari Tadqiqoti',
      desc: 'Zomin va Surxondaryoning baland tog‘ daralarida tabiiy mikroiqlim va yovvoyi choy butalarining o‘sish sharoitlari o‘rganildi.',
    },
    {
      year: '2023',
      title: 'Birinchi Organik Hosil Terimi',
      desc: 'Kimyoviy o‘g‘itlarsiz, qadimiy qo‘lda terish va toblash uslubi bo‘yicha dastlabki 1000 kg elita navli choy partiyasi tayyorlandi.',
    },
    {
      year: '2024',
      title: 'ANNUR TEA B2B & B2C Savdo Platformasi',
      desc: 'Mahalliy choykor fermerlar bilan hamkorlik tarmog‘i yo‘lga qo‘yildi va xalqaro fitosanitariya talablariga moslashuv taʼminlandi.',
    },
    {
      year: '2025 - Hozir',
      title: 'Silk Road Heritage & Zamonaviy Sifat',
      desc: 'Oliy toifali mehmonxonalar, choyxonalar va xonadonlar uchun O‘zbekiston va mintaqa bo‘ylab to‘g‘ridan-to‘g‘ri yetkazish tizimi.',
    },
  ];

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
      
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96B] font-semibold">
          Biz Haqimizda
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-semibold text-[#F5F0E6] leading-tight">
          {t('about.title')}
        </h1>
        <p className="text-sm sm:text-base text-[#A5B7A0] leading-relaxed">
          {t('about.mission_desc')}
        </p>
      </div>

      {/* Visual Split */}
      <div className="rounded-2xl overflow-hidden bg-[#0D241D] border border-[#174638] grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 sm:p-12 flex flex-col justify-center space-y-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#C8A96B]">
            Bizning falsafamiz
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-[#F5F0E6] leading-snug">
            Choy — bu tabiat va inson suhbati
          </h2>
          <p className="text-xs sm:text-sm text-[#A5B7A0] leading-relaxed">
            Biz har bir choy partiyasini tayyorlashda shoshilishni rad etamiz. Qadimiy Sharq choykorlari aytganidek: "Haqiqiy lazzat sabrda pishadi".
          </p>
          <p className="text-xs sm:text-sm text-[#A5B7A0] leading-relaxed">
            Quyosh nurlarining burchagi, tog‘ shudringining vaqti va choy bargining fermentatsiya darajasi — bu shunchaki ishlab chiqarish emas, bu tirik sanʼatdir.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#174638]">
            <div className="flex items-center gap-2.5 text-xs text-[#F5F0E6]">
              <Mountain className="w-4 h-4 text-[#C8A96B]" />
              <span>Baland tog‘ terroiri</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#F5F0E6]">
              <Droplet className="w-4 h-4 text-[#C8A96B]" />
              <span>Muzlik suvi sug‘orishi</span>
            </div>
          </div>
        </div>

        <div className="aspect-[4/3] lg:aspect-auto">
          <img
            src="/src/assets/images/hero_annur_tea_plantation_1792516194131.jpg"
            alt="ANNUR Tea Terroir"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Quality Standards Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-serif text-3xl font-semibold text-[#F5F0E6]">
            Sifat Va Ekologik Standartlarimiz
          </h3>
          <p className="text-xs text-[#A5B7A0]">
            Har bir qadoqdagi tozalik va xushbo‘ylik kafolati
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-3">
            <Leaf className="w-6 h-6 text-[#C8A96B]" />
            <h4 className="font-serif text-lg font-semibold text-[#F5F0E6]">
              100% Tabiiy Ekotizim
            </h4>
            <p className="text-xs text-[#A5B7A0] leading-relaxed">
              Hech qanday sunʼiy aromatizatorlar, bo‘yoqlar yoki kimyoviy saqlovchilar ishlatilmaydi. Tabiiy choy bargining haqiqiy taʼmi saqlanadi.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-3">
            <Award className="w-6 h-6 text-[#C8A96B]" />
            <h4 className="font-serif text-lg font-semibold text-[#F5F0E6]">
              Qo‘lda Saralash Sanʼati
            </h4>
            <p className="text-xs text-[#A5B7A0] leading-relaxed">
              Zararlangan yoki qo‘pol barglar ajratilib, faqat birinchi flosh kurtaklar va nozik barglar saralanadi.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-3">
            <HeartHandshake className="w-6 h-6 text-[#C8A96B]" />
            <h4 className="font-serif text-lg font-semibold text-[#F5F0E6]">
              Adolatli Savdo & Hamkorlik
            </h4>
            <p className="text-xs text-[#A5B7A0] leading-relaxed">
              Biz mahalliy choykorlarni qo‘llab-quvvatlaymiz, ularning mehnatini munosib baholaymiz va barqaror qishloq xo‘jaligini rivojlantiramiz.
            </p>
          </div>
        </div>
      </div>

      {/* Milestones Timeline */}
      <div className="p-8 sm:p-12 rounded-2xl bg-[#0D241D] border border-[#174638] space-y-8">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-[#C8A96B] font-semibold">
            Tarix
          </span>
          <h3 className="font-serif text-3xl font-semibold text-[#F5F0E6]">
            Rivojlanish Bosqichlari
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 border-t border-[#174638]">
          {milestones.map((m) => (
            <div key={m.year} className="space-y-2">
              <span className="font-serif text-2xl font-bold text-[#C8A96B] tabular-nums block">
                {m.year}
              </span>
              <h4 className="text-sm font-semibold text-[#F5F0E6]">
                {m.title}
              </h4>
              <p className="text-xs text-[#A5B7A0] leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
