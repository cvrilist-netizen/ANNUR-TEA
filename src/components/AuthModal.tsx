import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { X, Shield, Store, ShoppingBag } from 'lucide-react';
import { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const { login, register, switchDemoRole } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          onClose();
          onSuccess('buyer');
        } else {
          setError('Elektron pochta yoki parol noto‘g‘ri kiritildi.');
        }
      } else {
        if (!fullName.trim() || !email.trim()) {
          setError('Iltimos, barcha majburiy maydonlarni to‘ldiring.');
          setLoading(false);
          return;
        }

        const success = await register({
          email,
          fullName,
          phone,
          role,
          storeName,
          storeDesc,
        });

        if (success) {
          onClose();
          onSuccess(role);
        }
      }
    } catch {
      setError('Tizimda kutilmagan xatolik yuz berdi. Qayta urinib ko‘ring.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSwitch = (demoRole: UserRole) => {
    switchDemoRole(demoRole);
    onClose();
    onSuccess(demoRole);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#102C24] border border-[#174638] rounded-xl shadow-2xl p-6 sm:p-8 text-[#F5F0E6] z-10">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#A5B7A0] hover:text-[#F5F0E6]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="text-center mb-6">
            <span className="font-serif text-2xl font-semibold tracking-wider text-[#C8A96B] block">
              ANNUR TEA
            </span>
            <h2 className="font-serif text-lg font-medium text-[#F5F0E6] mt-1">
              {mode === 'login' ? t('auth.login_title') : t('auth.register_title')}
            </h2>
          </div>

          {/* Tab selector */}
          <div className="flex border-b border-[#174638] mb-5">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider text-center transition-colors border-b-2 ${
                mode === 'login'
                  ? 'border-[#C8A96B] text-[#C8A96B]'
                  : 'border-transparent text-[#A5B7A0] hover:text-[#F5F0E6]'
              }`}
            >
              {t('nav.login')}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider text-center transition-colors border-b-2 ${
                mode === 'register'
                  ? 'border-[#C8A96B] text-[#C8A96B]'
                  : 'border-transparent text-[#A5B7A0] hover:text-[#F5F0E6]'
              }`}
            >
              {t('nav.register')}
            </button>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded bg-red-950/60 border border-red-800 text-red-200 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">
                    {t('auth.name')}*
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masalan: Azizbek Rahimov"
                    className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">
                    {t('auth.select_role')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`p-2.5 rounded border text-left flex items-center gap-2 transition-colors ${
                        role === 'buyer'
                          ? 'border-[#C8A96B] bg-[#174638]/60 text-[#F5F0E6]'
                          : 'border-[#174638] bg-[#0D241D] text-[#A5B7A0]'
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C8A96B] shrink-0" />
                      <div>
                        <span className="font-semibold block text-xs">Xaridor</span>
                        <span className="text-[10px] text-[#A5B7A0] leading-none">Chakana & B2B</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`p-2.5 rounded border text-left flex items-center gap-2 transition-colors ${
                        role === 'seller'
                          ? 'border-[#C8A96B] bg-[#174638]/60 text-[#F5F0E6]'
                          : 'border-[#174638] bg-[#0D241D] text-[#A5B7A0]'
                      }`}
                    >
                      <Store className="w-4 h-4 text-[#C8A96B] shrink-0" />
                      <div>
                        <span className="font-semibold block text-xs">Sotuvchi</span>
                        <span className="text-[10px] text-[#A5B7A0] leading-none">Choy yetkazuvchi</span>
                      </div>
                    </button>
                  </div>
                </div>

                {role === 'seller' && (
                  <div className="p-3 rounded bg-[#174638]/30 border border-[#174638] space-y-2.5">
                    <div>
                      <label className="block text-[#A5B7A0] mb-1 font-medium">
                        {t('auth.store_name')}*
                      </label>
                      <input
                        type="text"
                        required={role === 'seller'}
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Masalan: Boysun Tog‘ Choyi"
                        className="w-full p-2 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A5B7A0] mb-1 font-medium">
                        {t('auth.store_desc')}
                      </label>
                      <input
                        type="text"
                        value={storeDesc}
                        onChange={(e) => setStoreDesc(e.target.value)}
                        placeholder="Plantatsiyangiz yoki mahsulotlaringiz haqida"
                        className="w-full p-2 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-[#A5B7A0] mb-1 font-medium">
                {t('auth.email')}*
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pochta@misol.uz"
                className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#A5B7A0] mb-1 font-medium">
                {t('auth.password')}*
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold tracking-wider uppercase rounded transition-colors text-xs shadow-md mt-2"
            >
              {loading
                ? 'Jarayon ketmoqda...'
                : mode === 'login'
                ? t('nav.login')
                : t('nav.register')}
            </button>
          </form>

          {/* Quick Demo Switcher Strip for QA testing */}
          <div className="mt-6 pt-5 border-t border-[#174638]/70 text-center">
            <span className="text-[11px] uppercase tracking-wider text-[#A5B7A0] block mb-2.5">
              {t('auth.demo_helper')}
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoSwitch('buyer')}
                className="w-full py-1.5 px-3 rounded bg-[#174638]/40 hover:bg-[#174638] text-xs text-[#F5F0E6] border border-[#174638] flex items-center justify-between transition-colors"
              >
                <span>{t('auth.as_buyer')}</span>
                <span className="text-[10px] text-[#A5B7A0]">(Anvar Q.)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('seller')}
                className="w-full py-1.5 px-3 rounded bg-[#174638]/40 hover:bg-[#174638] text-xs text-[#F5F0E6] border border-[#174638] flex items-center justify-between transition-colors"
              >
                <span>{t('auth.as_seller')}</span>
                <span className="text-[10px] text-[#A5B7A0]">(Zomin Choy)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSwitch('admin')}
                className="w-full py-1.5 px-3 rounded bg-[#C8A96B]/15 hover:bg-[#C8A96B]/30 text-xs text-[#C8A96B] border border-[#C8A96B]/30 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5 font-medium">
                  <Shield className="w-3.5 h-3.5" />
                  {t('auth.as_admin')}
                </span>
                <span className="text-[10px] text-[#C8A96B]/80">(Super Admin)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
