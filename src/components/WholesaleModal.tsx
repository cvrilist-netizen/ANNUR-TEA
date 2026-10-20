import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { X, Building2, Send, CheckCircle2 } from 'lucide-react';

interface WholesaleModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WholesaleModal: React.FC<WholesaleModalProps> = ({ product, isOpen, onClose }) => {
  const { t, formatCurrency } = useLanguage();
  const { submitWholesaleRequest } = useStore();
  const { user } = useAuth();

  const [requestedQty, setRequestedQty] = useState(product?.minWholesaleQty || 10);
  const [buyerName, setBuyerName] = useState(user?.fullName || '');
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '');
  const [buyerPhone, setBuyerPhone] = useState(user?.phone || '');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requestedQty < product.minWholesaleQty) return;
    setLoading(true);

    const fullMessage = `Kompaniya: ${companyName || 'Yakka tadbirkor'}\nIzoh: ${message}`;
    await submitWholesaleRequest({
      productId: product.id,
      requestedQty,
      message: fullMessage,
      buyerName: buyerName || 'Hurmatli Mijoz',
      buyerEmail: buyerEmail || 'b2b@annurtea.uz',
      buyerPhone: buyerPhone || '',
    });

    setLoading(false);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[#102C24] border border-[#174638] rounded-xl shadow-2xl p-6 text-[#F5F0E6] z-10">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#A5B7A0] hover:text-[#F5F0E6]"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#C8A96B] mx-auto animate-bounce" />
              <h3 className="font-serif text-xl font-medium text-[#F5F0E6]">
                So‘rovingiz Qabul Qilindi!
              </h3>
              <p className="text-xs text-[#A5B7A0] max-w-xs mx-auto">
                {product.sellerStoreName} mutaxassislari 24 soat ichida siz bilan bog‘lanib, rasmiy tijoriy taklif va narxlar shartnomasini taqdim etishadi.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5 mb-4">
                <Building2 className="w-5 h-5 text-[#C8A96B]" />
                <h3 className="font-serif text-xl font-semibold">
                  Ulgurji Narx va Hamkorlik So‘rovi
                </h3>
              </div>

              <div className="p-3 mb-4 rounded bg-[#174638]/40 border border-[#174638] text-xs">
                <span className="font-semibold text-[#F5F0E6] block">{product.name.uz}</span>
                <span className="text-[#A5B7A0]">
                  Ulgurji narx: <strong className="text-[#C8A96B]">{formatCurrency(product.wholesalePrice)}</strong> / dona (Kamida {product.minWholesaleQty} dona)
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Buyurtma miqdori (dona)*</label>
                    <input
                      type="number"
                      min={product.minWholesaleQty}
                      value={requestedQty}
                      onChange={(e) => setRequestedQty(Math.max(product.minWholesaleQty, Number(e.target.value)))}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none tabular-nums font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Kompaniya / Choyxona nomi</label>
                    <input
                      type="text"
                      placeholder="Masalan: 'Grand Mir Hotel'"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Masʼul shaxs F.I.SH.*</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Telefon raqam*</label>
                    <input
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1">Elektron pochta*</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1">Maxsus talablar yoki yetkazish rejasi</label>
                  <textarea
                    rows={3}
                    placeholder="Qadoqlash talablari, muntazam oylik taʼminot yoki namunalar yuborish haqida yozing..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold tracking-wider uppercase rounded transition-colors flex items-center justify-center gap-2 shadow-lg mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Yuborilmoqda...' : 'So‘rovni Yuborish'}</span>
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
