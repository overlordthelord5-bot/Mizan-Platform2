import React, { useState, useEffect } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Smartphone,
  ShieldCheck,
  Video,
} from 'lucide-react';
import { Booking, WalletTransaction } from '../types';

interface AccountantDashboardProps {
  bookings: Booking[];
  onOpenConsultationRoom: (booking: Booking) => void;
}

export const AccountantDashboard: React.FC<AccountantDashboardProps> = ({
  bookings,
  onOpenConsultationRoom,
}) => {
  const [walletData, setWalletData] = useState<{
    balance: {
      totalEarnings: number;
      platformCommissionPaid: number;
      availableBalance: number;
      pendingBalance: number;
      currency: string;
    };
    transactions: WalletTransaction[];
  }>({
    balance: {
      totalEarnings: 892.5,
      platformCommissionPaid: 157.5,
      availableBalance: 892.5,
      pendingBalance: 425.0,
      currency: 'EGP',
    },
    transactions: [],
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [withdrawMethod, setWithdrawMethod] = useState<string>('INSTAPAY');
  const [withdrawDetails, setWithdrawDetails] = useState<string>('ipa@instapay');
  const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/wallets');
      const json = await res.json();
      if (json.success) {
        setWalletData(json.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;
    setIsSubmittingWithdraw(true);

    try {
      const res = await fetch('/api/wallets/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: withdrawAmount,
          method: withdrawMethod,
          details: withdrawDetails,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setWithdrawSuccessMsg(`تم تقديم طلب سحب ${withdrawAmount} ج.م بنجاح وجارٍ التحويل لحسابك!`);
        fetchWallet();
        setTimeout(() => {
          setShowWithdrawModal(false);
          setWithdrawSuccessMsg('');
        }, 2500);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingWithdraw(false);
    }
  };

  return (
    <div className="py-12 bg-[#F5F7FA] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#142B43] font-['Cairo']">
                لوحة تحكم المحاسب المعتمد والمحفظة
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                حساب موثق
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              متابعة الأتعاب، عمولة المنصة الشفافة (15%)، وسحب الأرباح الفوري عبر إنستاباي
            </p>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-6 py-2.5 rounded-xl bg-[#D6AE57] hover:bg-[#E2C378] text-[#0B1725] font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Wallet className="w-4 h-4" />
            <span>طلب سحب أرباح</span>
          </button>
        </div>

        {/* Financial Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Available Balance */}
          <div className="p-5 rounded-2xl bg-[#142B43] text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-[#D6AE57]/10 rounded-full blur-xl pointer-events-none" />
            <span className="text-xs text-slate-300 block">الرصيد المتاح للسحب الفوري</span>
            <div className="text-3xl font-black text-[#D6AE57] font-['Cairo'] mt-2">
              {walletData.balance.availableBalance.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-normal text-slate-300">ج.م</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-2">جاهز للتحويل عبر إنستاباي أو المحفظة</span>
          </div>

          {/* Card 2: Pending Balance */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 block">رصيد قيد الاستشارات النشطة</span>
            <div className="text-2xl font-black text-[#142B43] font-['Cairo'] mt-2">
              {walletData.balance.pendingBalance.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <span className="text-[11px] text-emerald-600 block mt-2">يُتاح فور إنهاء الاستشارة مع العميل</span>
          </div>

          {/* Card 3: Platform Commission Paid */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 block">عمولة المنصة المسددة (15%)</span>
            <div className="text-2xl font-black text-slate-700 font-['Cairo'] mt-2">
              {walletData.balance.platformCommissionPaid.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-2">شاملة تكاليف الغرف وتأمين المدفوعات</span>
          </div>

          {/* Card 4: Total Net Earnings */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 block">إجمالي أرباح المحاسب الصافية (85%)</span>
            <div className="text-2xl font-black text-[#10B981] font-['Cairo'] mt-2">
              {walletData.balance.totalEarnings.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-normal text-slate-500">ج.م</span>
            </div>
            <span className="text-[11px] text-slate-400 block mt-2">مستحقات معتمدة ومسجلة</span>
          </div>
        </div>

        {/* Upcoming Appointments Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-[#142B43] font-['Cairo'] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D6AE57]" />
            <span>جدول مواعيد استشارات العملاء</span>
          </h2>

          <div className="space-y-3">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl border border-slate-200 bg-[#F5F7FA]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#142B43] text-sm">{b.customerName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {b.bookingNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{b.serviceNameAr}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-[#142B43]">
                      {b.scheduledDate} ({b.startTime})
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">
                      مستحقك الصافي: {b.accountantAmount} ج.م (بعد 15% عمولة)
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenConsultationRoom(b)}
                  className="px-4 py-2 rounded-xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Video className="w-4 h-4 text-[#D6AE57]" />
                  <span>دخول الجلسة</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Transactions Audit Trail */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-[#142B43] font-['Cairo'] mb-4">
            سجل العمليات المالية والتحويلات المعتمدة
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 pb-2">
                  <th className="py-3 font-semibold">نوع العملية</th>
                  <th className="py-3 font-semibold">البيان والتفاصيل</th>
                  <th className="py-3 font-semibold">المبلغ</th>
                  <th className="py-3 font-semibold">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {walletData.transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.type === 'EARNING'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tx.type === 'WITHDRAWAL'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.type === 'EARNING' ? (
                          <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowUpRight className="w-3 h-3 text-blue-600" />
                        )}
                        {tx.type === 'EARNING'
                          ? 'إيداع أتعاب'
                          : tx.type === 'WITHDRAWAL'
                          ? 'سحب أرباح'
                          : 'عمولة منصة'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">{tx.description}</td>
                    <td className="py-3 font-bold text-[#142B43]">
                      {tx.type === 'EARNING' ? `+${tx.amount}` : `-${tx.amount}`} ج.م
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">{tx.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Withdrawal Request Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <h3 className="text-xl font-bold font-['Cairo'] text-[#142B43] mb-1">
              طلب سحب أرباح من المحفظة
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              الرصيد المتاح للسحب:{' '}
              <span className="font-bold text-[#D6AE57]">
                {walletData.balance.availableBalance} ج.م
              </span>
            </p>

            {withdrawSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{withdrawSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المبلغ المطلوب سحبه (ج.م):
                  </label>
                  <input
                    type="number"
                    min="100"
                    max={walletData.balance.availableBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full bg-[#F5F7FA] text-sm font-bold text-[#142B43] rounded-xl p-3 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    طريقة التحويل في مصر:
                  </label>
                  <select
                    value={withdrawMethod}
                    onChange={(e) => setWithdrawMethod(e.target.value)}
                    className="w-full bg-[#F5F7FA] text-xs text-[#142B43] rounded-xl p-3 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
                  >
                    <option value="INSTAPAY">إنستاباي (InstaPay) - تحويل فوري</option>
                    <option value="BANK_TRANSFER">تحويل بنكي مصري (IBAN)</option>
                    <option value="VODAFONE_CASH">محفظة فودافون كاش / إلكترونية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    بيانات الحساب / المعرف (IPA أو رقم الموبايل أو الآيبان):
                  </label>
                  <input
                    type="text"
                    value={withdrawDetails}
                    onChange={(e) => setWithdrawDetails(e.target.value)}
                    placeholder="مثال: username@instapay أو +2010xxxxxxxx"
                    className="w-full bg-[#F5F7FA] text-xs text-[#142B43] rounded-xl p-3 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingWithdraw}
                    className="flex-1 py-3 rounded-xl bg-[#D6AE57] hover:bg-[#E2C378] text-[#0B1725] font-bold text-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingWithdraw ? 'جارٍ تسجيل الطلب...' : 'تأكيد طلب السحب'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="px-4 py-3 rounded-xl border border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
