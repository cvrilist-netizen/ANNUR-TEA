import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckout }) => {
  const { t, formatCurrency } = useLanguage();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDeliveryFee,
    cartTotal,
    siteSettings,
  } = useStore();

  if (!isOpen) return null;

  const freeDeliveryDelta = siteSettings.freeDeliveryThreshold - cartSubtotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#102C24] border-l border-[#174638] text-[#F5F0E6] flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#174638]">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-[#C8A96B]" />
              <h2 className="font-serif text-xl font-medium tracking-wide">
                {t('cart.title')}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#A5B7A0] hover:text-[#F5F0E6] transition-colors rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#174638]/40 border border-[#174638] flex items-center justify-center text-[#A5B7A0]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-lg font-medium text-[#F5F0E6]">
                  {t('cart.empty')}
                </h3>
                <p className="text-xs text-[#A5B7A0] max-w-xs leading-relaxed">
                  {t('cart.empty_desc')}
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 text-xs font-medium text-[#102C24] bg-[#C8A96B] hover:bg-[#d6bc83] rounded transition-colors"
                >
                  {t('cart.start_shopping')}
                </button>
              </div>
            ) : (
              <>
                {/* Free delivery indicator */}
                <div className="p-3 rounded bg-[#174638]/40 border border-[#174638] text-xs">
                  {freeDeliveryDelta <= 0 ? (
                    <span className="text-[#A5B7A0] font-medium">
                      ✓ Sizga bepul yetkazib berish taqdim etiladi!
                    </span>
                  ) : (
                    <span className="text-[#A5B7A0]">
                      Bepul yetkazish uchun yana{' '}
                      <span className="font-semibold text-[#C8A96B] tabular-nums">
                        {formatCurrency(freeDeliveryDelta)}
                      </span>{' '}
                      qiymatida choy tanlang.
                    </span>
                  )}
                </div>

                {/* Items List */}
                <div className="divide-y divide-[#174638]/60">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-4 flex gap-3.5">
                      {/* Image */}
                      <div className="w-20 h-20 rounded bg-[#174638]/40 overflow-hidden shrink-0 border border-[#174638]">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name.uz}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-sm font-medium text-[#F5F0E6] line-clamp-1">
                              {item.product.name.uz}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-[#A5B7A0] hover:text-red-400 p-0.5 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="text-[11px] text-[#A5B7A0] mt-0.5">
                            {item.product.weightGrams}g · {item.product.origin}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {/* Quantity stepper */}
                          <div className="flex items-center border border-[#174638] rounded bg-[#102C24]">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-[#A5B7A0] hover:text-[#F5F0E6] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-semibold tabular-nums text-[#F5F0E6]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-[#A5B7A0] hover:text-[#F5F0E6] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Line total */}
                          <div className="text-xs font-semibold text-[#C8A96B] tabular-nums">
                            {formatCurrency(item.product.retailPrice * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer with totals & action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#174638] bg-[#0E2720] space-y-3">
              <div className="space-y-1.5 text-xs text-[#A5B7A0]">
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
                <div className="flex justify-between text-sm font-semibold text-[#F5F0E6] pt-2 border-t border-[#174638]">
                  <span>{t('cart.total')}</span>
                  <span className="text-[#C8A96B] tabular-nums text-base">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow-lg transition-all"
              >
                <span>{t('cart.checkout_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-[#A5B7A0] hover:text-[#F5F0E6] transition-colors py-1"
              >
                Savatni tozalash
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
