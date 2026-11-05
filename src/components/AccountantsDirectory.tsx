import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  Award,
  Filter,
  ArrowUpDown,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Accountant } from '../types';
import { EGYPTIAN_GOVERNORATES } from '../data/seedData';

interface AccountantsDirectoryProps {
  accountants: Accountant[];
  onSelectAccountant: (accountant: Accountant) => void;
  onBookWithAccountant: (accountant: Accountant) => void;
  initialFilter?: { search?: string; governorate?: string; specialty?: string };
}

export const AccountantsDirectory: React.FC<AccountantsDirectoryProps> = ({
  accountants,
  onSelectAccountant,
  onBookWithAccountant,
  initialFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialFilter?.search || '');
  const [selectedGov, setSelectedGov] = useState(initialFilter?.governorate || 'all');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialFilter?.specialty || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'priceAsc' | 'priceDesc'>('rating');

  // Filter & sort logic
  let filtered = accountants.filter((a) => {
    // Only verified accountants or those with explicit status
    const matchesSearch =
      !searchTerm ||
      a.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesGov = selectedGov === 'all' || a.governorate === selectedGov;

    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      a.skills.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase())) ||
      a.headline.toLowerCase().includes(selectedSpecialty.toLowerCase());

    const matchesPrice = a.hourlyRate <= maxPrice;
    const matchesRating = a.ratingAverage >= minRating;

    return matchesSearch && matchesGov && matchesSpecialty && matchesPrice && matchesRating;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'rating') return b.ratingAverage - a.ratingAverage;
    if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
    if (sortBy === 'priceAsc') return a.hourlyRate - b.hourlyRate;
    if (sortBy === 'priceDesc') return b.hourlyRate - a.hourlyRate;
    return 0;
  });

  return (
    <section className="py-12 sm:py-16 bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D6AE57]/15 text-[#B88E33] text-xs font-bold uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>دليل الممارسين المهنيين المعتمدين</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#142B43] font-['Cairo']">
              المحاسبون والمستشارون الماليون في مصر
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              جميع المحاسبين تم التحقق من قيدهم بسجل المحاسبين والمراجعين ونقابة التجاريين.
            </p>
          </div>

          <div className="text-sm text-slate-500">
            تم العثور على <span className="font-bold text-[#142B43]">{filtered.length}</span> مستشار متاح
          </div>
        </div>

        {/* Filter Controls Box */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالاسم، التخصص، أو الموضوع..."
                className="w-full bg-[#F5F7FA] text-sm text-[#142B43] rounded-xl pr-10 pl-3 py-2.5 border border-slate-200 focus:outline-none focus:border-[#D6AE57]"
              />
            </div>

            {/* Governorate Filter */}
            <div className="relative">
              <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedGov}
                onChange={(e) => setSelectedGov(e.target.value)}
                className="w-full bg-[#F5F7FA] text-sm text-[#142B43] rounded-xl pr-10 pl-3 py-2.5 border border-slate-200 focus:outline-none focus:border-[#D6AE57] appearance-none cursor-pointer"
              >
                <option value="all">جميع المحافظات</option>
                {EGYPTIAN_GOVERNORATES.map((gov) => (
                  <option key={gov.id} value={gov.id}>
                    {gov.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Specialty Filter */}
            <div className="relative">
              <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full bg-[#F5F7FA] text-sm text-[#142B43] rounded-xl pr-10 pl-3 py-2.5 border border-slate-200 focus:outline-none focus:border-[#D6AE57] appearance-none cursor-pointer"
              >
                <option value="all">جميع التخصصات</option>
                <option value="ضرائب">الضرائب العامة وضريبة الدخل</option>
                <option value="الفاتورة">الفاتورة الإلكترونية والإيصال</option>
                <option value="تأسيس">تأسيس الشركات (GAFI)</option>
                <option value="قيمة مضافة">ضريبة القيمة المضافة</option>
                <option value="قوائم">دفاتر وقوائم مالية (EAS)</option>
                <option value="تجارة إلكترونية">التجارة الإلكترونية والعمل الحر</option>
              </select>
            </div>

            {/* Sorting */}
            <div className="relative">
              <ArrowUpDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-[#F5F7FA] text-sm text-[#142B43] rounded-xl pr-10 pl-3 py-2.5 border border-slate-200 focus:outline-none focus:border-[#D6AE57] appearance-none cursor-pointer"
              >
                <option value="rating">الأعلى تقييماً</option>
                <option value="experience">الأكثر خبرة (سنوات)</option>
                <option value="priceAsc">الأقل سعراً للاستشارة</option>
                <option value="priceDesc">الأعلى سعراً للاستشارة</option>
              </select>
            </div>
          </div>

          {/* Sliders for Price & Rating */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <span>الحد الأقصى لسعر الاستشارة:</span>
              <input
                type="range"
                min="300"
                max="1000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[#D6AE57] cursor-pointer"
              />
              <span className="font-bold text-[#142B43]">{maxPrice} ج.م</span>
            </div>

            <div className="flex items-center gap-2">
              <span>التقييم الأدنى:</span>
              {[0, 4.5, 4.8].map((score) => (
                <button
                  key={score}
                  onClick={() => setMinRating(score)}
                  className={`px-2.5 py-1 rounded-md border text-xs cursor-pointer ${
                    minRating === score
                      ? 'bg-[#142B43] text-white border-[#142B43]'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {score === 0 ? 'الكل' : `${score}+ ★`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Accountants Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#142B43]">لم يتم العثور على محاسبين مطابقين للبحث</h3>
            <p className="text-slate-500 text-sm mt-1">يرجى تعديل معايير التصفية أو اختيار محافظة أخرى.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGov('all');
                setSelectedSpecialty('all');
                setMaxPrice(1000);
                setMinRating(0);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#142B43] text-white text-xs font-semibold cursor-pointer"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((accountant) => (
              <div
                key={accountant.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#D6AE57] shadow-sm hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Top: Avatar, Name, Verification Badge */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={accountant.avatar}
                        alt={accountant.fullName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
                      />
                      {accountant.verificationStatus === 'VERIFIED' && (
                        <div
                          className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center border-2 border-white shadow"
                          title="محاسب قانوني معتمد وموثق بسجل المحاسبين والمراجعين"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#142B43] truncate group-hover:text-[#B88E33] transition-colors">
                          {accountant.fullName}
                        </h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#142B43] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                          <span>{accountant.ratingAverage}</span>
                          <span className="text-slate-400 font-normal">({accountant.ratingCount})</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {accountant.headline}
                      </p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {accountant.city}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3 text-[#D6AE57]" />
                          {accountant.experienceYears} سنة خبرة
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Syndicate Registration Tag */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                    <span className="font-semibold text-slate-700 block text-[11px]">القيد والترخيص المهني:</span>
                    <span className="truncate block text-slate-600 font-mono text-[11px] mt-0.5">
                      {accountant.certifiedPublicAccountantNumber || accountant.syndicateRegistrationNumber}
                    </span>
                  </div>

                  {/* Bio snippet */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {accountant.bio}
                  </p>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {accountant.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {accountant.skills.length > 3 && (
                      <span className="text-[11px] px-1.5 py-0.5 text-slate-500">
                        +{accountant.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Hourly rate and CTAs */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] text-slate-500">سعر الاستشارة</div>
                    <div className="text-lg font-extrabold text-[#142B43] font-['Cairo']">
                      {accountant.hourlyRate}{' '}
                      <span className="text-xs font-semibold text-slate-500">ج.م</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectAccountant(accountant)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs transition-all cursor-pointer"
                    >
                      الملف المهني
                    </button>
                    <button
                      onClick={() => onBookWithAccountant(accountant)}
                      className="px-3.5 py-2 rounded-xl bg-[#142B43] hover:bg-[#D6AE57] text-white hover:text-[#0B1725] font-bold text-xs transition-all shadow flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>حجز موعد</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
