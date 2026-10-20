import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { Search, SlidersHorizontal, Heart, ShoppingBag, X, RotateCcw } from 'lucide-react';

interface ProductsPageProps {
  onOpenProduct: (product: Product) => void;
  onRequestWholesale: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onOpenProduct,
  onRequestWholesale,
}) => {
  const { t, formatCurrency } = useLanguage();
  const { products, categories, addToCart, toggleFavorite, isFavorite } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(300000);

  // Extract unique origins
  const uniqueOrigins = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.origin) set.add(p.origin.split(',')[0].trim());
    });
    return Array.from(set);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'active') return false;
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
        if (selectedOrigin !== 'all' && !p.origin.includes(selectedOrigin)) return false;
        if (onlyInStock && p.stockQty <= 0) return false;
        if (p.retailPrice > maxPrice) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName =
            p.name.uz.toLowerCase().includes(q) ||
            p.name.ru.toLowerCase().includes(q) ||
            p.name.en.toLowerCase().includes(q);
          const matchDesc = p.description.uz.toLowerCase().includes(q);
          const matchOrigin = p.origin.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchOrigin) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.retailPrice - b.retailPrice;
        if (sortBy === 'price_desc') return b.retailPrice - a.retailPrice;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, selectedOrigin, onlyInStock, maxPrice, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedOrigin('all');
    setOnlyInStock(false);
    setMaxPrice(300000);
    setSortBy('newest');
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-[#174638] pb-6 space-y-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96B] font-semibold">
          Katalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#F5F0E6]">
          {t('catalog.title')}
        </h1>
        <p className="text-xs sm:text-sm text-[#A5B7A0] max-w-xl">
          Tog‘ yonbag‘irlaridan yig‘ilgan, saralangan va tabiat iforini saqlagan tabiiy choy kolleksiyasi.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
          
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A5B7A0]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('catalog.search_placeholder')}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A5B7A0] hover:text-[#F5F0E6]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
            >
              <option value="all">{t('catalog.all_categories')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.uz}
                </option>
              ))}
            </select>
          </div>

          {/* Origin Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedOrigin}
              onChange={(e) => setSelectedOrigin(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
            >
              <option value="all">Barcha hududlar</option>
              {uniqueOrigins.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none font-medium"
            >
              <option value="newest">{t('catalog.sort_newest')}</option>
              <option value="price_asc">{t('catalog.sort_price_asc')}</option>
              <option value="price_desc">{t('catalog.sort_price_desc')}</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters: Stock toggle & price range */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#174638]/70 text-xs">
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#A5B7A0] hover:text-[#F5F0E6]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-[#C8A96B] w-3.5 h-3.5"
              />
              <span>Faqat omborda mavjud choylar</span>
            </label>

            <div className="hidden sm:flex items-center gap-2 text-[#A5B7A0]">
              <span>Maksimal narx:</span>
              <span className="font-semibold text-[#C8A96B] tabular-nums">
                {formatCurrency(maxPrice)}
              </span>
              <input
                type="range"
                min={50000}
                max={300000}
                step={10000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[#C8A96B] w-28"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#A5B7A0] tabular-nums">
              {filteredProducts.length} {t('catalog.total_products')}
            </span>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-[11px] text-[#A5B7A0] hover:text-[#C8A96B] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{t('catalog.clear_filters')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="p-16 rounded-xl bg-[#0D241D] border border-[#174638] text-center space-y-3">
          <h3 className="font-serif text-xl font-medium text-[#F5F0E6]">
            {t('catalog.no_results')}
          </h3>
          <p className="text-xs text-[#A5B7A0] max-w-sm mx-auto">
            Qidiruv so‘zini o‘zgartirib ko‘ring yoki filtrlarni tozalang.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2 text-xs font-medium text-[#102C24] bg-[#C8A96B] rounded transition-colors"
          >
            {t('catalog.clear_filters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group rounded-xl overflow-hidden bg-[#0D241D] border border-[#174638] hover:border-[#C8A96B]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              {/* Product Media */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#102C24]">
                <img
                  src={product.images[0]}
                  alt={product.name.uz}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  onClick={() => onOpenProduct(product)}
                  referrerPolicy="no-referrer"
                />

                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-[#102C24]/75 text-[#F5F0E6] hover:text-[#C8A96B] transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(product.id) ? 'fill-[#C8A96B] text-[#C8A96B]' : ''
                    }`}
                  />
                </button>

                {/* Stock alert pill/label */}
                <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-[#102C24]/85 text-[10px] uppercase font-mono tracking-wider text-[#C8A96B]">
                  {product.origin}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5 cursor-pointer" onClick={() => onOpenProduct(product)}>
                  <div className="text-[11px] text-[#A5B7A0] flex items-center gap-1.5">
                    <span>{product.weightGrams}g</span>
                    <span>·</span>
                    <span>{product.packaging}</span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] group-hover:text-[#C8A96B] transition-colors leading-snug">
                    {product.name.uz}
                  </h3>

                  <p className="text-xs text-[#A5B7A0] line-clamp-2 leading-relaxed">
                    {product.description.uz}
                  </p>
                </div>

                {/* Price Information */}
                <div className="pt-3 border-t border-[#174638] flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#A5B7A0] block">
                      {t('featured.retail_price')}
                    </span>
                    <span className="text-base font-semibold text-[#C8A96B] tabular-nums">
                      {formatCurrency(product.retailPrice)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#A5B7A0] block">
                      Ulgurji (kamida {product.minWholesaleQty} ta)
                    </span>
                    <span className="text-xs font-semibold text-[#F5F0E6] tabular-nums">
                      {formatCurrency(product.wholesalePrice)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="py-2.5 px-3 bg-[#174638] hover:bg-[#1f5c4a] text-xs font-semibold text-[#F5F0E6] rounded flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t('featured.add_to_cart')}</span>
                  </button>

                  <button
                    onClick={() => onRequestWholesale(product)}
                    className="py-2.5 px-3 bg-transparent hover:bg-[#174638]/30 border border-[#C8A96B]/40 text-[#C8A96B] text-xs font-medium rounded transition-colors text-center"
                  >
                    Ulgurji so‘rov
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
