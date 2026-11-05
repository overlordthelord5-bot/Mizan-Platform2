import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Calendar,
  Clock,
  FileText,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Accountant, Booking, Service } from '../types';
import { calculateCommission } from '../utils/finance';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountants: Accountant[];
  services: Service[];
  preselectedAccountant?: Accountant | null;
  preselectedService?: Service | null;
  onBookingSuccess: (booking: Booking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  accountants,
  services,
  preselectedAccountant,
  preselectedService,
  onBookingSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [selectedAccountantId, setSelectedAccountantId] = useState<string>(
    preselectedAccountant?.id || accountants[0]?.id || ''
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    preselectedService?.id || services[0]?.id || ''
  );
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-06');
  const [selectedSlot, setSelectedSlot] = useState<string>('12:00');
  const [caseNotes, setCaseNotes] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; url: string }[]>([
    { name: 'commercial_tax_card.pdf', size: '1.2 MB', url: '#' },
  ]);
  const [paymentMethod, setPaymentMethod] = useState<string>('VODAFONE_CASH');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const currentAccountant = accountants.find((a) => a.id === selectedAccountantId) || accountants[0];
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const totalAmount = currentService ? currentService.basePrice : 450;
  const split = calculateCommission(totalAmount, 0.15); // 15% platform commission

  const handleNextStep = () => {
    setStep((prev) => (Math.min(prev + 1, 6) as any));
  };

  const handlePrevStep = () => {
    setStep((prev) => (Math.max(prev - 1, 1) as any));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setAttachedFiles((prev) => [
        ...prev,
        {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          url: '#',
        },
      ]);
    }
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountantId: currentAccountant.id,
          serviceId: currentService.id,
          scheduledDate: selectedDate,
          startTime: selectedSlot,
          customerNotes: caseNotes,
          attachedDocs: attachedFiles,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Simulate sandbox payment execution
      const payRes = await fetch('/api/payments/process-sandbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: data.data.id,
          paymentMethod: paymentMethod as any,
        }),
      });

      const payData = await payRes.json();
      setCreatedBooking(payData.data);
      setStep(6); // Success confirmation step

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء إتمام الحجز: ' + (err.message || 'يرجى المحاولة مرة أخرى'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#142B43] px-6 py-4 text-white flex items-center justify-between border-b border-[#D6AE57]/20">
          <div>
            <h3 className="text-lg font-bold font-['Cairo'] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#D6AE57]" />
              <span>حجز استشارة محاسبية وضريبية</span>
            </h3>
            <p className="text-xs text-slate-300">خطوات حجز مؤكدة وشفافة بنسبة 100%</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Step Bar (Steps 1 to 5) */}
        {step < 6 && (
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className={`font-semibold ${step >= 1 ? 'text-[#142B43]' : 'text-slate-400'}`}>
              1. الخدمة والمحاسب
            </span>
            <span className="text-slate-300">←</span>
            <span className={`font-semibold ${step >= 2 ? 'text-[#142B43]' : 'text-slate-400'}`}>
              2. الموعد
            </span>
            <span className="text-slate-300">←</span>
            <span className={`font-semibold ${step >= 3 ? 'text-[#142B43]' : 'text-slate-400'}`}>
              3. التفاصيل والمستندات
            </span>
            <span className="text-slate-300">←</span>
            <span className={`font-semibold ${step >= 4 ? 'text-[#142B43]' : 'text-slate-400'}`}>
              4. التكاليف والعمولة
            </span>
            <span className="text-slate-300">←</span>
            <span className={`font-semibold ${step >= 5 ? 'text-[#142B43]' : 'text-slate-400'}`}>
              5. الدفع
            </span>
          </div>
        )}

        {/* Step Content */}
        <div className="p-6">
          {/* STEP 1: Service & Accountant Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اختر الخدمة المحاسبية أو الضريبية:
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full bg-[#F5F7FA] text-sm text-[#142B43] rounded-xl p-3 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.nameAr} - ({srv.basePrice} ج.م)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اختر المستشار المحاسبي المعتمد:
                </label>
                <select
                  value={selectedAccountantId}
                  onChange={(e) => setSelectedAccountantId(e.target.value)}
                  className="w-full bg-[#F5F7FA] text-sm text-[#142B43] rounded-xl p-3 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
                >
                  {accountants.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.fullName} - {acc.city} ({acc.experienceYears} سنة خبرة)
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Preview Card */}
              {currentAccountant && currentService && (
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center gap-3">
                  <img
                    src={currentAccountant.avatar}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover border border-amber-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-[#142B43]">{currentAccountant.fullName}</h4>
                    <p className="text-xs text-slate-600 truncate">{currentService.nameAr}</p>
                    <span className="text-xs font-bold text-[#B88E33] block mt-0.5">
                      مدة الجلسة: {currentService.durationMinutes} دقيقة فيديو مباشر
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Choose Date & Time */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اختر يوم الاستشارة:
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-[#F5F7FA] text-sm text-[#142B43] rounded-xl p-3 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  اختر الفترة الزمنية المناسبة:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {currentAccountant.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedSlot === slot
                          ? 'bg-[#142B43] text-white border-[#142B43] shadow'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Case Details & Docs */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  تفاصيل المشكلة أو الاستفسار المحاسبي:
                </label>
                <textarea
                  rows={3}
                  value={caseNotes}
                  onChange={(e) => setCaseNotes(e.target.value)}
                  placeholder="مثال: أحتاج مراجعة فواتير الربع السنوي لضريبة القيمة المضافة والتأكد من مطابقة أرقام الفاتورة الإلكترونية..."
                  className="w-full bg-[#F5F7FA] text-sm text-[#142B43] rounded-xl p-3 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  إرفاق مستندات (بطاقة ضريبية، فواتير، كشف حساب):
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-[#D6AE57] transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 block">انقر لرفع ملف PDF أو صورة</span>
                  <span className="text-[10px] text-slate-400">حماية وتشفير تام للمستندات</span>
                </div>

                {/* Uploaded List */}
                <div className="mt-2 space-y-1">
                  {attachedFiles.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <FileText className="w-3.5 h-3.5 text-[#D6AE57]" />
                        <span className="truncate">{f.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0">{f.size}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Fee Breakdown & Commission Transparency */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-[#142B43] mb-3 uppercase tracking-wider">
                  تفاصيل التكلفة وتوزيع العمولة الشفاف
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>قيمة الاستشارة المحددة:</span>
                    <span className="font-bold text-[#142B43]">{totalAmount} ج.م</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>عمولة منصة مِيزان (15%):</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded">
                        شاملة استضافة الغرفة والضمان
                      </span>
                    </span>
                    <span className="font-bold text-slate-700">{split.platformFee} ج.م</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>مستحق المحاسب الصافي (85%):</span>
                    <span className="font-bold text-slate-700">{split.accountantNet} ج.م</span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-[#142B43]">
                    <span>المبلغ الإجمالي المستحق للسداد:</span>
                    <span className="text-base text-[#D6AE57] font-black">{totalAmount} ج.م</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  ضمان استرداد 100% في حال عدم حضور المحاسب أو الإلغاء قبل الموعد بـ 24 ساعة.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: Egyptian Sandbox Payment */}
          {step === 5 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اختر وسيلة الدفع (بيئة تجريبية معتمدة Sandbox):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'VODAFONE_CASH', name: 'فودافون كاش / محافظ إلكترونية', desc: 'خصم فوري من المحفظة' },
                  { id: 'INSTAPAY', name: 'إنستاباي (InstaPay)', desc: 'تحويل لحظي مصري معتمد' },
                  { id: 'FAWRY', name: 'فوري (Fawry Pay)', desc: 'دفع بكود مرجعي' },
                  { id: 'MEEZA', name: 'بطاقة ميزة الوطنية', desc: 'كارت ميزة البنكي المصري' },
                  { id: 'CARD_VISA_MASTERCARD', name: 'بطاقات فيزا / ماستركارد', desc: 'دفع بالبطاقة الائتمانية' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-3 ${
                      paymentMethod === m.id
                        ? 'border-[#D6AE57] bg-amber-50/50 text-[#142B43] shadow-xs ring-1 ring-[#D6AE57]'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-[#D6AE57] shrink-0" />
                    <div>
                      <div className="text-xs font-bold">{m.name}</div>
                      <div className="text-[10px] text-slate-500">{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>المبلغ المطلوب سداده الآن:</span>
                <span className="font-extrabold text-[#142B43] text-sm">{totalAmount} جنيه مصري</span>
              </div>
            </div>
          )}

          {/* STEP 6: Success Confirmation Screen */}
          {step === 6 && createdBooking && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[#142B43] font-['Cairo']">
                  تم تأكيد حجز الاستشارة وسداد الرسوم بنجاح!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  رقم الحجز المرجعي:{' '}
                  <span className="font-mono font-bold text-[#142B43] bg-slate-100 px-2 py-0.5 rounded">
                    {createdBooking.bookingNumber}
                  </span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-xs text-right space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">المحاسب المعتمد:</span>
                  <span className="font-bold text-[#142B43]">{createdBooking.accountantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الخدمة:</span>
                  <span className="font-semibold text-slate-700">{createdBooking.serviceNameAr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">الموعد المحدد:</span>
                  <span className="font-bold text-[#142B43]">
                    {createdBooking.scheduledDate} في تمام {createdBooking.startTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">طريقة الدفع:</span>
                  <span className="font-semibold text-emerald-700">{createdBooking.paymentMethod} (مدفوع)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    onBookingSuccess(createdBooking);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D6AE57]" />
                  <span>الدخول لغرفة الاستشارة الافتراضية الآن</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 6 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السابق</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-5 py-2.5 rounded-xl bg-[#142B43] hover:bg-[#0B1725] text-white text-xs font-bold transition-all shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>المتابعة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleExecutePayment}
                className="px-6 py-2.5 rounded-xl bg-[#D6AE57] hover:bg-[#E2C378] text-[#0B1725] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>جارٍ معالجة السداد وتأكيد الحجز...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>تأكيد وسداد ({totalAmount} ج.م)</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
