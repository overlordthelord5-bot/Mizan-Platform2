/**
 * TypeScript Type Definitions for MEEZAN Marketplace
 */

export type UserRole = 'CUSTOMER' | 'ACCOUNTANT' | 'ADMIN' | 'SUPPORT_AGENT' | 'SUPER_ADMIN';

export type VerificationStatus = 'UNVERIFIED' | 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export type DeliveryType = 'ONLINE_VIDEO' | 'ONLINE_AUDIO' | 'CHAT_SESSION' | 'IN_PERSON' | 'DOCUMENT_REVIEW';

export type BookingStatus =
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'DISPUTED'
  | 'NO_SHOW';

export type PaymentMethod =
  | 'MEEZA'
  | 'FAWRY'
  | 'VODAFONE_CASH'
  | 'INSTAPAY'
  | 'CARD_VISA_MASTERCARD'
  | 'SANDBOX_TEST';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface AccountantDocument {
  id: string;
  type: 'NATIONAL_ID' | 'SYNDICATE_CARD' | 'CPA_LICENSE' | 'TAX_CARD';
  title: string;
  fileName: string;
  fileSize: string;
  status: VerificationStatus;
  uploadedAt: string;
  rejectionReason?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Accountant {
  id: string;
  userId: string;
  fullName: string;
  headline: string;
  bio: string;
  avatar: string;
  coverImage?: string;
  experienceYears: number;
  syndicateRegistrationNumber: string; // رقم قيد نقابة التجاريين
  certifiedPublicAccountantNumber?: string; // سجل المحاسبين والمراجعين
  verificationStatus: VerificationStatus;
  ratingAverage: number;
  ratingCount: number;
  totalConsultations: number;
  city: string;
  governorate: string;
  languages: string[];
  hourlyRate: number; // in EGP
  availableForInstantBooking: boolean;
  skills: string[];
  documents: AccountantDocument[];
  reviews: Review[];
  availableSlots: string[]; // e.g. ["10:00", "11:30", "14:00", "16:00"]
}

export interface Category {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  serviceCount: number;
}

export interface Service {
  id: string;
  categoryId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  basePrice: number; // EGP
  durationMinutes: number;
  deliveryType: DeliveryType;
  requiredDocs: string[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  accountantId: string;
  accountantName: string;
  accountantAvatar: string;
  accountantHeadline: string;
  serviceId: string;
  serviceNameAr: string;
  serviceNameEn: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: BookingStatus;
  deliveryType: DeliveryType;
  customerNotes?: string;
  totalAmount: number;
  platformFeeRate: number; // e.g. 0.15
  platformFee: number;
  accountantAmount: number;
  currency: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
  meetingRoomId?: string;
  meetingNotes?: string;
  attachedDocs?: { name: string; size: string; url: string }[];
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  createdAt: string;
}

export interface PlatformMetrics {
  totalCustomers: number;
  totalAccountants: number;
  verifiedAccountants: number;
  pendingVerifications: number;
  totalBookings: number;
  totalRevenueEGP: number;
  platformCommissionEGP: number;
  accountantPayoutsEGP: number;
  activeDisputes: number;
  platformCommissionRate: number; // 0.15
}

export interface WalletTransaction {
  id: string;
  type: 'EARNING' | 'PLATFORM_FEE' | 'WITHDRAWAL' | 'REFUND';
  amount: number;
  currency: string;
  description: string;
  createdAt: string;
  bookingNumber?: string;
}

export interface EgyptianGovernorate {
  id: string;
  nameAr: string;
  nameEn: string;
}
