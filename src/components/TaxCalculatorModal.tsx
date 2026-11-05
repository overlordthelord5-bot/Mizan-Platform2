import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { calculateEgyptianIncomeTaxEstimate } from '../utils/finance';

interface TaxCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookConsultation: () => void;
}

export const TaxCalculatorModal: React.FC<TaxCalculatorModalProps> = ({
  isOpen,
  onClose,
  onBookConsultation,
}) => {
  const [annualIncome, setAnnualIncome] = useState<number>(120000); // 120,000 EGP default

  if (!isOpen) return null;

  const estimate = calculateEgyptianIncomeTaxEstimate(annualIncome);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#D6AE57]/20 text-[#B88E33] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#142B43] font-['Cairo']">
              حاسبة ضريبة الدخل التقديرية في مصر
            </h3>
            <p className="text-xs text-slate-500">وفقاً لتعديلات قانون الضريبة على الدخل 91 لسنة 2005</p>
          </div>
        </div>

        {/* Input */}
        <div className="my-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            صافي الدخل السنوي الخاضع للضريبة (بالجنيه المصري):
          </label>
          <div className="relative">
            <input
              type="number"
              step="5000"
              min="0"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
              className="w-full bg-[#F5F7FA] text-lg font-bold text-[#142B43] rounded-2xl pr-4 pl-16 py-3 border border-slate-300 focus:outline-none focus:border-[#D6AE57]"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              ج.م / سنوياً
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            * الشريحة الأولى معفاة بالكامل حتى 40,000 ج.م سنوياً.
          </span>
        </div>

        {/* Results Box */}
        <div className="p-4 rounded-2xl bg-[#0B1725] text-white space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-300">إجمالي الضريبة التقديرية المستحقة:</span>
            <span className="text-2xl font-black text-[#D6AE57] font-['Cairo']">
              {estimate.totalTax.toLocaleString('ar-EG')}{' '}
              <span className="text-xs font-normal text-slate-300">ج.م</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400">سعر الضريبة الفعلي (Effective Tax Rate):</span>
            <span className="font-bold text-emerald-400">{estimate.effectiveRate}%</span>
          </div>
        </div>

        {/* Slabs Breakdown */}
        <div className="space-y-2 mb-6 max-h-48 overflow-y-auto">
          <span className="text-xs font-bold text-slate-700 block">تفاصيل توزيع الشرائح الضريبية:</span>
          {estimate.slabs.map((slab, i) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-semibold text-slate-700 block text-[11px]">{slab.nameAr}</span>
                <span className="text-[10px] text-slate-500">
                  خاضع: {slab.bracketAmount.toLocaleString('ar-EG')} ج.م × نسبة {slab.rate * 100}%
                </span>
              </div>
              <span className="font-bold text-[#142B43]">{slab.tax.toLocaleString('ar-EG')} ج.م</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 mb-6 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            هذه النتائج استرشادية تقديرية للأفراد والمهن الحرة، ولا تشمل الخصومات الإضافية للمصروفات الفعلية.
            ننصحك بمراجعة إقرارك مع محاسب قانوني معتمد لتطبيق نسب الإعفاء الصحيحة قانوناً.
          </span>
        </div>

        <button
          onClick={() => {
            onClose();
            onBookConsultation();
          }}
          className="w-full py-3.5 rounded-2xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>حجز استشارة فحص ضريبي مع محاسب قانوني</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
