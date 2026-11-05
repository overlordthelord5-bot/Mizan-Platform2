import React, { useState } from 'react';
import {
  Receipt,
  Percent,
  QrCode,
  Building2,
  BookOpenCheck,
  Laptop,
  Clock,
  Video,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { Category, Service } from '../types';

interface ServicesGridProps {
  categories: Category[];
  services: Service[];
  onSelectService: (service: Service) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Receipt: <Receipt className="w-5 h-5" />,
  Percent: <Percent className="w-5 h-5" />,
  QrCode: <QrCode className="w-5 h-5" />,
  Building2: <Building2 className="w-5 h-5" />,
  BookOpenCheck: <BookOpenCheck className="w-5 h-5" />,
  Laptop: <Laptop className="w-5 h-5" />,
};

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  categories,
  services,
  onSelectService,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredServices =
    activeCategory === 'all'
      ? services
      : services.filter((s) => s.categoryId === activeCategory);

  return (
    <section className="py-16 sm:py-20 bg-[#F5F7FA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142B43]/10 text-[#142B43] text-xs font-bold uppercase tracking-wider mb-3">
            <span>دليل الخدمات المحاسبية والضريبية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142B43] font-['Cairo'] tracking-tight">
            حلول ضريبية ومالية متكاملة توافق القوانين المصرية
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            استشارات فورية عبر الفيديو مع محاسبين قانونيين معتمدين لتسوية مواقفك الضريبية وإعداد دفاترك بأمان تام.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === 'all'
                ? 'bg-[#142B43] text-white shadow-md'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            جميع الخدمات ({services.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#142B43] text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span className="text-[#D6AE57]">{ICON_MAP[cat.iconName] || <Receipt className="w-4 h-4" />}</span>
              <span>{cat.nameAr}</span>
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const category = categories.find((c) => c.id === service.categoryId);

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#D6AE57] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Icon & Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#142B43]/5 text-[#142B43] border border-[#142B43]/10">
                      {category?.nameAr || 'خدمة استشارية'}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#D6AE57]/15 text-[#B88E33] flex items-center justify-center group-hover:scale-110 transition-transform">
                      {category ? ICON_MAP[category.iconName] : <Receipt className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#142B43] group-hover:text-[#B88E33] transition-colors leading-snug">
                    {service.nameAr}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {service.descriptionAr}
                  </p>

                  {/* Required Documents Tag */}
                  {service.requiredDocs && service.requiredDocs.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700 block mb-1">المستندات المطلوبة للجلسة:</span>
                      <ul className="space-y-1">
                        {service.requiredDocs.map((doc, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-slate-600">
                            <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                            <span className="truncate">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer with Price and Booking Trigger */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-500">سعر الاستشارة</div>
                    <div className="text-xl font-extrabold text-[#142B43] font-['Cairo']">
                      {service.basePrice}{' '}
                      <span className="text-xs font-semibold text-slate-500">ج.م</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {service.durationMinutes} دقيقة
                    </span>
                    <button
                      onClick={() => onSelectService(service)}
                      className="px-3.5 py-2 rounded-xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow flex items-center gap-1 cursor-pointer"
                    >
                      <span>احجز الآن</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
