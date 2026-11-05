import React from 'react';
import { Scale, Sparkles, UserCheck, ShieldCheck, User, Calculator, Globe } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenAiAdvisor: () => void;
  onOpenTaxCalculator: () => void;
  language: 'ar' | 'en';
  onLanguageToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenBooking,
  onOpenAiAdvisor,
  onOpenTaxCalculator,
  language,
  onLanguageToggle,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#142B43]/95 backdrop-blur-md border-b border-[#D6AE57]/20 text-white transition-all shadow-lg">
      {/* Top Announcement & Switcher Bar */}
      <div className="bg-[#0B1725] px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[#D6AE57]">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            المنصة الأولى المعتمدة للاستشارات الضريبية والمحاسبية في مصر
          </span>
          <span className="hidden md:inline text-slate-400">•</span>
          <span className="hidden md:inline text-slate-300">عمولة المنصة 15% | مستحق المحاسب 85%</span>
        </div>

        {/* Live Persona Role Switcher for instant testing */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden sm:inline">تبديل الحساب للتجربة:</span>
          <div className="inline-flex rounded-lg bg-[#142B43] p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => onRoleChange('CUSTOMER')}
              className={`px-2.5 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                currentRole === 'CUSTOMER'
                  ? 'bg-[#D6AE57] text-[#0B1725] font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              عميل
            </button>
            <button
              onClick={() => onRoleChange('ACCOUNTANT')}
              className={`px-2.5 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                currentRole === 'ACCOUNTANT'
                  ? 'bg-[#D6AE57] text-[#0B1725] font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              محاسب
            </button>
            <button
              onClick={() => onRoleChange('SUPER_ADMIN')}
              className={`px-2.5 py-0.5 rounded-md transition-all flex items-center gap-1 ${
                currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN'
                  ? 'bg-[#D6AE57] text-[#0B1725] font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              الإدارة
            </button>
          </div>

          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700 text-slate-300 hover:text-white hover:border-[#D6AE57] transition-all ml-2"
            title="تبديل اللغة / Toggle Language"
          >
            <Globe className="w-3 h-3 text-[#D6AE57]" />
            <span>{language === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onTabChange('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D6AE57] to-[#B88E33] p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#142B43] rounded-[10px] flex items-center justify-center">
              <Scale className="w-6 h-6 text-[#D6AE57] group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-white font-['Cairo']">مِيزان</span>
              <span className="text-xs font-bold text-[#D6AE57] tracking-widest uppercase border-r border-[#D6AE57]/40 pr-1.5">
                MEEZAN
              </span>
            </div>
            <p className="text-[11px] text-slate-300 tracking-normal">منصة الاستشارات المحاسبية والضريبية المعتمدة</p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => onTabChange('home')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'home'
                ? 'bg-white/10 text-[#D6AE57] font-semibold'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            الرئيسية
          </button>
          <button
            onClick={() => onTabChange('accountants')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'accountants'
                ? 'bg-white/10 text-[#D6AE57] font-semibold'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            دليل المحاسبين
          </button>
          <button
            onClick={() => onTabChange('services')}
            className={`px-3.5 py-2 rounded-lg transition-all ${
              activeTab === 'services'
                ? 'bg-white/10 text-[#D6AE57] font-semibold'
                : 'text-slate-200 hover:text-white hover:bg-white/5'
            }`}
          >
            الخدمات الضريبية
          </button>
          <button
            onClick={onOpenTaxCalculator}
            className="px-3.5 py-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5"
          >
            <Calculator className="w-4 h-4 text-[#D6AE57]" />
            <span>حاسبة الضرائب</span>
          </button>
          {currentRole === 'CUSTOMER' && (
            <button
              onClick={() => onTabChange('customer-dashboard')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'customer-dashboard'
                  ? 'bg-white/10 text-[#D6AE57] font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              حسابي وحجوزاتي
            </button>
          )}
          {currentRole === 'ACCOUNTANT' && (
            <button
              onClick={() => onTabChange('accountant-dashboard')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'accountant-dashboard'
                  ? 'bg-white/10 text-[#D6AE57] font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              لوحة المحاسب والمحفظة
            </button>
          )}
          {(currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') && (
            <button
              onClick={() => onTabChange('admin-dashboard')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                activeTab === 'admin-dashboard'
                  ? 'bg-white/10 text-[#D6AE57] font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              لوحة تحكم الإدارة
            </button>
          )}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* AI Advisor Button */}
          <button
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 text-[#D6AE57] border border-[#D6AE57]/40 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#D6AE57] animate-spin-slow" />
            <span className="hidden sm:inline">مُستشار مِيزان الذكي</span>
            <span className="sm:hidden">ذكاء اصطناعي</span>
          </button>

          {/* Book Consultation Primary CTA */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D6AE57] via-[#E2C378] to-[#B88E33] hover:from-[#E2C378] hover:to-[#A37B24] text-[#0B1725] font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            <span>احجز استشارة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
