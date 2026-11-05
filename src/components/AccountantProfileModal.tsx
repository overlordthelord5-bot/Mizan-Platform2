import React from 'react';
import {
  X,
  MapPin,
  Star,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileCheck2,
  Calendar,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { Accountant } from '../types';

interface AccountantProfileModalProps {
  accountant: Accountant | null;
  onClose: () => void;
  onBook: (accountant: Accountant) => void;
}

export const AccountantProfileModal: React.FC<AccountantProfileModalProps> = ({
  accountant,
  onClose,
  onBook,
}) => {
  if (!accountant) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-slate-100 text-slate-600 flex items-center justify-center shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Cover Banner */}
        <div className="h-44 sm:h-52 w-full relative bg-[#142B43] overflow-hidden">
          <img
            src={accountant.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'}
            alt="Cover"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142B43] via-[#142B43]/50 to-transparent" />
        </div>

        {/* Profile Content */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative -mt-16">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 pb-6 border-b border-slate-100 text-center sm:text-right">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
              <div className="relative">
                <img
                  src={accountant.avatar}
                  alt={accountant.fullName}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
                />
                {accountant.verificationStatus === 'VERIFIED' && (
                  <div className="absolute -bottom-1 -left-1 w-7 h-7 rounded-full bg-[#10B981] text-white flex items-center justify-center border-2 border-white shadow">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-black text-[#142B43] font-['Cairo']">
                    {accountant.fullName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    موثق رسمياً
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 max-w-lg">{accountant.headline}</p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {accountant.city}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#D6AE57]" />
                    {accountant.experienceYears} سنة خبرة
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                    {accountant.ratingAverage} ({accountant.ratingCount} تقييم)
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Book Button */}
            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
              <div className="text-left sm:text-right">
                <div className="text-xs text-slate-500">سعر الاستشارة</div>
                <div className="text-2xl font-black text-[#142B43] font-['Cairo']">
                  {accountant.hourlyRate} <span className="text-xs text-slate-500">ج.م</span>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBook(accountant);
                }}
                className="px-6 py-2.5 rounded-xl bg-[#D6AE57] hover:bg-[#E2C378] text-[#0B1725] font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>حجز موعد الآن</span>
              </button>
            </div>
          </div>

          {/* Verified Official Credentials Box */}
          <div className="my-6 p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80">
            <h4 className="text-xs font-bold text-[#8C6D23] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-[#D6AE57]" />
              <span>بيانات القيد والترخيص في السجلات الحكومية المصرية</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-amber-100">
                <span className="text-slate-500 block text-[11px]">نقابة التجاريين المصرية:</span>
                <span className="font-semibold text-slate-800">{accountant.syndicateRegistrationNumber}</span>
              </div>
              {accountant.certifiedPublicAccountantNumber && (
                <div className="bg-white p-3 rounded-xl border border-amber-100">
                  <span className="text-slate-500 block text-[11px]">سجل المحاسبين والمراجعين (وزارة المالية):</span>
                  <span className="font-semibold text-slate-800">{accountant.certifiedPublicAccountantNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-[#142B43] mb-2">نبذة عن المستشار</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{accountant.bio}</p>
          </div>

          {/* Skills */}
          <div className="mb-6">
            <h4 className="text-sm font-bold text-[#142B43] mb-2">مجالات الخبرة والتخصص</h4>
            <div className="flex flex-wrap gap-2">
              {accountant.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Available Slots Today / Tomorrow */}
          <div className="mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-bold text-[#142B43] mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D6AE57]" />
              <span>المواعيد المتاحة للاستشارة الفورية اليوم</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {accountant.availableSlots.map((slot, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#142B43] shadow-xs"
                >
                  {slot}
                </span>
              ))}
            </div>
          </div>

          {/* Customer Reviews */}
          <div>
            <h4 className="text-sm font-bold text-[#142B43] mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#D6AE57]" />
              <span>تقييمات وآراء العملاء ({accountant.reviews.length})</span>
            </h4>
            {accountant.reviews.length === 0 ? (
              <p className="text-xs text-slate-500">لا توجد تقييمات منشورة حتى الآن.</p>
            ) : (
              <div className="space-y-3">
                {accountant.reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {rev.customerAvatar && (
                          <img
                            src={rev.customerAvatar}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        )}
                        <span className="text-xs font-bold text-slate-800">{rev.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{rev.rating}.0</span>
                        <span className="text-[11px] text-slate-400 font-normal mr-2">{rev.createdAt}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
