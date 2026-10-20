import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus } from '../types';
import {
  Shield,
  Users,
  Store,
  Package,
  CheckCircle,
  XCircle,
  Truck,
  MessageSquare,
  Sliders,
  History,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Layers,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t, formatCurrency, formatDate } = useLanguage();
  const { user } = useAuth();
  const {
    products,
    categories,
    orders,
    wholesaleRequests,
    contactMessages,
    auditLogs,
    siteSettings,
    approveSeller,
    rejectSeller,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateMessageStatus,
    updateSiteSettings,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'sellers' | 'products' | 'orders' | 'wholesale' | 'messages' | 'audit' | 'settings'
  >('overview');

  const [searchFilter, setSearchFilter] = useState('');

  // Settings form state
  const [phone, setPhone] = useState(siteSettings.companyPhone);
  const [email, setEmail] = useState(siteSettings.companyEmail);
  const [address, setAddress] = useState(siteSettings.companyAddress);
  const [deliveryFee, setDeliveryFee] = useState(siteSettings.deliveryFee);
  const [freeThreshold, setFreeThreshold] = useState(siteSettings.freeDeliveryThreshold);
  const [requireApproval, setRequireApproval] = useState(siteSettings.requireSellerApproval);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Platform metrics
  const totalVolume = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingSellerList = [
    {
      id: 'sel_new_01',
      storeName: 'Boysun Shifobaxsh Choykorlari MCHJ',
      applicant: 'Shavkat Rahimov',
      phone: '+998 97 450 11 22',
      region: 'Surxondaryo, Boysun',
      requestedAt: '2025-02-14T10:00:00Z',
      status: 'pending',
    },
    {
      id: 'sel_202',
      storeName: 'Zomin Tog‘ Choykorlari (Artisanal Highlands)',
      applicant: 'Zafar Karimov',
      phone: '+998 93 987 65 43',
      region: 'Jizzax, Zomin',
      requestedAt: '2024-11-20T10:00:00Z',
      status: 'approved',
    },
  ];

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings({
      companyPhone: phone,
      companyEmail: email,
      companyAddress: address,
      deliveryFee: Number(deliveryFee),
      freeDeliveryThreshold: Number(freeThreshold),
      requireSellerApproval: requireApproval,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#174638]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#C8A96B] font-semibold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>{t('admin.title')}</span>
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-semibold text-[#F5F0E6] mt-1">
            ANNUR Boshqaruv Markazi
          </h1>
          <p className="text-xs text-[#A5B7A0] mt-0.5">
            Sotuvchilar moderatsiyasi, mahsulotlar nazorati, audit jurnali va moliyaviy oqimlar.
          </p>
        </div>

        <div className="p-2.5 rounded-lg bg-[#0D241D] border border-[#174638] text-xs text-[#A5B7A0] flex items-center gap-2 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Admin: <strong className="text-[#F5F0E6]">{user?.fullName || 'Bosh Administrator'}</strong></span>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#174638] pb-3 text-xs">
        {[
          { id: 'overview', label: t('admin.overview'), icon: TrendingUp },
          { id: 'sellers', label: t('admin.sellers'), icon: Store },
          { id: 'products', label: t('admin.products'), icon: Package },
          { id: 'orders', label: t('admin.all_orders'), icon: Truck },
          { id: 'wholesale', label: t('admin.wholesale'), icon: Layers },
          { id: 'messages', label: t('admin.messages'), icon: MessageSquare },
          { id: 'audit', label: t('admin.audit'), icon: History },
          { id: 'settings', label: t('admin.settings'), icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md font-medium transition-colors ${
                isActive
                  ? 'bg-[#174638] text-[#C8A96B]'
                  : 'bg-[#0D241D] text-[#A5B7A0] hover:text-[#F5F0E6]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
              <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                Platforma Jami Aylanmasi
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif text-[#C8A96B] tabular-nums mt-1 block">
                {formatCurrency(totalVolume)}
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
              <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                Jami Buyurtmalar
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif text-[#F5F0E6] tabular-nums mt-1 block">
                {orders.length}
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
              <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                Faol Choy Turlari
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif text-[#F5F0E6] tabular-nums mt-1 block">
                {products.length}
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#0D241D] border border-[#174638]">
              <span className="text-[10px] uppercase tracking-wider text-[#A5B7A0] block">
                Yangi Xabarlar
              </span>
              <span className="text-xl sm:text-2xl font-bold font-serif text-teal-400 tabular-nums mt-1 block">
                {contactMessages.filter((m) => m.status === 'new').length}
              </span>
            </div>
          </div>

          {/* Recent Audit & System Activity */}
          <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
            <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
              So‘nggi Audit Hodisalari
            </h3>

            <div className="divide-y divide-[#174638]/60 text-xs">
              {auditLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="py-2.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#C8A96B] font-semibold">
                        {log.action}
                      </span>
                      <span className="text-[#A5B7A0]">({log.actorEmail})</span>
                    </div>
                    <span className="text-[#A5B7A0] text-[11px] block">{log.details}</span>
                  </div>
                  <span className="text-[11px] text-[#A5B7A0] font-mono">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SELLERS APPROVAL & MANAGEMENT */}
      {activeTab === 'sellers' && (
        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
            {t('admin.sellers')}
          </h3>

          <div className="space-y-3 text-xs">
            {pendingSellerList.map((sel) => (
              <div
                key={sel.id}
                className="p-4 rounded-lg bg-[#102C24] border border-[#174638] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-sm text-[#F5F0E6]">{sel.storeName}</strong>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        sel.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-300'
                          : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {sel.status === 'approved' ? 'Faol Sotuvchi' : 'Tasdiq Kutilmoqda'}
                    </span>
                  </div>
                  <span className="text-[#A5B7A0] block">
                    Masʼul: {sel.applicant} · {sel.phone} · {sel.region}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => approveSeller(sel.id)}
                    className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded text-xs transition-colors"
                  >
                    {t('admin.approve')}
                  </button>
                  <button
                    onClick={() => rejectSeller(sel.id)}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 text-red-200 border border-red-800 rounded text-xs transition-colors"
                  >
                    {t('admin.reject')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS MODERATION */}
      {activeTab === 'products' && (
        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
          <div className="flex items-center justify-between border-b border-[#174638] pb-3">
            <h3 className="font-serif text-lg font-semibold text-[#F5F0E6]">
              {t('admin.products')} ({products.length})
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            {products.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-lg bg-[#102C24] border border-[#174638] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.images[0]}
                    alt={p.name.uz}
                    className="w-12 h-12 rounded object-cover border border-[#174638]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="font-semibold text-sm text-[#F5F0E6] block">
                      {p.name.uz}
                    </span>
                    <span className="text-[11px] text-[#A5B7A0]">
                      Sotuvchi: {p.sellerStoreName} · Zaxira: {p.stockQty} dona
                    </span>
                    <span className="text-[11px] text-[#C8A96B] font-semibold block mt-0.5 tabular-nums">
                      {formatCurrency(p.retailPrice)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateProduct(p.id, { isFeatured: !p.isFeatured })}
                    className={`px-3 py-1.5 rounded border text-xs transition-colors ${
                      p.isFeatured
                        ? 'bg-[#C8A96B]/20 border-[#C8A96B] text-[#C8A96B]'
                        : 'border-[#174638] text-[#A5B7A0]'
                    }`}
                  >
                    {p.isFeatured ? 'Asosiyda bor' : 'Asosiyga qo‘shish'}
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 rounded text-xs transition-colors"
                  >
                    O‘chirish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ORDERS */}
      {activeTab === 'orders' && (
        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
            {t('admin.all_orders')} ({orders.length})
          </h3>

          <div className="space-y-3 text-xs">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-lg bg-[#102C24] border border-[#174638] space-y-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#174638]/70 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#F5F0E6]">
                      #{ord.orderNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#174638] text-[#C8A96B] font-semibold text-[11px]">
                      {ord.status}
                    </span>
                  </div>
                  <span className="text-[#A5B7A0] text-[11px]">
                    Sana: {formatDate(ord.createdAt)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[#F5F0E6] font-medium block">
                      {ord.buyerName} ({ord.buyerPhone})
                    </span>
                    <span className="text-[#A5B7A0] text-[11px]">
                      {ord.shippingAddress.city}, {ord.shippingAddress.street}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#C8A96B] tabular-nums">
                      {formatCurrency(ord.total)}
                    </span>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                      className="p-1 rounded bg-[#0D241D] border border-[#174638] text-[#F5F0E6] text-xs focus:outline-none"
                    >
                      <option value="pending">Kutilmoqda</option>
                      <option value="confirmed">Tasdiqlandi</option>
                      <option value="processing">Tayyorlanmoqda</option>
                      <option value="shipped">Yo‘lda</option>
                      <option value="delivered">Yetkazildi</option>
                      <option value="cancelled">Bekor qilindi</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: WHOLESALE */}
      {activeTab === 'wholesale' && (
        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
            {t('admin.wholesale')} ({wholesaleRequests.length})
          </h3>

          <div className="space-y-3 text-xs">
            {wholesaleRequests.map((w) => (
              <div key={w.id} className="p-4 rounded-lg bg-[#102C24] border border-[#174638] space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-[#F5F0E6]">{w.productName}</strong>
                  <span className="text-[11px] font-mono text-[#C8A96B] font-bold uppercase">
                    {w.status}
                  </span>
                </div>
                <div className="text-[#A5B7A0]">
                  Xaridor: <strong className="text-[#F5F0E6]">{w.buyerName}</strong> ({w.buyerPhone}) · Sotuvchi: <strong className="text-[#F5F0E6]">{w.sellerStoreName}</strong>
                </div>
                <p className="p-2 rounded bg-[#0D241D] text-[#F5F0E6] italic">
                  "{w.message}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CONTACT MESSAGES */}
      {activeTab === 'messages' && (
        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
            {t('admin.messages')} ({contactMessages.length})
          </h3>

          <div className="space-y-3 text-xs">
            {contactMessages.map((msg) => (
              <div
                key={msg.id}
                className="p-4 rounded-lg bg-[#102C24] border border-[#174638] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-[#F5F0E6]">{msg.subject || 'Mavzusi yo‘q'}</strong>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      msg.status === 'new'
                        ? 'bg-amber-950 text-amber-300'
                        : 'bg-emerald-950 text-emerald-300'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
                <div className="text-[#A5B7A0]">
                  Kimdan: <strong className="text-[#F5F0E6]">{msg.name}</strong> ({msg.email}) · {formatDate(msg.createdAt)}
                </div>
                <p className="p-2.5 rounded bg-[#0D241D] text-[#F5F0E6] leading-relaxed">
                  {msg.message}
                </p>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => updateMessageStatus(msg.id, 'resolved')}
                    className="px-3 py-1 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded text-xs"
                  >
                    Hal qilindi deb belgilash
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
            {t('admin.audit')}
          </h3>

          <div className="divide-y divide-[#174638]/60 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-[#C8A96B]">
                    {log.action}
                  </span>
                  <span className="font-mono text-[11px] text-[#A5B7A0]">
                    {formatDate(log.createdAt)}
                  </span>
                </div>
                <div className="text-[#A5B7A0]">
                  Masʼul: {log.actorEmail} · Obyekt turi: {log.entityType}
                </div>
                <p className="text-[#F5F0E6] text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SITE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-xl bg-[#0D241D] border border-[#174638] space-y-4">
          <h3 className="font-serif text-lg font-semibold text-[#F5F0E6] border-b border-[#174638] pb-3">
            {t('admin.settings')}
          </h3>

          {settingsSaved && (
            <div className="p-3 rounded bg-emerald-950/60 border border-emerald-700 text-emerald-200 text-xs">
              Sozlamalar yangilandi!
            </div>
          )}

          <form onSubmit={handleSettingsSave} className="space-y-4 text-xs max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A5B7A0] mb-1 font-medium">Kompaniya telefoni</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#A5B7A0] mb-1 font-medium">Elektron pochta</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#A5B7A0] mb-1 font-medium">Bosh ofis manzili</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A5B7A0] mb-1 font-medium">Yetkazib berish to‘lovi (UZS)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(Number(e.target.value))}
                  className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none tabular-nums"
                />
              </div>

              <div>
                <label className="block text-[#A5B7A0] mb-1 font-medium">Bepul yetkazish chegarasi (UZS)</label>
                <input
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="w-full p-2.5 rounded bg-[#102C24] border border-[#174638] text-[#F5F0E6] focus:border-[#C8A96B] focus:outline-none tabular-nums"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={requireApproval}
                  onChange={(e) => setRequireApproval(e.target.checked)}
                  className="rounded accent-[#C8A96B] w-4 h-4"
                />
                <span className="text-[#F5F0E6]">Yangi sotuvchilar arizasini majburiy moderatsiyadan o‘tkazish</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C8A96B] hover:bg-[#d6bc83] text-[#102C24] font-semibold text-xs tracking-wider uppercase rounded transition-colors"
            >
              Sozlamalarni saqlash
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
