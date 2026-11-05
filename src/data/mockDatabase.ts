/**
 * In-Memory Database Store for MEEZAN Marketplace
 * Supports live operations, filtering, state transitions, and audit records
 */

import {
  Accountant,
  Booking,
  Category,
  Message,
  PlatformMetrics,
  Service,
  User,
  WalletTransaction,
} from '../types';
import { ACCOUNTANTS, CATEGORIES, INITIAL_BOOKINGS, SERVICES } from './seedData';
import { calculateCommission, isValidTransition } from '../utils/finance';

class DatabaseStore {
  private accountants: Accountant[] = [...ACCOUNTANTS];
  private categories: Category[] = [...CATEGORIES];
  private services: Service[] = [...SERVICES];
  private bookings: Booking[] = [...INITIAL_BOOKINGS];
  private messages: Record<string, Message[]> = {
    'bk-mzn-001': [
      {
        id: 'msg-1',
        bookingId: 'bk-mzn-001',
        senderId: 'usr-acc-1',
        senderName: 'د. شريف الألفي',
        senderRole: 'ACCOUNTANT',
        content: 'أهلاً بك م. أحمد، يرجى تجهيز مسودة الفواتير وكشف المصروفات لنراجعها معاً خلال الجلسة.',
        createdAt: '2026-11-04 10:30',
      },
      {
        id: 'msg-2',
        bookingId: 'bk-mzn-001',
        senderId: 'usr-cust-1',
        senderName: 'م. أحمد الشناوي',
        senderRole: 'CUSTOMER',
        content: 'أهلاً دكتور شريف، قمت برفع ملف كشف المصروفات وملخص الإيرادات في مرفقات الحجز.',
        createdAt: '2026-11-04 10:35',
      },
    ],
    'bk-mzn-002': [
      {
        id: 'msg-3',
        bookingId: 'bk-mzn-002',
        senderId: 'usr-acc-2',
        senderName: 'أ. مروة الشربيني',
        senderRole: 'ACCOUNTANT',
        content: 'مرحباً سارة، اطلعت على استفسارك الخاص بالتجارة الإلكترونية، وسنبدأ الجلسة فوراً لمناقشة آلية المحاسبة الضريبية.',
        createdAt: '2026-11-04 11:20',
      },
    ],
  };

  private platformCommissionRate: number = 0.15; // 15% default

  private currentUser: User = {
    id: 'usr-cust-1',
    fullName: 'م. أحمد الشناوي',
    email: 'ahmed.shennawy@example.com',
    phone: '+201012345678',
    role: 'CUSTOMER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2026-01-10',
  };

  private walletTransactions: WalletTransaction[] = [
    {
      id: 'tx-1',
      type: 'EARNING',
      amount: 382.5,
      currency: 'EGP',
      description: 'أتعاب استشارة ضريبة الدخل (حجز #MZN-2026-7841)',
      createdAt: '2026-11-04 10:20',
      bookingNumber: 'MZN-2026-7841',
    },
    {
      id: 'tx-2',
      type: 'PLATFORM_FEE',
      amount: 67.5,
      currency: 'EGP',
      description: 'عمولة منصة مِيزان (15%) للاستشارة #MZN-2026-7841',
      createdAt: '2026-11-04 10:20',
      bookingNumber: 'MZN-2026-7841',
    },
    {
      id: 'tx-3',
      type: 'EARNING',
      amount: 510.0,
      currency: 'EGP',
      description: 'أتعاب استشارة تأسيس شركة GAFI (حجز #MZN-2026-7843)',
      createdAt: '2026-10-31 10:00',
      bookingNumber: 'MZN-2026-7843',
    },
  ];

  // User Management
  getCurrentUser(): User {
    return this.currentUser;
  }

  setCurrentUserRole(role: User['role']) {
    if (role === 'ACCOUNTANT') {
      this.currentUser = {
        id: 'usr-acc-1',
        fullName: 'د. شريف الألفي',
        email: 'dr.sherif.alfy@meezan.eg',
        phone: '+201200112233',
        role: 'ACCOUNTANT',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        createdAt: '2024-01-15',
      };
    } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      this.currentUser = {
        id: 'usr-admin-1',
        fullName: 'إدارة منصة مِيزان (المشرف العام)',
        email: 'admin@meezan.eg',
        phone: '+201009988776',
        role: 'SUPER_ADMIN',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        createdAt: '2024-01-01',
      };
    } else {
      this.currentUser = {
        id: 'usr-cust-1',
        fullName: 'م. أحمد الشناوي',
        email: 'ahmed.shennawy@example.com',
        phone: '+201012345678',
        role: 'CUSTOMER',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        createdAt: '2026-01-10',
      };
    }
    return this.currentUser;
  }

  // Accountants
  getAccountants(filters?: {
    search?: string;
    governorate?: string;
    specialty?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    sortBy?: 'rating' | 'experience' | 'priceAsc' | 'priceDesc';
  }): Accountant[] {
    let list = [...this.accountants];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(
          (a) =>
            a.fullName.toLowerCase().includes(q) ||
            a.headline.toLowerCase().includes(q) ||
            a.city.toLowerCase().includes(q) ||
            a.skills.some((s) => s.toLowerCase().includes(q))
        );
      }
      if (filters.governorate && filters.governorate !== 'all') {
        list = list.filter((a) => a.governorate === filters.governorate);
      }
      if (filters.specialty && filters.specialty !== 'all') {
        const spec = filters.specialty.toLowerCase();
        list = list.filter(
          (a) =>
            a.skills.some((s) => s.toLowerCase().includes(spec)) ||
            a.headline.toLowerCase().includes(spec)
        );
      }
      if (filters.minPrice !== undefined) {
        list = list.filter((a) => a.hourlyRate >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        list = list.filter((a) => a.hourlyRate <= filters.maxPrice!);
      }
      if (filters.minRating !== undefined) {
        list = list.filter((a) => a.ratingAverage >= filters.minRating!);
      }

      if (filters.sortBy === 'rating') {
        list.sort((a, b) => b.ratingAverage - a.ratingAverage);
      } else if (filters.sortBy === 'experience') {
        list.sort((a, b) => b.experienceYears - a.experienceYears);
      } else if (filters.sortBy === 'priceAsc') {
        list.sort((a, b) => a.hourlyRate - b.hourlyRate);
      } else if (filters.sortBy === 'priceDesc') {
        list.sort((a, b) => b.hourlyRate - a.hourlyRate);
      }
    }

    return list;
  }

  getAccountantById(id: string): Accountant | undefined {
    return this.accountants.find((a) => a.id === id);
  }

  // Categories & Services
  getCategories(): Category[] {
    return this.categories;
  }

  getServices(): Service[] {
    return this.services;
  }

  getServiceById(id: string): Service | undefined {
    return this.services.find((s) => s.id === id);
  }

  // Bookings
  getBookings(role?: 'CUSTOMER' | 'ACCOUNTANT', userId?: string): Booking[] {
    if (role === 'ACCOUNTANT') {
      return this.bookings.filter((b) => b.accountantId === 'acc-1' || b.accountantId === userId);
    }
    if (role === 'CUSTOMER') {
      return this.bookings.filter((b) => b.customerId === 'usr-cust-1' || b.customerId === userId);
    }
    return this.bookings;
  }

  getBookingById(id: string): Booking | undefined {
    return this.bookings.find((b) => b.id === id);
  }

  createBooking(params: {
    accountantId: string;
    serviceId: string;
    scheduledDate: string;
    startTime: string;
    customerNotes?: string;
    attachedDocs?: { name: string; size: string; url: string }[];
  }): Booking {
    const accountant = this.getAccountantById(params.accountantId);
    if (!accountant) throw new Error('Accountant not found');
    const service = this.getServiceById(params.serviceId);
    if (!service) throw new Error('Service not found');

    const totalAmount = service.basePrice;
    const split = calculateCommission(totalAmount, this.platformCommissionRate);

    // Calculate end time roughly +45-60 min
    const [hours, minutes] = params.startTime.split(':').map(Number);
    const endMinutes = (minutes + service.durationMinutes) % 60;
    const endHours = hours + Math.floor((minutes + service.durationMinutes) / 60);
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;

    const newBooking: Booking = {
      id: `bk-mzn-${Date.now().toString().slice(-4)}`,
      bookingNumber: `MZN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: this.currentUser.id,
      customerName: this.currentUser.fullName,
      customerPhone: this.currentUser.phone,
      accountantId: accountant.id,
      accountantName: accountant.fullName,
      accountantAvatar: accountant.avatar,
      accountantHeadline: accountant.headline,
      serviceId: service.id,
      serviceNameAr: service.nameAr,
      serviceNameEn: service.nameEn,
      scheduledDate: params.scheduledDate,
      startTime: params.startTime,
      endTime,
      durationMinutes: service.durationMinutes,
      status: 'PENDING_PAYMENT',
      deliveryType: service.deliveryType,
      customerNotes: params.customerNotes,
      totalAmount,
      platformFeeRate: this.platformCommissionRate,
      platformFee: split.platformFee,
      accountantAmount: split.accountantNet,
      currency: 'EGP',
      paymentStatus: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      attachedDocs: params.attachedDocs || [],
    };

    this.bookings.unshift(newBooking);
    return newBooking;
  }

  processSandboxPayment(
    bookingId: string,
    paymentMethod: Booking['paymentMethod'] = 'SANDBOX_TEST'
  ): Booking {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.status = 'CONFIRMED';
    booking.paymentMethod = paymentMethod;
    booking.paymentStatus = 'PAID';
    booking.meetingRoomId = `room-${booking.bookingNumber.toLowerCase()}`;

    // Add wallet entry
    this.walletTransactions.unshift({
      id: `tx-${Date.now()}`,
      type: 'EARNING',
      amount: booking.accountantAmount,
      currency: 'EGP',
      description: `أتعاب استشارة (${booking.serviceNameAr}) - حجز #${booking.bookingNumber}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      bookingNumber: booking.bookingNumber,
    });

    return booking;
  }

  updateBookingStatus(bookingId: string, newStatus: Booking['status']): Booking {
    const booking = this.getBookingById(bookingId);
    if (!booking) throw new Error('Booking not found');

    booking.status = newStatus;
    if (newStatus === 'COMPLETED') {
      const accountant = this.getAccountantById(booking.accountantId);
      if (accountant) {
        accountant.totalConsultations += 1;
      }
    }
    return booking;
  }

  // Reviews
  addReview(params: {
    bookingId: string;
    accountantId: string;
    rating: number;
    comment: string;
  }): void {
    const accountant = this.getAccountantById(params.accountantId);
    if (!accountant) throw new Error('Accountant not found');

    const newRev = {
      id: `rev-${Date.now()}`,
      bookingId: params.bookingId,
      customerName: this.currentUser.fullName,
      customerAvatar: this.currentUser.avatar,
      rating: params.rating,
      comment: params.comment,
      createdAt: 'الآن',
    };

    accountant.reviews.unshift(newRev);
    accountant.ratingCount += 1;
    const totalScore = accountant.reviews.reduce((acc, r) => acc + r.rating, 0);
    accountant.ratingAverage = Math.round((totalScore / accountant.reviews.length) * 100) / 100;
  }

  // Consultation Messages
  getConsultationMessages(bookingId: string): Message[] {
    return this.messages[bookingId] || [];
  }

  sendMessage(params: {
    bookingId: string;
    content: string;
    attachmentUrl?: string;
    attachmentName?: string;
  }): Message {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      bookingId: params.bookingId,
      senderId: this.currentUser.id,
      senderName: this.currentUser.fullName,
      senderRole: this.currentUser.role,
      content: params.content,
      attachmentUrl: params.attachmentUrl,
      attachmentName: params.attachmentName,
      createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    if (!this.messages[params.bookingId]) {
      this.messages[params.bookingId] = [];
    }
    this.messages[params.bookingId].push(newMsg);
    return newMsg;
  }

  // Wallets & Transactions
  getWalletTransactions(): WalletTransaction[] {
    return this.walletTransactions;
  }

  getWalletBalance(): {
    totalEarnings: number;
    platformCommissionPaid: number;
    availableBalance: number;
    pendingBalance: number;
    currency: string;
  } {
    let totalEarnings = 0;
    let platformCommissionPaid = 0;

    for (const tx of this.walletTransactions) {
      if (tx.type === 'EARNING') totalEarnings += tx.amount;
      if (tx.type === 'PLATFORM_FEE') platformCommissionPaid += tx.amount;
    }

    const availableBalance = Math.round(totalEarnings * 100) / 100;

    return {
      totalEarnings,
      platformCommissionPaid,
      availableBalance,
      pendingBalance: 425.0, // active in-progress booking
      currency: 'EGP',
    };
  }

  requestWithdrawal(amount: number, method: string, details: string): WalletTransaction {
    const tx: WalletTransaction = {
      id: `tx-wd-${Date.now()}`,
      type: 'WITHDRAWAL',
      amount,
      currency: 'EGP',
      description: `طلب سحب أرباح عبر (${method} - ${details})`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    this.walletTransactions.unshift(tx);
    return tx;
  }

  // Admin Controls
  getPlatformMetrics(): PlatformMetrics {
    const verifiedAccountants = this.accountants.filter((a) => a.verificationStatus === 'VERIFIED').length;
    const pendingVerifications = this.accountants.filter((a) => a.verificationStatus === 'PENDING_REVIEW').length;
    const totalRevenue = this.bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.totalAmount : 0), 0);
    const platformCommission = Math.round(totalRevenue * this.platformCommissionRate * 100) / 100;
    const accountantPayouts = Math.round((totalRevenue - platformCommission) * 100) / 100;

    return {
      totalCustomers: 512,
      totalAccountants: this.accountants.length,
      verifiedAccountants,
      pendingVerifications,
      totalBookings: this.bookings.length,
      totalRevenueEGP: totalRevenue,
      platformCommissionEGP: platformCommission,
      accountantPayoutsEGP: accountantPayouts,
      activeDisputes: 0,
      platformCommissionRate: this.platformCommissionRate,
    };
  }

  setPlatformCommissionRate(rate: number): number {
    if (rate >= 0 && rate <= 1) {
      this.platformCommissionRate = rate;
    }
    return this.platformCommissionRate;
  }

  getPendingVerifications(): Accountant[] {
    return this.accountants.filter((a) => a.verificationStatus === 'PENDING_REVIEW');
  }

  decideVerification(accountantId: string, decision: 'VERIFIED' | 'REJECTED'): Accountant {
    const acc = this.getAccountantById(accountantId);
    if (!acc) throw new Error('Accountant not found');

    acc.verificationStatus = decision;
    acc.documents.forEach((d) => {
      d.status = decision;
    });
    return acc;
  }
}

export const db = new DatabaseStore();
