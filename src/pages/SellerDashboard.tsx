import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus } from '../types';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Truck,
  Layers,
  Store,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  TrendingUp,
  DollarSign,
  Clock,
  Send,
  X,
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { user, sellerProfile, logout, updateSellerProfile } = useAuth();
  const {
    products,
    categories,
    orders,
    wholesaleRequests,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    respondToWholesaleRequest,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'products' | 'orders' | 'wholesale' | 'profile'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Quote response modal
  const [selectedWholesaleId, setSelectedWholesaleId] = useState<string | null>(null);
  const [quoteNote, setQuoteNote] = useState('');

  // New product form
  const [pNameUz, setPNameUz] = useState('');
  const [pNameRu, setPNameRu] = useState('');
  const [pNameEn, setPNameEn] = useState('');
  const [pDescUz, setPDescUz] = useState('');
  const [pCategory, setPCategory] = useState(categories[0]?.id || 'cat_green');
  const [pOrigin, setPOrigin] = useState('Zomin tog‘lari');
  const [pRetailPrice, setPRetailPrice] = useState(120000);
  const [pWholesalePrice, setPWholesalePrice] = useState(85000);
  const [pMinWholesaleQty, setPMinWholesaleQty] = useState(10);
  const [pStockQty, setPStockQty] = useState(50);
  const [pWeight, setPWeight] = useState(100);
  const [pPackaging, setPPackaging] = useState('Vakuumli paket');

  // Store Profile edit form
  const [storeNameInput, setStoreNameInput] = useState(sellerProfile?.storeName || 'Mening Choy Rastalari');
  const [storeDescInput, setStoreDescInput] = useState(sellerProfile?.description || '');
  const [storeRegionInput, setStoreRegionInput] = useState(sellerProfile?.contactDetails.region || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Filter seller's products
  const myProducts = products.filter((p) => !sellerProfile || p.sellerId === sellerProfile.id || p.sellerStoreName === sellerProfile?.storeName);
  
  // Filter seller's orders
  const myOrders = orders.filter((o) =>
    o.items.some((it) => !sellerProfile || it.sellerId === sellerProfile.id || it.sellerStoreName === sellerProfile?.storeName)
  );

  // Filter wholesale requests for seller
  const myWholesale = wholesaleRequests.filter(
    (w) => !sellerProfile || w.sellerId === sellerProfile.id || w.sellerStoreName === sellerProfile?.storeName
  );

  const totalRevenue = myOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => {
      const myItemsTotal = o.items
        .filter((it) => !sellerProfile || it.sellerId === sellerProfile.id)
        .reduce((isum, it) => isum + it.lineTotal, 0);
      return sum + (myItemsTotal || o.total);
    }, 0);

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pNameUz.trim()) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: {
          uz: pNameUz,
          ru: pNameRu || pNameUz,
          en: pNameEn || pNameUz,
        },
        description: {
          uz: pDescUz,
          ru: pDescUz,
          en: pDescUz,
        },
        categoryId: pCategory,
        origin: pOrigin,
        retailPrice: Number(pRetailPrice),
        wholesalePrice: Number(pWholesalePrice),
        minWholesaleQty: Number(pMinWholesaleQty),
        stockQty: Number(pStockQty),
        weightGrams: Number(pWeight),
        packaging: pPackaging,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        sellerId: sellerProfile?.id || 'sel_202',
        sellerStoreName: sellerProfile?.storeName || 'Zomin Tog‘ Choykorlari',
        categoryId: pCategory,
        name: {
          uz: pNameUz,
          ru: pNameRu || pNameUz,
          en: pNameEn || pNameUz,
        },
        description: {
          uz: pDescUz,
          ru: pDescUz,
          en: pDescUz,
        },
        origin: pOrigin,
        retailPrice: Number(pRetailPrice),
        wholesalePrice: Number(pWholesalePrice),
        minWholesaleQty: Number(pMinWholesaleQty),
        stockQty: Number(pStockQty),
        weightGrams: Number(pWeight),
        packaging: pPackaging,
        images: ['/src/assets/images/product_imperial_green_1792516195534.jpg'],
        status: sellerProfile?.approvalStatus === 'approved' ? 'active' : 'pending_approval',
        tasteNotes: ['Tabiiy ifor', 'Tog‘ o‘tlari'],
        caffeineLevel: 'Medium',
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setPNameUz('');
    setPNameRu('');
    setPNameEn('');
    setPDescUz('');
    setPOrigin('Zomin tog‘lari');
    setPRetailPrice(120000);
    setPWholesalePrice(85000);
    setPMinWholesaleQty(10);
    setPStockQty(50);
    setPWeight(100);
    setPPackaging('Vakuumli paket');
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setPNameUz(p.name.uz);
    setPNameRu(p.name.ru);
    setPNameEn(p.name.en);
    setPDescUz(p.description.uz);
    setPCategory(p.categoryId);
    setPOrigin(p.origin);
    setPRetailPrice(p.retailPrice);
    setPWholesalePrice(p.wholesalePrice);
    setPMinWholesaleQty(p.minWholesaleQty);
    setPStockQty(p.stockQty);
    setPWeight(p.weightGrams);
    setPPackaging(p.packaging);
    setShowAddModal(true);
  };

  const handleStoreProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerProfile({
      storeName: storeNameInput,
      description: storeDescInput,
      contactDetails: {
        ...(sellerProfile?.contactDetails || { email: user?.email || '', phone: user?.phone || '' }),
        region: storeRegionInput,
      },
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSendQuote = (status: 'quoted' | 'declined') => {
    if (!selectedWholesaleId) return;
    respondToWholesaleRequest(selectedWholesaleId, status, quoteNote);
    setSelectedWholesaleId(null);
    setQuoteNote('');
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#174638] mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96B] font-semibold">
            {t('seller.title')}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[#F5F0E6]">
            {sellerProfile?.storeName || 'Sotuvchi Do‘koni'}
          </h1>
          <p className="text-xs text-[#A5B7A0] mt-0.5">
            Choy hosillari boshqaruvi, mahsulotlar inventari va tushgan buyurtmalar nazorati.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t('seller.add_product')}</span>
        </button>
      </div>

      {/* Approval Status Banner */}
      {sellerProfile?.approvalStatus === 'pending' ? (
        <div className="mb-8 p-4 rounded-xl bg-amber-950/60 border border-amber-700/80 text-amber-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-amber-400" />
          <span>{t('seller.approval_banner_pending')}</span>
        </div>
      ) : (
        <div className="mb-8 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{t('seller.approval_banner_approved')}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          <div className="p-3 bg-[#0D241D] border border-[#174638] rounded-xl space-y-1 text-xs">
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors text-left font-medium ${
                activeSubTab === 'overview'
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'text-[#A5B7A0] hover:text-[#F5F0E6] hover:bg-[#102C24]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('seller.overview')}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors text-left font-medium ${
                activeSubTab === 'products'
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'text-[#A5B7A0] hover:text-[#F5F0E6] hover:bg-[#102C24]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>{t('seller.products')}</span>
              </div>
              <span className="text-[11px] font-mono tabular-nums">{myProducts.length}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors text-left font-medium ${
                activeSubTab === 'orders'
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'text-[#A5B7A0] hover:text-[#F5F0E6] hover:bg-[#102C24]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4" />
                <span>{t('seller.orders')}</span>
              </div>
              <span className="text-[11px] font-mono tabular-nums">{myOrders.length}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('wholesale')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors text-left font-medium ${
                activeSubTab === 'wholesale'
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'text-[#A5B7A0] hover:text-[#F5F0E6] hover:bg-[#102C24]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>{t('seller.wholesale_requests')}</span>
              </div>
              <span className="text-[11px] font-mono tabular-nums">{myWholesale.length}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors text-left font-medium ${
                activeSubTab === 'profile'
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'text-[#A5B7A0] hover:text-[#F5F0E6] hover:bg-[#102C24]'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>{t('seller.store_settings')}</span>
            </button>

            <div className="pt-2 border-t border-[#174638]/70">
              <button
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-left font-medium text-red-300 hover:text-red-200 hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 sm:p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                    {t('seller.kpi_revenue')}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-serif text-[#C8A96B] tabular-nums mt-1 block">
                    {formatCurrency(totalRevenue)}
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                    {t('seller.kpi_products')}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-serif text-[#F5F0E6] tabular-nums mt-1 block">
                    {myProducts.length}
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                    {t('seller.kpi_orders')}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-serif text-[#F5F0E6] tabular-nums mt-1 block">
                    {myOrders.length}
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                    {t('seller.kpi_pending_wholesale')}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold font-serif text-amber-300 tabular-nums mt-1 block">
                    {myWholesale.filter((w) => w.status === 'pending').length}
                  </span>
                </div>
              </div>

              {/* Fast Inventory Replenishment Alert */}
              <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
                <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                  Ombordagi Choy Zaxiralari Holati
                </h3>

                <div className="divide-y divide-[#174638]/60 text-xs">
                  {myProducts.map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name.uz}
                          className="w-10 h-10 rounded object-cover border border-[#174638]"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-semibold text-[#F5F0E6] block">{p.name.uz}</span>
                          <span className="text-[11px] text-[#A5B7A0]">{p.origin} · {p.weightGrams}g</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold tabular-nums ${
                            p.stockQty > 20
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-red-950 text-red-300 border border-red-800'
                          }`}
                        >
                          {p.stockQty} dona qoldi
                        </span>
                        <button
                          onClick={() => handleEditClick(p)}
                          className="text-[#C8A96B] hover:underline text-xs"
                        >
                          Tahrirlash
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PRODUCTS */}
          {activeSubTab === 'products' && (
            <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
              <div className="flex items-center justify-between border-b border-[#174638] pb-3">
                <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">
                  {t('seller.products')} ({myProducts.length})
                </h3>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    resetForm();
                    setShowAddModal(true);
                  }}
                  className="px-3 py-1.5 bg-[#C8A96B] text-[#102C24] font-semibold text-xs rounded transition-colors"
                >
                  + Yangi choy
                </button>
              </div>

              <div className="space-y-3">
                {myProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-lg bg-[#102C24] border border-[#174638] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={p.images[0]}
                        alt={p.name.uz}
                        className="w-14 h-14 rounded object-cover border border-[#174638]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-0.5">
                        <span className="font-semibold text-sm text-[#F5F0E6] block">
                          {p.name.uz}
                        </span>
                        <span className="text-[11px] text-[#A5B7A0] block">
                          {p.origin} · {p.packaging}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] pt-1">
                          <span className="text-[#C8A96B] font-semibold tabular-nums">
                            Chakana: {formatCurrency(p.retailPrice)}
                          </span>
                          <span className="text-[#A5B7A0] tabular-nums">
                            Ulgurji: {formatCurrency(p.wholesalePrice)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded bg-[#0D241D] border border-[#174638] text-[11px] font-mono tabular-nums">
                        Zaxira: {p.stockQty} dona
                      </span>
                      <button
                        onClick={() => handleEditClick(p)}
                        className="p-1.5 rounded bg-[#174638] hover:bg-[#1f5c4a] text-[#F5F0E6]"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded bg-red-950/60 hover:bg-red-900 text-red-200"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INCOMING ORDERS */}
          {activeSubTab === 'orders' && (
            <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                {t('seller.orders')} ({myOrders.length})
              </h3>

              {myOrders.length === 0 ? (
                <p className="text-xs text-[#A5B7A0] py-8 text-center">
                  Hozircha yangi buyurtmalar kelib tushmadi.
                </p>
              ) : (
                <div className="space-y-4 text-xs">
                  {myOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-lg bg-[#102C24] border border-[#174638] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#174638]/70 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#F5F0E6]">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-[#174638] text-[#C8A96B] font-semibold">
                            {ord.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#A5B7A0]">
                          Xaridor: {ord.buyerName} ({ord.buyerPhone})
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {ord.items.map((it) => (
                          <div key={it.id} className="flex justify-between text-[#A5B7A0]">
                            <span>
                              {it.productName} × {it.quantity} dona
                            </span>
                            <span className="text-[#F5F0E6] font-semibold tabular-nums">
                              {formatCurrency(it.lineTotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Status progression controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-[#174638]/70">
                        <span className="text-[#A5B7A0]">
                          Manzil: {ord.shippingAddress.city}, {ord.shippingAddress.street}
                        </span>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-[#A5B7A0]">Holatni yangilash:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                            className="p-1 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] text-xs focus:outline-none"
                          >
                            <option value="pending">Kutilmoqda</option>
                            <option value="confirmed">Tasdiqlandi</option>
                            <option value="processing">Tayyorlanmoqda</option>
                            <option value="shipped">Yo‘lga chiqdi</option>
                            <option value="delivered">Yetkazildi</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WHOLESALE REQUESTS */}
          {activeSubTab === 'wholesale' && (
            <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                {t('seller.wholesale_requests')} ({myWholesale.length})
              </h3>

              {myWholesale.length === 0 ? (
                <p className="text-xs text-[#A5B7A0] py-8 text-center">
                  Hozircha ulgurji so‘rovlar yo‘q.
                </p>
              ) : (
                <div className="space-y-4 text-xs">
                  {myWholesale.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-lg bg-[#102C24] border border-[#174638] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-[#F5F0E6]">{w.productName}</strong>
                        <span className="text-[11px] font-mono text-[#C8A96B] uppercase font-bold">
                          {w.status}
                        </span>
                      </div>

                      <div className="text-[#A5B7A0] space-y-1">
                        <div>
                          Mijoz: <strong className="text-[#F5F0E6]">{w.buyerName}</strong> ({w.buyerPhone} / {w.buyerEmail})
                        </div>
                        <div>
                          So‘ralgan hajm: <strong className="text-[#C8A96B] tabular-nums">{w.requestedQty} dona</strong>
                        </div>
                        <p className="p-2 rounded bg-[#0D241D] text-[#F5F0E6] italic">
                          "{w.message}"
                        </p>
                      </div>

                      {w.quoteNote && (
                        <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-200">
                          <strong className="block text-[10px] uppercase">Berilgan taklif:</strong>
                          <span>{w.quoteNote}</span>
                        </div>
                      )}

                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedWholesaleId(w.id);
                            setQuoteNote('');
                          }}
                          className="px-3 py-1.5 bg-[#C8A96B] text-[#102C24] font-semibold text-xs rounded transition-colors"
                        >
                          Tijoriy Taklif Yuborish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: STORE PROFILE */}
          {activeSubTab === 'profile' && (
            <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                {t('seller.store_settings')}
              </h3>

              {profileSaved && (
                <div className="p-3 rounded bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs">
                  Do‘kon maʼlumotlari yangilandi!
                </div>
              )}

              <form onSubmit={handleStoreProfileSave} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">Do‘kon yoki Ferma Nomi</label>
                  <input
                    type="text"
                    value={storeNameInput}
                    onChange={(e) => setStoreNameInput(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">Tavsif</label>
                  <textarea
                    rows={3}
                    value={storeDescInput}
                    onChange={(e) => setStoreDescInput(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">Hudud / Plantatsiya joylashuvi</label>
                  <input
                    type="text"
                    value={storeRegionInput}
                    onChange={(e) => setStoreRegionInput(e.target.value)}
                    placeholder="Masalan: Jizzax, Zomin baland tog‘lari"
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded transition-colors"
                >
                  Maʼlumotlarni saqlash
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#102C24] border border-[#174638] rounded-xl shadow-2xl p-6 text-[#F5F0E6] z-10 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-[#174638] pb-3">
                <h3 className="font-serif text-lg font-semibold">
                  {editingProduct ? 'Choyni Tahrirlash' : 'Yangi Choy Qo‘shish'}
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-[#A5B7A0] hover:text-[#F5F0E6]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Choy nomi (O‘zbekcha)*</label>
                    <input
                      type="text"
                      required
                      value={pNameUz}
                      onChange={(e) => setPNameUz(e.target.value)}
                      placeholder="Masalan: Boysun Oltin Choyi"
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Kategoriya*</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name.uz}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1">Tavsif (Xushbo‘ylik va xususiyatlar)</label>
                  <textarea
                    rows={3}
                    value={pDescUz}
                    onChange={(e) => setPDescUz(e.target.value)}
                    placeholder="Choyning terilish balandligi, kurtaklari va taʼmi haqida..."
                    className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Chakana narx (UZS)*</label>
                    <input
                      type="number"
                      required
                      value={pRetailPrice}
                      onChange={(e) => setPRetailPrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Ulgurji narx (UZS)*</label>
                    <input
                      type="number"
                      required
                      value={pWholesalePrice}
                      onChange={(e) => setPWholesalePrice(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Kamida ulgurji (dona)</label>
                    <input
                      type="number"
                      value={pMinWholesaleQty}
                      onChange={(e) => setPMinWholesaleQty(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Zaxira miqdori (dona)*</label>
                    <input
                      type="number"
                      required
                      value={pStockQty}
                      onChange={(e) => setPStockQty(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Kelib chiqishi (Hudud)</label>
                    <input
                      type="text"
                      value={pOrigin}
                      onChange={(e) => setPOrigin(e.target.value)}
                      placeholder="Surxondaryo, Boysun"
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Og‘irligi (gramm)</label>
                    <input
                      type="number"
                      value={pWeight}
                      onChange={(e) => setPWeight(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none tabular-nums"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A5B7A0] mb-1">Qadoqlash turi</label>
                    <input
                      type="text"
                      value={pPackaging}
                      onChange={(e) => setPPackaging(e.target.value)}
                      placeholder="Sovg‘abop quti / banka"
                      className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow transition-colors"
                >
                  {editingProduct ? 'Saqlash' : 'Katalogga Joylash'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quote Response Modal */}
      {selectedWholesaleId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setSelectedWholesaleId(null)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#102C24] border border-[#174638] rounded-xl shadow-2xl p-6 text-[#F5F0E6] z-10 space-y-4 text-xs">
              <h3 className="font-serif text-lg font-semibold">Tijoriy Taklif Yuborish</h3>
              <p className="text-[#A5B7A0]">
                Mijozga maxsus hajm narxi va yetkazib berish shartlarini bayon qiling:
              </p>

              <textarea
                rows={4}
                value={quoteNote}
                onChange={(e) => setQuoteNote(e.target.value)}
                placeholder="Masalan: 'Hurmatli xaridor, 50 dona uchun 1 dona narxini 80,000 so‘mdan qilib beramiz. Bepul yetkazib beriladi...'"
                className="w-full p-2.5 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => handleSendQuote('quoted')}
                  className="flex-1 py-2.5 bg-[#C8A96B] text-[#102C24] font-semibold rounded text-xs"
                >
                  Taklifni Yuborish
                </button>
                <button
                  onClick={() => handleSendQuote('declined')}
                  className="px-4 py-2.5 bg-red-950 text-red-200 border border-red-800 rounded text-xs"
                >
                  Rad etish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
