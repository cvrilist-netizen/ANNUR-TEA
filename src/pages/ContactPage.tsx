import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const { siteSettings, submitContactMessage } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setLoading(true);

    submitContactMessage(name.trim(), email.trim(), subject.trim(), message.trim());
    setLoading(false);
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-[#174638] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96B] font-semibold">
          Aloqa
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#F5F0E6]">
          {t('contact.title')}
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B7A0] max-w-xl">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-xl bg-[#0D241D] border border-[#174638] space-y-6">
            <h3 className="font-serif text-xl font-semibold text-[#F5F0E6]">
              ANNUR TEA Bosh Qarorgohi
            </h3>

            <div className="space-y-4 text-xs text-[#A5B7A0]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E6] block mb-0.5">Manzil</strong>
                  <span>{siteSettings.companyAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E6] block mb-0.5">Telefon</strong>
                  <span>{siteSettings.companyPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E6] block mb-0.5">Elektron pochta</strong>
                  <span>{siteSettings.companyEmail}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#174638]">
                <Clock className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#F5F0E6] block mb-0.5">Ish tartibi</strong>
                  <span>Dushanba – Shanba: 09:00 – 19:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-3 text-xs">
            <span className="font-semibold text-[#C8A96B] uppercase tracking-wider block">
              Rasmiy Kanallar
            </span>
            <p className="text-[#A5B7A0]">
              Telegram kanali orqali yangi partiyalar kelishi bilan tanishishingiz mumkin.
            </p>
            <div className="pt-1">
              <span className="font-mono text-[#F5F0E6] block">
                Telegram: {siteSettings.socialTelegram}
              </span>
              <span className="font-mono text-[#F5F0E6] block mt-1">
                Instagram: {siteSettings.socialInstagram}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-xl bg-[#0D241D] border border-[#174638] shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#C8A96B] mx-auto animate-bounce" />
                <h3 className="font-serif text-2xl font-semibold text-[#F5F0E6]">
                  {t('contact.success')}
                </h3>
                <p className="text-xs text-[#A5B7A0] max-w-sm mx-auto">
                  Mutaxassislarimiz xabaringizni ko‘rib chiqib, ko‘rsatilgan elektron pochta yoki telefon orqali aloqaga chiqadilar.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A5B7A0] mb-1 font-medium">
                      {t('contact.name')}*
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ismingizni kiriting"
                      className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A5B7A0] mb-1 font-medium">
                      {t('contact.email')}*
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Elektron pochtangiz"
                      className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">
                    {t('contact.subject')}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Masalan: Ulgurji partiya yoki sifat masalalari"
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">
                    {t('contact.message')}*
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Savol yoki taklifingizni batafsil yozing..."
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Yuborilmoqda...' : t('contact.send')}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
