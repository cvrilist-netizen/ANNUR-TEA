import React, { useState } from 'react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { X, Heart, Thermometer, Clock, ShieldCheck, ShoppingBag, Layers, Star, MessageSquare } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestWholesale: (product: Product) => void;
  onSelectRelated: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestWholesale,
  onSelectRelated,
}) => {
  const { t, formatCurrency } = useLanguage();
  const { addToCart, toggleFavorite, isFavorite, reviews, submitReview, products } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) return null;

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 3);

  const handleAdd = () => {
    addToCart(product, quantity);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    submitReview(product.id, reviewRating, reviewComment.trim());
    setReviewComment('');
    setIsSubmittingReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative w-full max-w-4xl bg-[#102C24] border border-[#174638] rounded-xl shadow-2xl overflow-hidden text-[#F5F0E6] my-8 z-10">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-[#174638]/60 hover:bg-[#174638] text-[#F5F0E6] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Gallery Column */}
            <div className="p-6 md:p-8 bg-[#0D241D] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#174638]">
              <div className="space-y-4">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#174638]/40 border border-[#174638]">
                  <img
                    src={product.images[selectedImageIdx] || product.images[0]}
                    alt={product.name.uz}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Multiple thumbnails if available */}
                {product.images.length > 1 && (
                  <div className="flex gap-2">
                    {product.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIdx(idx)}
                        className={`w-16 h-16 rounded border overflow-hidden transition-all ${
                          selectedImageIdx === idx
                            ? 'border-[#C8A96B] ring-1 ring-[#C8A96B]'
                            : 'border-[#174638] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Sensory / Tasting notes */}
                {product.tasteNotes && product.tasteNotes.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#C8A96B] font-semibold block mb-2">
                      Taʼm va ifor notalari
                    </span>
                    <div className="flex flex-wrap gap-2 text-xs text-[#A5B7A0]">
                      {product.tasteNotes.map((note, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded bg-[#174638]/50 border border-[#174638] text-[#F5F0E6]"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Brewing guide strip */}
              <div className="mt-6 pt-4 border-t border-[#174638] grid grid-cols-3 gap-2 text-center text-xs text-[#A5B7A0]">
                <div className="p-2 rounded bg-[#174638]/30">
                  <Thermometer className="w-4 h-4 mx-auto mb-1 text-[#C8A96B]" />
                  <span className="block text-[10px] text-[#A5B7A0]">{t('product.temperature')}</span>
                  <span className="font-semibold text-[#F5F0E6]">{product.brewingTemp || '85°C'}</span>
                </div>
                <div className="p-2 rounded bg-[#174638]/30">
                  <Clock className="w-4 h-4 mx-auto mb-1 text-[#C8A96B]" />
                  <span className="block text-[10px] text-[#A5B7A0]">{t('product.time')}</span>
                  <span className="font-semibold text-[#F5F0E6]">{product.brewingTime || '3 daq.'}</span>
                </div>
                <div className="p-2 rounded bg-[#174638]/30">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-[#C8A96B]" />
                  <span className="block text-[10px] text-[#A5B7A0]">{t('product.caffeine')}</span>
                  <span className="font-semibold text-[#F5F0E6]">{product.caffeineLevel || 'Medium'}</span>
                </div>
              </div>
            </div>

            {/* Purchase & Details Column */}
            <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Origin and category header */}
                <div className="flex items-center justify-between text-xs text-[#A5B7A0]">
                  <span className="tracking-wider uppercase font-semibold text-[#C8A96B]">
                    {product.origin}
                  </span>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-1.5 text-[#A5B7A0] hover:text-[#C8A96B] transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite(product.id) ? 'fill-[#C8A96B] text-[#C8A96B]' : ''
                      }`}
                    />
                  </button>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#F5F0E6] leading-tight">
                  {product.name.uz}
                </h2>

                <p className="text-xs sm:text-sm text-[#A5B7A0] leading-relaxed">
                  {product.description.uz}
                </p>

                {/* Seller attribution */}
                <div className="p-3 rounded bg-[#174638]/30 border border-[#174638] text-xs space-y-1">
                  <span className="text-[10px] uppercase text-[#A5B7A0] tracking-wider block">
                    {t('product.seller_info')}
                  </span>
                  <span className="font-semibold text-[#F5F0E6] block">
                    {product.sellerStoreName}
                  </span>
                  <span className="text-[11px] text-[#A5B7A0]">
                    Qadoq: {product.packaging} · Og‘irligi: {product.weightGrams}g
                  </span>
                </div>

                {/* Pricing Tiers */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded bg-[#174638]/40 border border-[#174638]">
                    <span className="text-[10px] uppercase text-[#A5B7A0] tracking-wider block">
                      {t('featured.retail_price')}
                    </span>
                    <span className="text-xl font-semibold text-[#C8A96B] tabular-nums">
                      {formatCurrency(product.retailPrice)}
                    </span>
                    <span className="text-[10px] text-[#A5B7A0] block mt-0.5">
                      1 qadoq uchun
                    </span>
                  </div>

                  <div className="p-3 rounded bg-[#174638]/20 border border-[#C8A96B]/30">
                    <span className="text-[10px] uppercase text-[#C8A96B] tracking-wider block">
                      {t('featured.wholesale_price')} (B2B)
                    </span>
                    <span className="text-xl font-semibold text-[#F5F0E6] tabular-nums">
                      {formatCurrency(product.wholesalePrice)}
                    </span>
                    <span className="text-[10px] text-[#A5B7A0] block mt-0.5">
                      Kamida {product.minWholesaleQty} dona
                    </span>
                  </div>
                </div>

                {/* Stock alert */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-[#A5B7A0]">
                    {t('product.stock_status')}:{' '}
                    <strong className="text-[#F5F0E6] tabular-nums">
                      {product.stockQty} dona mavjud
                    </strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-[#174638]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#174638] rounded bg-[#0D241D]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-sm text-[#A5B7A0] hover:text-[#F5F0E6]"
                    >
                      -
                    </button>
                    <span className="px-4 text-xs font-semibold tabular-nums text-[#F5F0E6]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                      className="px-3 py-2 text-sm text-[#A5B7A0] hover:text-[#F5F0E6]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="flex-1 py-2.5 px-4 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('product.add_cart')}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onRequestWholesale(product);
                  }}
                  className="w-full py-2.5 px-4 bg-transparent hover:bg-[#174638]/40 border border-[#C8A96B]/50 text-[#C8A96B] font-medium text-xs tracking-wider uppercase rounded transition-colors flex items-center justify-center gap-2"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t('featured.request_wholesale')}</span>
                </button>
              </div>

            </div>
          </div>

          {/* Reviews & Testimonials Section */}
          <div className="p-6 md:p-8 bg-[#0E2720] border-t border-[#174638] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-[#F5F0E6] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C8A96B]" />
                <span>{t('product.reviews_heading')} ({productReviews.length})</span>
              </h3>
            </div>

            {/* Existing reviews */}
            <div className="space-y-3">
              {productReviews.length === 0 ? (
                <p className="text-xs text-[#A5B7A0] italic">
                  Ushbu choyga birinchi bo‘lib sharh qoldiring!
                </p>
              ) : (
                productReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded bg-[#102C24] border border-[#174638]/70 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#F5F0E6]">
                        {rev.buyerName}
                      </span>
                      <div className="flex items-center text-[#C8A96B]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-[#C8A96B]' : 'opacity-30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-[#A5B7A0] leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleReviewSubmit} className="pt-4 border-t border-[#174638]/70 space-y-3">
              <span className="text-xs font-semibold text-[#F5F0E6] block">
                Sharh qoldirish
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#A5B7A0]">Bahoingiz:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-0.5 text-[#C8A96B]"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= reviewRating ? 'fill-[#C8A96B]' : 'opacity-40'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={2}
                placeholder="Choyning ifori, taʼmi va sifati haqida fikringizni yozing..."
                className="w-full text-xs p-3 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
              />

              <button
                type="submit"
                disabled={isSubmittingReview || !reviewComment.trim()}
                className="px-4 py-2 bg-[#174638] hover:bg-[#1F5C4A] text-xs font-medium text-[#F5F0E6] rounded transition-colors disabled:opacity-50"
              >
                Sharhni chop etish
              </button>
            </form>

            {/* Related products */}
            {relatedProducts.length > 0 && (
              <div className="pt-6 border-t border-[#174638]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C8A96B] mb-3">
                  Tavsiya etiladigan boshqa choylar
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedProducts.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="p-2.5 rounded bg-[#102C24] border border-[#174638] hover:border-[#C8A96B]/50 cursor-pointer transition-colors flex items-center gap-2.5"
                    >
                      <img
                        src={rel.images[0]}
                        alt={rel.name.uz}
                        className="w-12 h-12 rounded object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="overflow-hidden">
                        <span className="text-xs font-medium text-[#F5F0E6] truncate block">
                          {rel.name.uz}
                        </span>
                        <span className="text-[11px] font-semibold text-[#C8A96B] tabular-nums">
                          {formatCurrency(rel.retailPrice)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
