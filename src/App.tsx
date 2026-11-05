/**
 * MEEZAN | مِيزان - Accounting & Tax Consulting Marketplace in Egypt
 */

import React, { useState, useEffect } from 'react';
import {
  Navbar,
} from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesGrid } from './components/ServicesGrid';
import { AccountantsDirectory } from './components/AccountantsDirectory';
import { AccountantProfileModal } from './components/AccountantProfileModal';
import { BookingModal } from './components/BookingModal';
import { ConsultationRoom } from './components/ConsultationRoom';
import { TaxCalculatorModal } from './components/TaxCalculatorModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AccountantDashboard } from './components/AccountantDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AIAssistantModal } from './components/AIAssistantModal';
import { Footer } from './components/Footer';

import { Accountant, Booking, Category, Service, UserRole } from './types';
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  Headphones,
  FileCheck,
  ArrowLeft,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // App state
  const [currentRole, setCurrentRole] = useState<UserRole>('CUSTOMER');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');

  const [accountants, setAccountants] = useState<Accountant[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Modals & Active Views
  const [selectedAccountant, setSelectedAccountant] = useState<Accountant | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [bookingPrefillAccountant, setBookingPrefillAccountant] = useState<Accountant | null>(null);
  const [bookingPrefillService, setBookingPrefillService] = useState<Service | null>(null);

  const [activeConsultationBooking, setActiveConsultationBooking] = useState<Booking | null>(null);
  const [isTaxCalculatorOpen, setIsTaxCalculatorOpen] = useState<boolean>(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState<boolean>(false);

  // Search filter passed from Hero
  const [heroFilter, setHeroFilter] = useState<{
    search?: string;
    governorate?: string;
    specialty?: string;
  }>({});

  // FAQ open item
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Initial Data Fetching from /api
  const fetchData = async () => {
    try {
      const [accRes, catRes, srvRes, bkgRes] = await Promise.all([
        fetch('/api/accountants'),
        fetch('/api/categories'),
        fetch('/api/services'),
        fetch('/api/bookings'),
      ]);

      const accJson = await accRes.json();
      const catJson = await catRes.json();
      const srvJson = await srvRes.json();
      const bkgJson = await bkgRes.json();

      if (accJson.success) setAccountants(accJson.data);
      if (catJson.success) setCategories(catJson.data);
      if (srvJson.success) setServices(srvJson.data);
      if (bkgJson.success) setBookings(bkgJson.data);
    } catch (e) {
      console.error('Failed to load initial data from API:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentRole]);

  const handleRoleChange = async (role: UserRole) => {
    setCurrentRole(role);
    try {
      await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      fetchData();
      if (role === 'CUSTOMER') setActiveTab('customer-dashboard');
      else if (role === 'ACCOUNTANT') setActiveTab('accountant-dashboard');
      else if (role === 'ADMIN' || role === 'SUPER_ADMIN') setActiveTab('admin-dashboard');
    } catch (e) {
      console.error(e);
    }
  };

  const handleHeroSearch = (params: { search: string; governorate: string; specialty: string }) => {
    setHeroFilter(params);
    setActiveTab('accountants');
  };

  const handleBookWithAccountant = (accountant: Accountant) => {
    setBookingPrefillAccountant(accountant);
    setBookingPrefillService(null);
    setIsBookingOpen(true);
  };

  const handleBookWithService = (service: Service) => {
    setBookingPrefillService(service);
    setBookingPrefillAccountant(null);
    setIsBookingOpen(true);
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setActiveConsultationBooking(newBooking);
  };

  const handleConsultationFinished = (bookingId: string) => {
    setActiveConsultationBooking(null);
    fetchData();
    setActiveTab('customer-dashboard');
  };

  const faqItems = [
    {
      q: 'كيف تضمن منصة مِيزان اعتماد ومؤهلات المحاسبين؟',
      a: 'تطبق مِيزان إجراءات تدقيق مهني صارمة بالتعاون مع نقابة التجاريين وسجل المحاسبين والمراجعين بوزارة المالية. لا يتم تفعيل حساب المحاسب إلا بعد فحص بطاقة الرقم القومي، بطاقة عضوية النقابة، ورقم القيد الرسمي.',
    },
    {
      q: 'كيف يتم توزيع وسداد الأتعاب والعمولات؟',
      a: 'تعتمد المنصة أعلى معايير الشفافية المالية بنسبة عمولة افتراضية 15% للمنصة و85% صافي مستحق للمحاسب. يتم إيداع المبلغ في المحفظة، ويتم صرفه للمحاسب فور إتمام الجلسة عبر إنستاباي أو الحساب البنكي.',
    },
    {
      q: 'ما هي طرق الدفع المتاحة داخل مصر؟',
      a: 'ندعم كافة وسائل الدفع المحلية المعتمدة: بطاقات ميزة الوطنية، فوري (Fawry Pay)، إنستاباي (InstaPay)، المحافظ الإلكترونية مثل فودافون كاش وأورنج كاش ووي باي، وبطاقات فيزا وماستركارد.',
    },
    {
      q: 'هل يمكنني إلغاء الاستشارة واسترداد أموالي؟',
      a: 'نعم، طبقاً لسياسة الإلغاء الشفافة: في حال الإلغاء قبل الموعد المحدد بأكثر من 24 ساعة، يتم استرداد 100% من المبلغ تلقائياً دون أي خصومات.',
    },
    {
      q: 'هل مستنداتي الضريبية والفواتير آمنة ومشفرة؟',
      a: 'نعم، كافة المستندات تُخزن في بيئة مشفرة ولا يمكن لأي طرف الاطلاع عليها سوى المحاسب القانوني المعتمد المرتبط بالحجز وخلال فترة تقديم الاستشارة فقط.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172B3A] flex flex-col font-['Cairo']">
      {/* Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenBooking={() => {
          setBookingPrefillAccountant(null);
          setBookingPrefillService(null);
          setIsBookingOpen(true);
        }}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenTaxCalculator={() => setIsTaxCalculatorOpen(true)}
        language={language}
        onLanguageToggle={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
      />

      {/* Main Page View Switcher */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* Hero Section with 3D Gold Scale */}
            <HeroSection
              onSearch={handleHeroSearch}
              onOpenBooking={() => {
                setBookingPrefillAccountant(null);
                setBookingPrefillService(null);
                setIsBookingOpen(true);
              }}
              onOpenTaxCalculator={() => setIsTaxCalculatorOpen(true)}
            />

            {/* Most Requested Accounting Services */}
            <ServicesGrid
              categories={categories}
              services={services}
              onSelectService={handleBookWithService}
            />

            {/* How It Works Section */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-[#B88E33] bg-[#D6AE57]/15 px-3 py-1 rounded-full uppercase">
                    بسيطة وسريعة
                  </span>
                  <h2 className="text-3xl font-extrabold text-[#142B43] mt-2 font-['Cairo']">
                    كيف تعمل منصة مِيزان في 4 خطوات؟
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    من البحث وحتى حل ملفك الضريبي وإعداد دفاترك باحترافية
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                  {[
                    {
                      step: '01',
                      title: 'ابحث عن المحاسب المناسب',
                      desc: 'تصفح المحاسبين المعتمدين حسب المحافظة والتخصص وسنوات الخبرة والتقييمات.',
                      icon: <ShieldCheck className="w-6 h-6 text-[#D6AE57]" />,
                    },
                    {
                      step: '02',
                      title: 'حدد الموعد والخدمة',
                      desc: 'اختر اليوم والوقت الملائم لجلسة الفيديو المباشرة وارفع المستندات المطلوبة بأمان.',
                      icon: <Calendar className="w-6 h-6 text-[#D6AE57]" />,
                    },
                    {
                      step: '03',
                      title: 'سداد آمن وشفاف',
                      desc: 'ادفع بأي وسيلة دفع مصرية مع إيضاح كامل لعمولة المنصة 15% دون أي مصاريف خفية.',
                      icon: <Lock className="w-6 h-6 text-[#D6AE57]" />,
                    },
                    {
                      step: '04',
                      title: 'ابدأ الاستشارة والحل',
                      desc: 'ادخل غرفة الاستشارة التفاعلية، شارك شاشتك، واحصل على توصيات ضريبية ودفترية معتمدة.',
                      icon: <Headphones className="w-6 h-6 text-[#D6AE57]" />,
                    },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl bg-[#F5F7FA] border border-slate-200 hover:border-[#D6AE57] transition-all relative group"
                    >
                      <div className="text-3xl font-black text-[#142B43]/15 font-mono mb-2 group-hover:text-[#D6AE57]/30 transition-colors">
                        {s.step}
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-white text-[#142B43] flex items-center justify-center mb-4 shadow-xs border border-slate-200">
                        {s.icon}
                      </div>
                      <h3 className="text-base font-bold text-[#142B43] mb-2">{s.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Accountants Preview */}
            <AccountantsDirectory
              accountants={accountants}
              onSelectAccountant={(acc) => setSelectedAccountant(acc)}
              onBookWithAccountant={handleBookWithAccountant}
              initialFilter={heroFilter}
            />

            {/* FAQ Accordion Section */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <span className="text-xs font-bold text-[#B88E33] bg-[#D6AE57]/15 px-3 py-1 rounded-full uppercase">
                    إجابات مباشرة
                  </span>
                  <h2 className="text-3xl font-extrabold text-[#142B43] mt-2 font-['Cairo']">
                    الأسئلة الشائعة حول منصة مِيزان
                  </h2>
                </div>

                <div className="space-y-3">
                  {faqItems.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 bg-[#F5F7FA]/70 hover:bg-[#F5F7FA] transition-colors cursor-pointer"
                        >
                          <span className="text-sm font-bold text-[#142B43]">{item.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-500 transition-transform ${
                              isOpen ? 'rotate-180 text-[#D6AE57]' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="p-4 sm:p-5 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-16 bg-gradient-to-r from-[#142B43] via-[#0F2236] to-[#0B1725] text-white text-center relative overflow-hidden">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                <h2 className="text-3xl sm:text-4xl font-black font-['Cairo']">
                  ابدأ الآن في تنظيم أمورك الضريبية والمحاسبية بثقة وأمان
                </h2>
                <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                  احجز جلستك الأولى مع مستشار قانوني معتمد، وتجنب غرامات التأخير وأخطاء الفواتير
                  الإلكترونية.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                  <button
                    onClick={() => {
                      setBookingPrefillAccountant(null);
                      setBookingPrefillService(null);
                      setIsBookingOpen(true);
                    }}
                    className="px-8 py-3.5 rounded-2xl bg-[#D6AE57] hover:bg-[#E2C378] text-[#0B1725] font-bold text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>احجز استشارة فورية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsAiAdvisorOpen(true)}
                    className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-slate-700 text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#D6AE57]" />
                    <span>تحدث مع المستشار الذكي</span>
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Directory Tab */}
        {activeTab === 'accountants' && (
          <AccountantsDirectory
            accountants={accountants}
            onSelectAccountant={(acc) => setSelectedAccountant(acc)}
            onBookWithAccountant={handleBookWithAccountant}
            initialFilter={heroFilter}
          />
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <ServicesGrid
            categories={categories}
            services={services}
            onSelectService={handleBookWithService}
          />
        )}

        {/* Customer Dashboard Tab */}
        {activeTab === 'customer-dashboard' && (
          <CustomerDashboard
            bookings={bookings}
            onOpenConsultationRoom={(b) => setActiveConsultationBooking(b)}
            onBookNew={() => {
              setBookingPrefillAccountant(null);
              setBookingPrefillService(null);
              setIsBookingOpen(true);
            }}
          />
        )}

        {/* Accountant Dashboard Tab */}
        {activeTab === 'accountant-dashboard' && (
          <AccountantDashboard
            bookings={bookings}
            onOpenConsultationRoom={(b) => setActiveConsultationBooking(b)}
          />
        )}

        {/* Admin Dashboard Tab */}
        {activeTab === 'admin-dashboard' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer
        onNavClick={setActiveTab}
        onOpenTaxCalculator={() => setIsTaxCalculatorOpen(true)}
      />

      {/* Floating AI Consultant Widget Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsAiAdvisorOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#142B43] hover:bg-[#0B1725] text-[#D6AE57] border border-[#D6AE57]/40 shadow-2xl hover:scale-105 transition-all cursor-pointer group"
          title="مُستشار مِيزان الذكي"
        >
          <div className="w-8 h-8 rounded-full bg-[#D6AE57] text-[#0B1725] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold hidden sm:inline text-white">مُستشار مِيزان الذكي</span>
        </button>
      </div>

      {/* Modals & Overlays */}
      <AccountantProfileModal
        accountant={selectedAccountant}
        onClose={() => setSelectedAccountant(null)}
        onBook={handleBookWithAccountant}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        accountants={accountants}
        services={services}
        preselectedAccountant={bookingPrefillAccountant}
        preselectedService={bookingPrefillService}
        onBookingSuccess={handleBookingSuccess}
      />

      {activeConsultationBooking && (
        <ConsultationRoom
          booking={activeConsultationBooking}
          onLeaveRoom={() => setActiveConsultationBooking(null)}
          onConsultationFinished={handleConsultationFinished}
        />
      )}

      <TaxCalculatorModal
        isOpen={isTaxCalculatorOpen}
        onClose={() => setIsTaxCalculatorOpen(false)}
        onBookConsultation={() => {
          setIsTaxCalculatorOpen(false);
          setIsBookingOpen(true);
        }}
      />

      <AIAssistantModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        onBookConsultation={() => {
          setIsAiAdvisorOpen(false);
          setIsBookingOpen(true);
        }}
      />
    </div>
  );
}
