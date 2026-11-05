import React from 'react';
import {
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  Video,
  Download,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Booking } from '../types';

interface CustomerDashboardProps {
  bookings: Booking[];
  onOpenConsultationRoom: (booking: Booking) => void;
  onBookNew: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  bookings,
  onOpenConsultationRoom,
  onBookNew,
}) => {
  const activeBookings = bookings.filter((b) => ['CONFIRMED', 'IN_PROGRESS'].includes(b.status));
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === 'PAID')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="py-12 bg-[#F5F7FA] min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#142B43] font-['Cairo']">
              لوحة تحكم العميل والحجوزات
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              إدارة مواعيد استشاراتك الضريبية والمحاسبية ومتابعة المستندات والفواتير
            </p>
          </div>

          <button
            onClick={onBookNew}
            className="px-5 py-2.5 rounded-xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow-md cursor-pointer shrink-0"
          >
            + حجز استشارة جديدة
          </button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 block">الاستشارات القادمة والنشطة</span>
            <span className="text-2xl font-black text-[#142B43] font-['Cairo'] mt-1 block">
              {activeBookings.length}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 block">الاستشارات المكتملة</span>
            <span className="text-2xl font-black text-[#10B981] font-['Cairo'] mt-1 block">
              {completedBookings.length}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 block">إجمالي المدفوعات المسددة</span>
            <span className="text-2xl font-black text-[#D6AE57] font-['Cairo'] mt-1 block">
              {totalSpent.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-normal text-slate-500">ج.م</span>
            </span>
          </div>
        </div>

        {/* Active & Upcoming Consultations Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-[#142B43] font-['Cairo'] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#D6AE57]" />
            <span>الاستشارات النشطة والقادمة</span>
          </h2>

          {activeBookings.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              لا توجد استشارات قادمة حالياً. اضغط "حجز استشارة جديدة" للبدء.
            </div>
          ) : (
            <div className="space-y-3">
              {activeBookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-[#D6AE57] transition-all bg-[#F5F7FA]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={b.accountantAvatar}
                      alt=""
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#142B43] text-sm">{b.accountantName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          {b.bookingNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{b.serviceNameAr}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-[#142B43]">
                          <Calendar className="w-3.5 h-3.5 text-[#D6AE57]" />
                          {b.scheduledDate} ({b.startTime})
                        </span>
                        <span>•</span>
                        <span>{b.durationMinutes} دقيقة</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={() => onOpenConsultationRoom(b)}
                      className="px-4 py-2.5 rounded-xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Video className="w-4 h-4 text-[#D6AE57]" />
                      <span>دخول غرفة الاستشارة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Consultation History Table */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-[#142B43] font-['Cairo'] mb-4">
            سجل الاستشارات السابقة والفواتير
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 pb-2">
                  <th className="py-3 font-semibold">رقم الحجز</th>
                  <th className="py-3 font-semibold">المحاسب المعتمد</th>
                  <th className="py-3 font-semibold">الخدمة</th>
                  <th className="py-3 font-semibold">تاريخ الجلسة</th>
                  <th className="py-3 font-semibold">المبلغ المسدد</th>
                  <th className="py-3 font-semibold">الحالة</th>
                  <th className="py-3 font-semibold">الإيصال</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80">
                    <td className="py-3.5 font-mono text-slate-700 font-bold">{b.bookingNumber}</td>
                    <td className="py-3.5 font-semibold text-[#142B43]">{b.accountantName}</td>
                    <td className="py-3.5 text-slate-600 truncate max-w-[200px]">{b.serviceNameAr}</td>
                    <td className="py-3.5 text-slate-500">{b.scheduledDate}</td>
                    <td className="py-3.5 font-bold text-[#142B43]">{b.totalAmount} ج.م</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status === 'COMPLETED'
                          ? 'مكتملة'
                          : b.status === 'CONFIRMED'
                          ? 'مؤكدة'
                          : b.status}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <button
                        onClick={() => {
                          const receiptContent = `==============================================\nمنصة مِيزان MEEZAN للاستشارات المحاسبية والضريبية\nإيصال سداد ضريبي معتمد\n==============================================\nرقم الحجز: ${b.bookingNumber}\nالمحاسب المعتمد: ${b.accountantName}\nالخدمة: ${b.serviceTitle}\nتاريخ الجلسة: ${b.sessionDate} (${b.sessionTime})\nالمبلغ المسدد: ${b.totalAmount} ج.م\nطريقة الدفع: ${b.paymentMethod || 'إلكتروني'}\nحالة الدفع: مسدد بالكامل (PAID)\nعمولة المنصة: 15% (مشمولة بالأتعاب)\n==============================================\nشكراً لثقتكم بمنصة مِيزان - جمهورية مصر العربية\n`;
                          const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `meezan-receipt-${b.bookingNumber}.txt`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="text-slate-600 hover:text-[#D6AE57] transition-colors p-1"
                        title="تحميل إيصال السداد"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
