import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Percent,
  CheckCircle2,
  XCircle,
  FileCheck2,
  AlertCircle,
  Save,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { Accountant, PlatformMetrics } from '../types';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [pendingAccountants, setPendingAccountants] = useState<Accountant[]>([]);
  const [commissionInput, setCommissionInput] = useState<number>(15);
  const [isUpdatingCommission, setIsUpdatingCommission] = useState(false);
  const [commissionFeedback, setCommissionFeedback] = useState('');

  const fetchAdminData = async () => {
    try {
      const [mRes, vRes] = await Promise.all([
        fetch('/api/admin/metrics'),
        fetch('/api/admin/verifications'),
      ]);
      const mJson = await mRes.json();
      const vJson = await vRes.json();

      if (mJson.success) {
        setMetrics(mJson.data);
        setCommissionInput(Math.round(mJson.data.platformCommissionRate * 100));
      }
      if (vJson.success) {
        setPendingAccountants(vJson.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingCommission(true);
    try {
      const res = await fetch('/api/admin/commission', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate: commissionInput / 100 }),
      });
      const json = await res.json();
      if (json.success) {
        setCommissionFeedback(`تم تعديل نسبة عمولة المنصة بنجاح إلى ${commissionInput}%`);
        fetchAdminData();
        setTimeout(() => setCommissionFeedback(''), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdatingCommission(false);
    }
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleVerificationDecision = async (accountantId: string, decision: 'VERIFIED' | 'REJECTED') => {
    try {
      const res = await fetch(`/api/admin/verifications/${accountantId}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const json = await res.json();
      if (json.success) {
        setToastMessage(
          decision === 'VERIFIED'
            ? 'تم اعتماد المحاسب رسمياً وإضافة شارة التوثيق لملفه'
            : 'تم رفض طلب التوثيق وتنبيه المحاسب'
        );
        setTimeout(() => setToastMessage(null), 4000);
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-12 bg-[#F5F7FA] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B43] font-['Cairo']">
              لوحة تحكم إدارة منصة مِيزان
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#142B43] text-[#D6AE57] text-xs font-bold border border-[#D6AE57]/30">
              Super Admin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إدارة المنصة، تدقيق وثائق المحاسبين القانونيين، والتحكم بنسب العمولات والتدفقات المالية
          </p>
        </div>

        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Financial & Platform Metrics Cards */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block">إجمالي إيرادات المنصة (EGP)</span>
              <div className="text-2xl font-black text-[#142B43] font-['Cairo'] mt-2">
                {metrics.totalRevenueEGP.toLocaleString('ar-EG')}{' '}
                <span className="text-xs font-normal text-slate-500">ج.م</span>
              </div>
              <span className="text-[11px] text-emerald-600 block mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                معاملات مسددة بالكامل
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block">
                أرباح المنصة الصافية ({metrics.platformCommissionRate * 100}%)
              </span>
              <div className="text-2xl font-black text-[#D6AE57] font-['Cairo'] mt-2">
                {metrics.platformCommissionEGP.toLocaleString('ar-EG')}{' '}
                <span className="text-xs font-normal text-slate-500">ج.م</span>
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">عمولة المنصة المقتطعة</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block">المحاسبون المعتمدون والمقيدون</span>
              <div className="text-2xl font-black text-[#10B981] font-['Cairo'] mt-2">
                {metrics.verifiedAccountants}{' '}
                <span className="text-xs font-normal text-slate-500">مستشار</span>
              </div>
              <span className="text-[11px] text-amber-600 block mt-2">
                {metrics.pendingVerifications} طلبات قيد الفحص الإداري
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 block">إجمالي الاستشارات والحجوزات</span>
              <div className="text-2xl font-black text-[#142B43] font-['Cairo'] mt-2">
                {metrics.totalBookings}
              </div>
              <span className="text-[11px] text-slate-400 block mt-2">عبر كافة المحافظات المصرية</span>
            </div>
          </div>
        )}

        {/* Dynamic Platform Commission Manager */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#142B43] font-['Cairo'] flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#D6AE57]" />
                <span>إدارة نسبة عمولة المنصة الديناميكية (Platform Commission Rate)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                النسبة الافتراضية 15% للمنصة و85% للمحاسب. التعديل هنا ينعكس فورياً على جميع الحجوزات الجديدة.
              </p>
            </div>

            <form onSubmit={handleUpdateCommission} className="flex items-center gap-3">
              <div className="relative w-32">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(Number(e.target.value))}
                  className="w-full bg-[#F5F7FA] text-base font-bold text-[#142B43] rounded-xl pr-3 pl-8 py-2 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  %
                </span>
              </div>

              <button
                type="submit"
                disabled={isUpdatingCommission}
                className="px-4 py-2 rounded-xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>حفظ النسبة</span>
              </button>
            </form>
          </div>

          {commissionFeedback && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{commissionFeedback}</span>
            </div>
          )}
        </div>

        {/* Accountant Verification Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-[#142B43] font-['Cairo'] mb-2 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#D6AE57]" />
            <span>طلبات توثيق المحاسبين الجدد (Syndicate & CPA Verification Queue)</span>
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            لا يتم منح شارة "محاسب معتمد" إلا بعد التأكد من صحة بطاقة الرقم القومي وكارنيه نقابة التجاريين.
          </p>

          {pendingAccountants.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
              لا توجد طلبات توثيق معلقة حالياً. جميع المحاسبين في المنصة تم تدقيقهم واعتمادهم.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingAccountants.map((acc) => (
                <div
                  key={acc.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-[#F5F7FA]/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={acc.avatar}
                      alt=""
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#142B43] text-sm">{acc.fullName}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                          قيد المراجعة الإدارية
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{acc.headline}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                        <span>{acc.city}</span>
                        <span>•</span>
                        <span>خبرة {acc.experienceYears} سنوات</span>
                        <span>•</span>
                        <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {acc.syndicateRegistrationNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents & Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                    <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200">
                      <span className="font-bold block text-[11px] text-slate-700 mb-1">
                        المستندات المرفقة ({acc.documents.length}):
                      </span>
                      {acc.documents.map((d) => (
                        <span key={d.id} className="block text-[11px] text-blue-600 hover:underline">
                          📄 {d.title} ({d.fileSize})
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVerificationDecision(acc.id, 'VERIFIED')}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>اعتماد وتوثيق</span>
                      </button>

                      <button
                        onClick={() => handleVerificationDecision(acc.id, 'REJECTED')}
                        className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>رفض</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
