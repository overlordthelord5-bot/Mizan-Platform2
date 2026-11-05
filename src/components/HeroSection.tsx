import React, { useState } from 'react';
import { Search, MapPin, Briefcase, ShieldCheck, CheckCircle2, ArrowLeft, Star, FileText } from 'lucide-react';
import { ThreeGoldScale } from './ThreeGoldScale';
import { EGYPTIAN_GOVERNORATES } from '../data/seedData';

interface HeroSectionProps {
  onSearch: (params: { search: string; governorate: string; specialty: string }) => void;
  onOpenBooking: () => void;
  onOpenTaxCalculator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenBooking,
  onOpenTaxCalculator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      search: searchTerm,
      governorate: selectedGovernorate,
      specialty: selectedSpecialty,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#142B43] via-[#0F2236] to-[#0B1725] text-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D6AE57]/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-[#1A385A]/40 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column (Content) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-right">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A385A]/80 border border-[#D6AE57]/30 text-xs sm:text-sm text-[#F4E7C5] shadow-sm">
              <ShieldCheck className="w-4 h-4 text-[#D6AE57]" />
              <span>محاسبون قانونيون معتمدون ومقيدون بسجل المحاسبين والمراجعين</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.2] text-white font-['Cairo']">
              استشارات محاسبية وضريبية{' '}
              <span className="gold-gradient-text block sm:inline">موثوقة لأعمالك وحياتك المالية</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              تواصل مباشرة مع نخبة من خبراء الضرائب والمحاسبين القانونيين في مصر. حلول فورية لمنظومة الفاتورة
              الإلكترونية، ضرائب الدخل والقيمة المضافة، وتأسيس الشركات لدى الهيئة العامة للاستثمار GAFI.
            </p>

            {/* Interactive Search Bar Box */}
            <div className="p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl">
              <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                {/* Search Text */}
                <div className="sm:col-span-5 relative">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ابحث باسم المحاسب، الخدمة، أو الموضوع..."
                    className="w-full bg-[#0B1725]/80 text-white placeholder-slate-400 text-sm rounded-xl pr-10 pl-3 py-3 border border-slate-700 focus:outline-none focus:border-[#D6AE57] transition-all"
                  />
                </div>

                {/* Governorate Select */}
                <div className="sm:col-span-3 relative">
                  <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => setSelectedGovernorate(e.target.value)}
                    className="w-full bg-[#0B1725]/80 text-white text-sm rounded-xl pr-10 pl-3 py-3 border border-slate-700 focus:outline-none focus:border-[#D6AE57] appearance-none transition-all cursor-pointer"
                  >
                    <option value="all">كل المحافظات</option>
                    {EGYPTIAN_GOVERNORATES.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specialty Select */}
                <div className="sm:col-span-2 relative">
                  <Briefcase className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full bg-[#0B1725]/80 text-white text-sm rounded-xl pr-10 pl-2 py-3 border border-slate-700 focus:outline-none focus:border-[#D6AE57] appearance-none transition-all cursor-pointer"
                  >
                    <option value="all">التخصص</option>
                    <option value="ضرائب">ضرائب عامة</option>
                    <option value="الفاتورة">فاتورة إلكترونية</option>
                    <option value="تأسيس">تأسيس شركات</option>
                    <option value="قيمة مضافة">قيمة مضافة</option>
                    <option value="قوائم">دفاتر وقوائم</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="sm:col-span-2 bg-gradient-to-r from-[#D6AE57] to-[#B88E33] hover:from-[#E2C378] hover:to-[#A37B24] text-[#0B1725] font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>بحث</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick action buttons & badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 rounded-xl bg-[#D6AE57] text-[#0B1725] font-bold text-sm hover:bg-[#E2C378] transition-all shadow-md flex items-center gap-2"
              >
                <span>احجز استشارة فورية</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenTaxCalculator}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#D6AE57]" />
                <span>احسب ضريبتك التقديرية</span>
              </button>
            </div>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800 text-right">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#D6AE57] font-['Cairo']">100%</div>
                <div className="text-xs text-slate-400">محاسبون مقيدون ومعتمدون</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white font-['Cairo']">18,500+</div>
                <div className="text-xs text-slate-400">استشارة محاسبية ناجحة</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-[#10B981] font-['Cairo'] flex items-center gap-1">
                  <span>4.94</span>
                  <Star className="w-5 h-5 fill-current text-amber-400" />
                </div>
                <div className="text-xs text-slate-400">متوسط تقييم العملاء</div>
              </div>
            </div>
          </div>

          {/* Right Column (3D Interactive Scale Canvas & Visual Glass Card) */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-gradient-to-br from-[#1A385A]/40 to-[#0B1725]/80 border border-[#D6AE57]/20 p-2 shadow-2xl overflow-hidden backdrop-blur-md">
              {/* Corner FinTech Badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142B43]/90 border border-[#D6AE57]/30 text-xs text-[#D6AE57]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>ضمان الحياد والشفافية</span>
              </div>

              {/* 3D Scale Render */}
              <ThreeGoldScale />

              {/* Bottom Financial Balance Card */}
              <div className="absolute bottom-4 left-4 right-4 z-20 p-3 rounded-2xl bg-[#0B1725]/90 border border-slate-700/80 backdrop-blur-md flex items-center justify-between text-xs">
                <div>
                  <div className="text-slate-400">عمولة المنصة الشفافة</div>
                  <div className="font-bold text-[#D6AE57] text-sm">15% فقط</div>
                </div>
                <div className="h-7 w-[1px] bg-slate-700" />
                <div>
                  <div className="text-slate-400">مستحق المحاسب الصافي</div>
                  <div className="font-bold text-white text-sm">85% من الأتعاب</div>
                </div>
                <div className="h-7 w-[1px] bg-slate-700" />
                <div className="text-left">
                  <div className="text-slate-400">طرق الدفع</div>
                  <div className="font-semibold text-emerald-400">ميزة • فوري • إنستاباي</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Accreditations Strip */}
      <div className="mt-12 pt-6 border-t border-slate-800/80 bg-[#0B1725]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-around gap-4 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#D6AE57]" />
              التحقق من قيد نقابة التجاريين المصرية
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#D6AE57]" />
              سجل المحاسبين والمراجعين بوزارة المالية
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#D6AE57]" />
              معايير مصلحة الضرائب المصرية (ETA)
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-[#D6AE57]" />
              حماية وسرية تامة للمستندات الضريبية
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
