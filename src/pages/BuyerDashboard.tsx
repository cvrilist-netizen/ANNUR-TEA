import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Layers,
  MapPin,
  User,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronRight,
  ExternalLink,
  Plus,
  Trash2,
} from 'lucide-react';

interface BuyerDashboardProps {
  setCurrentTab: (tab: string) => void;
  openCart: () => void;
  onOpenProductById: (productId: string) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({
  setCurrentTab,
  openCart,
  onOpenProductById,
}) => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { user, logout, updateProfile } = useAuth();
  const { orders, favorites, products, wholesaleRequests, cancelOrder, addresses } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'orders' | 'favorites' | 'wholesale' | 'addresses' | 'profile'>('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // User profile edit form state
  const [nameInput, setNameInput] = useState(user?.fullName || '');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Filter orders belonging to this buyer (or all in demo mode)
  const myOrders = orders.filter((o) => !user || o.buyerId === user.id || o.buyerEmail === user.email || user.role === 'buyer');
  const pendingOrders = myOrders.filter((o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'processing');
  const completedOrders = myOrders.filter((o) => o.status === 'delivered');
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));
  const myWholesale = wholesaleRequests.filter((w) => !user || w.buyerId === user.id || w.buyerEmail === user.email);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-medium">
            <Clock className="w-3 h-3" />
            <span>{t('status.pending')}</span>
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950/60 border border-blue-800 text-blue-300 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>{t('status.confirmed')}</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-950/60 border border-indigo-800 text-indigo-300 text-xs font-medium">
            <Package className="w-3 h-3" />
            <span>{t('status.processing')}</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs font-medium">
            <Truck className="w-3 h-3" />
            <span>{t('status.shipped')}</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-teal-950/60 border border-teal-700 text-teal-300 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            <span>{t('status.delivered')}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 border border-red-800 text-red-300 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            <span>{t('status.cancelled')}</span>
          </span>
        );
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ fullName: nameInput, phone: phoneInput });
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#174638] mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96B] font-semibold">
            {t('buyer.title')}
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[#F5F0E6]">
            Salom, {user?.fullName || 'Xaridor'}
          </h1>
          <p className="text-xs text-[#A5B7A0] mt-0.5">
            Buyurtmalaringiz, sevimli choylar va ulgurji so‘rovlaringizni kuzatib boring.
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('products')}
          className="px-4 py-2 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded shadow transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Katalogga o‘tish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
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
              <span>{t('buyer.overview')}</span>
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
                <Package className="w-4 h-4" />
                <span>{t('buyer.orders')}</span>
              </div>
              <span className="text-[11px] tabular-nums font-mono opacity-80">
                {myOrders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('favorites')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition-colors text-left font-medium ${
                activeSubTab === 'favorites'
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'text-[#A5B7A0] hover:text-[#F5F0E6] hover:bg-[#102C24]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>{t('buyer.favorites')}</span>
              </div>
              <span className="text-[11px] tabular-nums font-mono opacity-80">
                {favoriteProducts.length}
              </span>
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
                <span>{t('buyer.wholesale')}</span>
              </div>
              <span className="text-[11px] tabular-nums font-mono opacity-80">
                {myWholesale.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('addresses')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors text-left font-medium ${
                activeSubTab === 'addresses'
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'text-[#A5B7A0] hover:text-[#F5F0E6] hover:bg-[#102C24]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>{t('buyer.addresses')}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded transition-colors text-left font-medium ${
                activeSubTab === 'profile'
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'text-[#A5B7A0] hover:text-[#F5F0E6] hover:bg-[#102C24]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t('buyer.profile')}</span>
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
              {/* KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 sm:p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                    {t('buyer.kpi_orders')}
                  </span>
                  <span className="text-2xl font-bold font-serif text-[#F5F0E6] tabular-nums mt-1 block">
                    {myOrders.length}
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                    {t('buyer.kpi_pending')}
                  </span>
                  <span className="text-2xl font-bold font-serif text-[#C8A96B] tabular-nums mt-1 block">
                    {pendingOrders.length}
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                    {t('buyer.kpi_completed')}
                  </span>
                  <span className="text-2xl font-bold font-serif text-teal-400 tabular-nums mt-1 block">
                    {completedOrders.length}
                  </span>
                </div>

                <div className="p-4 sm:p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
                  <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                    {t('buyer.kpi_favs')}
                  </span>
                  <span className="text-2xl font-bold font-serif text-[#F5F0E6] tabular-nums mt-1 block">
                    {favoriteProducts.length}
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
                <div className="flex items-center justify-between border-b border-[#174638] pb-3">
                  <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">
                    So‘nggi Buyurtmalar
                  </h3>
                  <button
                    onClick={() => setActiveSubTab('orders')}
                    className="text-xs text-[#C8A96B] hover:underline"
                  >
                    Barchasini ko‘rish
                  </button>
                </div>

                {myOrders.length === 0 ? (
                  <p className="text-xs text-[#A5B7A0] py-4 text-center">
                    Hozircha buyurtmalar mavjud emas.
                  </p>
                ) : (
                  <div className="divide-y divide-[#174638]/60">
                    {myOrders.slice(0, 3).map((ord) => (
                      <div
                        key={ord.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <strong className="font-mono text-sm text-[#F5F0E6]">
                              #{ord.orderNumber}
                            </strong>
                            {getStatusBadge(ord.status)}
                          </div>
                          <span className="text-[#A5B7A0] text-[11px] block">
                            {formatDate(ord.createdAt)} · {ord.items.length} xil mahsulot
                          </span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <span className="font-semibold text-sm text-[#C8A96B] tabular-nums">
                            {formatCurrency(ord.total)}
                          </span>
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded bg-[#174638]/40 hover:bg-[#174638] text-[#F5F0E6] text-[11px] flex items-center gap-1 transition-colors"
                          >
                            <span>Tafsilot</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LIST */}
          {activeSubTab === 'orders' && (
            <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                {t('buyer.orders')} ({myOrders.length})
              </h3>

              {myOrders.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Package className="w-8 h-8 text-[#A5B7A0] mx-auto opacity-50" />
                  <p className="text-xs text-[#A5B7A0]">Siz hali buyurtma bermadingiz.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-lg bg-[#102C24] border border-[#174638] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#174638]/70 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-sm text-[#F5F0E6]">
                            #{ord.orderNumber}
                          </span>
                          {getStatusBadge(ord.status)}
                        </div>
                        <span className="text-[11px] text-[#A5B7A0]">
                          Sana: {formatDate(ord.createdAt)}
                        </span>
                      </div>

                      {/* Items row */}
                      <div className="space-y-2">
                        {ord.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-xs">
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-10 h-10 rounded object-cover border border-[#174638]"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 overflow-hidden">
                              <span className="font-medium text-[#F5F0E6] block truncate">
                                {item.productName}
                              </span>
                              <span className="text-[10px] text-[#A5B7A0]">
                                {item.quantity} dona · {item.sellerStoreName}
                              </span>
                            </div>
                            <span className="font-semibold text-[#C8A96B] tabular-nums">
                              {formatCurrency(item.lineTotal)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Summary & actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#174638]/70 text-xs">
                        <div>
                          <span className="text-[#A5B7A0]">Jami: </span>
                          <strong className="text-sm font-semibold text-[#C8A96B] tabular-nums">
                            {formatCurrency(ord.total)}
                          </strong>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-3 py-1.5 bg-[#174638] hover:bg-[#1f5c4a] rounded text-[#F5F0E6] text-xs transition-colors"
                          >
                            To‘liq ko‘rish
                          </button>

                          {ord.status === 'pending' && (
                            <button
                              onClick={() => {
                                if (window.confirm(t('buyer.cancel_confirm'))) {
                                  cancelOrder(ord.id);
                                }
                              }}
                              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 rounded text-xs transition-colors"
                            >
                              {t('buyer.cancel_order')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVORITES */}
          {activeSubTab === 'favorites' && (
            <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                {t('buyer.favorites')} ({favoriteProducts.length})
              </h3>

              {favoriteProducts.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Heart className="w-8 h-8 text-[#A5B7A0] mx-auto opacity-50" />
                  <p className="text-xs text-[#A5B7A0]">Hozircha sevimli choylar yo‘q.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProducts.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-lg bg-[#102C24] border border-[#174638] flex items-center gap-3"
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name.uz}
                        className="w-16 h-16 rounded object-cover cursor-pointer"
                        onClick={() => onOpenProductById(p.id)}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 overflow-hidden">
                        <span
                          className="font-medium text-xs text-[#F5F0E6] truncate block cursor-pointer hover:text-[#C8A96B]"
                          onClick={() => onOpenProductById(p.id)}
                        >
                          {p.name.uz}
                        </span>
                        <span className="text-[11px] text-[#A5B7A0] block">
                          {p.origin}
                        </span>
                        <span className="font-semibold text-xs text-[#C8A96B] tabular-nums block mt-1">
                          {formatCurrency(p.retailPrice)}
                        </span>
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
                {t('buyer.wholesale')} ({myWholesale.length})
              </h3>

              {myWholesale.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <Layers className="w-8 h-8 text-[#A5B7A0] mx-auto opacity-50" />
                  <p className="text-xs text-[#A5B7A0]">Yuborilgan ulgurji so‘rovlar yo‘q.</p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {myWholesale.map((w) => (
                    <div
                      key={w.id}
                      className="p-4 rounded-lg bg-[#102C24] border border-[#174638] space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[#F5F0E6] text-sm">{w.productName}</strong>
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            w.status === 'quoted'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : w.status === 'declined'
                              ? 'bg-red-950 text-red-300'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {w.status === 'quoted'
                            ? 'Taklif keldi'
                            : w.status === 'declined'
                            ? 'Rad etildi'
                            : 'Kutilmoqda'}
                        </span>
                      </div>

                      <div className="text-[#A5B7A0] space-y-1">
                        <div>
                          Yetkazuvchi: <strong className="text-[#F5F0E6]">{w.sellerStoreName}</strong>
                        </div>
                        <div>
                          So‘ralgan miqdor: <strong className="text-[#C8A96B] tabular-nums">{w.requestedQty} dona</strong>
                        </div>
                        <p className="italic text-[11px] bg-[#0D241D] p-2 rounded">
                          "{w.message}"
                        </p>
                      </div>

                      {w.quoteNote && (
                        <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-200">
                          <strong className="block text-[11px] uppercase mb-0.5">Sotuvchi javobi:</strong>
                          <span>{w.quoteNote}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ADDRESSES */}
          {activeSubTab === 'addresses' && (
            <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                {t('buyer.addresses')}
              </h3>

              <div className="space-y-3 text-xs">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-lg bg-[#102C24] border border-[#174638] flex items-start justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-[#F5F0E6]">{addr.recipientName}</strong>
                        {addr.isDefault && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#C8A96B]/20 text-[#C8A96B] font-semibold">
                            Asosiy
                          </span>
                        )}
                      </div>
                      <span className="text-[#A5B7A0] block">
                        {addr.city}, {addr.street}
                      </span>
                      <span className="text-[#A5B7A0] block">{addr.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeSubTab === 'profile' && (
            <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
                {t('buyer.profile')}
              </h3>

              {profileSuccess && (
                <div className="p-3 rounded bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs">
                  Profil maʼlumotlari muvaffaqiyatli saqlandi!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 text-xs max-w-md">
                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">F.I.SH.</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">Elektron pochta</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full p-2.5 rounded bg-[#102C24]/50 border border-[#174638] text-[#A5B7A0] cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[#A5B7A0] mb-1 font-medium">Telefon raqam</label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded transition-colors"
                >
                  O‘zgarishlarni saqlash
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Selected Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
          <div className="min-h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-[#102C24] border border-[#174638] rounded-xl shadow-2xl p-6 text-[#F5F0E6] z-10 space-y-4 text-xs">
              
              <div className="flex items-center justify-between border-b border-[#174638] pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold">#{selectedOrder.orderNumber}</span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-[#A5B7A0] hover:text-[#F5F0E6] text-sm"
                >
                  ✕
                </button>
              </div>

              {/* Status progression tracker */}
              <div className="py-2">
                <div className="flex items-center justify-between text-[11px] text-[#A5B7A0] mb-2 font-mono">
                  <span>Kutilmoqda</span>
                  <span>Tasdiqlandi</span>
                  <span>Tayyorlanmoqda</span>
                  <span>Yo‘lda</span>
                  <span>Yetkazildi</span>
                </div>
                <div className="w-full h-1.5 bg-[#174638] rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-[#C8A96B] transition-all duration-500 ${
                      selectedOrder.status === 'pending'
                        ? 'w-1/5'
                        : selectedOrder.status === 'confirmed'
                        ? 'w-2/5'
                        : selectedOrder.status === 'processing'
                        ? 'w-3/5'
                        : selectedOrder.status === 'shipped'
                        ? 'w-4/5'
                        : selectedOrder.status === 'delivered'
                        ? 'w-full'
                        : 'w-0'
                    }`}
                  />
                </div>
              </div>

              {/* Delivery info */}
              <div className="p-3 rounded bg-[#0D241D] border border-[#174638] space-y-1">
                <strong className="block text-[#C8A96B]">Yetkazish manzili:</strong>
                <div>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.street}</div>
                <div className="text-[#A5B7A0]">Qabul qiluvchi: {selectedOrder.shippingAddress.recipientName} ({selectedOrder.shippingAddress.phone})</div>
              </div>

              {/* Items */}
              <div className="space-y-2 border-t border-[#174638] pt-3">
                <strong className="block text-[#F5F0E6]">Choy mahsulotlari:</strong>
                {selectedOrder.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between py-1 border-b border-[#174638]/40">
                    <div className="flex items-center gap-2">
                      <img
                        src={it.productImage}
                        alt={it.productName}
                        className="w-8 h-8 rounded object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span>{it.productName} × {it.quantity}</span>
                    </div>
                    <span className="font-semibold text-[#C8A96B] tabular-nums">
                      {formatCurrency(it.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm font-semibold pt-2">
                <span>Jami to‘lov:</span>
                <span className="text-[#C8A96B] tabular-nums">{formatCurrency(selectedOrder.total)}</span>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-2 bg-[#174638] hover:bg-[#1f5c4a] rounded text-[#F5F0E6] transition-colors mt-2"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
