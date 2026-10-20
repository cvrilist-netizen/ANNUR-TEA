import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  Truck,
  Building,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

interface CheckoutPageProps {
  setCurrentTab: (tab: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ setCurrentTab }) => {
  const { t, formatCurrency } = useLanguage();
  const { cart, cartSubtotal, cartDeliveryFee, cartTotal, placeOrder, addresses } = useStore();
  const { user } = useAuth();

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  const [recipientName, setRecipientName] = useState(user?.fullName || defaultAddr?.recipientName || '');
  const [phone, setPhone] = useState(user?.phone || defaultAddr?.phone || '+998 ');
  const [city, setCity] = useState(defaultAddr?.city || 'Toshkent');
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [paymentMethod, setPaymentMethod] = useState<'cash_on_delivery' | 'bank_transfer' | 'card_online'>(
    'cash_on_delivery'
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<{ id: string; number: string } | null>(null);

  if (completedOrder) {
    return (
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-600 flex items-center justify-center mx-auto text-[#C8A96B]">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
            {t('checkout.success_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#A5B7A0]">
            {t('checkout.success_desc')}{' '}
            <strong className="text-[#C8A96B] font-mono text-base">{completedOrder.number}</strong>
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] text-left text-xs space-y-3">
          <div className="flex justify-between border-b border-[#174638] pb-2 text-[#A5B7A0]">
            <span>Yetkazish manzili:</span>
            <span className="font-semibold text-[#F5F0E6] text-right">
              {city}, {street}
            </span>
          </div>
          <div className="flex justify-between border-b border-[#174638] pb-2 text-[#A5B7A0]">
            <span>Qabul qiluvchi:</span>
            <span className="font-semibold text-[#F5F0E6]">{recipientName}</span>
          </div>
          <div className="flex justify-between border-b border-[#174638] pb-2 text-[#A5B7A0]">
            <span>To‘lov usuli:</span>
            <span className="font-semibold text-[#C8A96B]">
              {paymentMethod === 'cash_on_delivery'
                ? 'Qabul qilganda to‘lov'
                : paymentMethod === 'bank_transfer'
                ? 'Bank orqali o‘tkazma'
                : 'Onlayn karta (Sinov to‘lovi)'}
            </span>
          </div>
          <div className="flex justify-between pt-1 text-sm font-semibold text-[#F5F0E6]">
            <span>Jami to‘lov summasi:</span>
            <span className="text-[#C8A96B] tabular-nums">{formatCurrency(cartTotal)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => {
              setCurrentTab('buyer_dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow transition-colors"
          >
            {t('checkout.track_order')}
          </button>
          <button
            onClick={() => {
              setCurrentTab('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-transparent hover:bg-[#174638]/40 border border-[#174638] text-[#F5F0E6] font-medium text-xs tracking-wider uppercase rounded transition-colors"
          >
            Choylar katalogiga qaytish
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="relative z-10 max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <ShoppingBag className="w-12 h-12 text-[#A5B7A0] mx-auto opacity-50" />
        <h2 className="font-serif text-2xl font-semibold text-[#F5F0E6]">{t('cart.empty')}</h2>
        <p className="text-xs text-[#A5B7A0]">{t('cart.empty_desc')}</p>
        <button
          onClick={() => setCurrentTab('products')}
          className="px-6 py-2.5 bg-[#C8A96B] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded transition-colors"
        >
          {t('cart.start_shopping')}
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!recipientName.trim() || !phone.trim() || !street.trim()) {
      setErrorMessage('Iltimos, barcha yetkazish maʼlumotlarini kiriting.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await placeOrder({
        shippingAddress: {
          recipientName: recipientName.trim(),
          phone: phone.trim(),
          city: city.trim(),
          street: street.trim(),
        },
        paymentMethod,
        notes: notes.trim(),
      });

      if (res.success && res.orderNumber && res.orderId) {
        setCompletedOrder({ id: res.orderId, number: res.orderNumber });
      } else {
        setErrorMessage(res.error || 'Buyurtma rasmiylashtirishda xatolik yuz berdi.');
      }
    } catch {
      setErrorMessage('Tizimda uzilish yuz berdi. Iltimos, qayta urinib ko‘ring.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-[#174638] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96B] font-semibold">
          Xarid Jarayoni
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#F5F0E6]">
          {t('checkout.title')}
        </h1>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Form: Delivery details & Payment selection */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Delivery address */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4 shadow-lg">
              <h2 className="font-serif text-lg font-semibold text-[#F5F0E6] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C8A96B]" />
                <span>{t('checkout.recipient')}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">
                    {t('checkout.full_name')}*
                  </label>
                  <input
                    type="text"
                    required
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Masalan: Jamshid Aliyev"
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">
                    {t('checkout.phone')}*
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">
                    {t('checkout.city')}*
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  >
                    <option value="Toshkent">Toshkent shahri</option>
                    <option value="Samarqand">Samarqand</option>
                    <option value="Buxoro">Buxoro</option>
                    <option value="Farg‘ona">Farg‘ona</option>
                    <option value="Andijon">Andijon</option>
                    <option value="Namangan">Namangan</option>
                    <option value="Xorazm">Xorazm (Urganch)</option>
                    <option value="Qashqadaryo">Qashqadaryo (Qarshi)</option>
                    <option value="Surxondaryo">Surxondaryo (Termiz)</option>
                    <option value="Jizzax">Jizzax (Zomin)</option>
                    <option value="Sirdaryo">Sirdaryo (Guliston)</option>
                    <option value="Navoiy">Navoiy</option>
                    <option value="Qoraqalpog‘iston">Qoraqalpog‘iston (Nukus)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[#A5B7A0] mb-1 font-medium">
                    {t('checkout.street')}*
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="Ko‘cha nomi, uy va kvartira raqami"
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs pt-1">
                <label className="block text-[#A5B7A0] mb-1 font-medium">
                  {t('checkout.order_notes')}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Kuryer uchun eslatma (masalan: domofon kodi)"
                  className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment method selector */}
            <div className="p-6 sm:p-8 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4 shadow-lg">
              <h2 className="font-serif text-lg font-semibold text-[#F5F0E6] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#C8A96B]" />
                <span>{t('checkout.payment_method')}</span>
              </h2>

              <div className="space-y-3 text-xs">
                {/* Option 1: Cash on Delivery */}
                <label
                  className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'cash_on_delivery'
                      ? 'border-[#C8A96B] bg-[#174638]/50'
                      : 'border-[#174638] bg-[#102C24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="accent-[#C8A96B]"
                    />
                    <div>
                      <span className="font-semibold text-[#F5F0E6] block">
                        {t('checkout.cod')}
                      </span>
                      <span className="text-[11px] text-[#A5B7A0]">
                        Kuryer yetkazganda naqd pul yoki Uzcard/Humo orqali to‘lash
                      </span>
                    </div>
                  </div>
                  <ShieldCheck className="w-4 h-4 text-[#C8A96B]" />
                </label>

                {/* Option 2: Bank Transfer for B2B */}
                <label
                  className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-[#C8A96B] bg-[#174638]/50'
                      : 'border-[#174638] bg-[#102C24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="accent-[#C8A96B]"
                    />
                    <div>
                      <span className="font-semibold text-[#F5F0E6] block">
                        {t('checkout.bank')}
                      </span>
                      <span className="text-[11px] text-[#A5B7A0]">
                        Yuridik shaxslar uchun elektron hisob-faktura (shartnoma asosida)
                      </span>
                    </div>
                  </div>
                  <Building className="w-4 h-4 text-[#A5B7A0]" />
                </label>

                {/* Option 3: Online card sandbox */}
                <label
                  className={`p-3.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    paymentMethod === 'card_online'
                      ? 'border-[#C8A96B] bg-[#174638]/50'
                      : 'border-[#174638] bg-[#102C24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card_online'}
                      onChange={() => setPaymentMethod('card_online')}
                      className="accent-[#C8A96B]"
                    />
                    <div>
                      <span className="font-semibold text-[#F5F0E6] block">
                        {t('checkout.card')}
                      </span>
                      <span className="text-[11px] text-[#A5B7A0]">
                        Ishlab chiqish rejimi: test simulyatsiyasi (haqiqiy to‘lov yechilmaydi)
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-4 h-4 text-[#A5B7A0]" />
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary: Items & Totals */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 p-6 sm:p-8 rounded-xl bg-[#0D241D] border border-[#174638] space-y-6 shadow-xl">
              <h2 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                Buyurtma Tafsilotlari ({cart.length} xil choy)
              </h2>

              <div className="divide-y divide-[#174638]/60 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name.uz}
                      className="w-12 h-12 rounded object-cover border border-[#174638] shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="text-xs font-medium text-[#F5F0E6] truncate">
                        {item.product.name.uz}
                      </h4>
                      <span className="text-[11px] text-[#A5B7A0]">
                        {item.quantity} dona × {formatCurrency(item.product.retailPrice)}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#C8A96B] tabular-nums">
                      {formatCurrency(item.product.retailPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 pt-2 border-t border-[#174638] text-xs text-[#A5B7A0]">
                <div className="flex justify-between">
                  <span>{t('cart.subtotal')}</span>
                  <span className="text-[#F5F0E6] font-medium tabular-nums">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart.shipping')}</span>
                  <span className="tabular-nums">
                    {cartDeliveryFee === 0 ? (
                      <span className="text-[#C8A96B] font-semibold">{t('cart.free')}</span>
                    ) : (
                      formatCurrency(cartDeliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#F5F0E6] pt-3 border-t border-[#174638]">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#C8A96B] tabular-nums text-xl">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Rasmiylashtirilmoqda...' : t('checkout.submit')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#A5B7A0]">
                <ShieldCheck className="w-4 h-4 text-[#C8A96B]" />
                <span>Xavfsiz va kafolatlangan savdo platformasi</span>
              </div>
            </div>
          </div>

        </div>
      </form>

    </div>
  );
};
