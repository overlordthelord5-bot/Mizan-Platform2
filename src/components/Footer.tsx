import React from 'react';
import { Scale, ShieldCheck, Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenTaxCalculator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenTaxCalculator }) => {
  return (
    <footer className="bg-[#0B1725] text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D6AE57] to-[#B88E33] p-0.5">
                <div className="w-full h-full bg-[#142B43] rounded-[10px] flex items-center justify-center">
                  <Scale className="w-5 h-5 text-[#D6AE57]" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-white font-['Cairo'] tracking-tight">مِيزان</span>
                <span className="text-xs font-bold text-[#D6AE57] mr-1.5 uppercase">MEEZAN</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              المنصة المصرية المعتمدة للاستشارات المحاسبية والضريبية للأفراد والشركات. نربطك بنخبة المحاسبين
              القانونيين المقيدين بنقابة التجاريين وسجل المحاسبين والمراجعين بوزارة المالية.
            </p>

            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D6AE57]" />
                <span>القرية الذكية / التجمع الخامس، القاهرة، مصر</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D6AE57]" />
                <span>+20 2 3344 5566</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D6AE57]" />
                <span>support@meezan.eg</span>
              </div>
            </div>
          </div>

          {/* Platform Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Cairo']">
              خدمات المنصة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavClick('accountants')}
                  className="hover:text-[#D6AE57] transition-colors cursor-pointer"
                >
                  دليل المحاسبين القانونيين
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('services')}
                  className="hover:text-[#D6AE57] transition-colors cursor-pointer"
                >
                  استشارات الفاتورة والإيصال الإلكتروني
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('services')}
                  className="hover:text-[#D6AE57] transition-colors cursor-pointer"
                >
                  ضرائب الدخل والقيمة المضافة
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavClick('services')}
                  className="hover:text-[#D6AE57] transition-colors cursor-pointer"
                >
                  تأسيس الشركات لدى هيئة الاستثمار GAFI
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTaxCalculator}
                  className="hover:text-[#D6AE57] transition-colors cursor-pointer text-[#D6AE57]"
                >
                  حاسبة شرائح ضريبة الدخل المصرية
                </button>
              </li>
            </ul>
          </div>

          {/* Guarantees & Transparency (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Cairo']">
              الشفافية والأمان
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>عمولة المنصة 15% واضحة دون أي رسوم خفية</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>مستحق المحاسب 85% من قيمة الجلسة</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>حماية وتشفير المستندات الضريبية</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>استرداد كامل للأموال وفق سياسة الإلغاء</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-['Cairo']">
              طرق الدفع في مصر
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                ميزة (Meeza)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                فوري (Fawry)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                إنستاباي (InstaPay)
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                فودافون كاش
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Visa / MasterCard
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} مِيزان (MEEZAN) — جمهورية مصر العربية
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer">الشروط والأحكام</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">سياسة الخصوصية</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">سياسة الاسترداد والإلغاء</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">ميثاق شرف المهنة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
