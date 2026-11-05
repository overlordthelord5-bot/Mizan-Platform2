/**
 * Financial and Commission Calculation Engine for MEEZAN
 * Tailored for Egyptian Market (EGP) and Egyptian Tax Regulations
 */

export interface CommissionSplit {
  totalAmount: number;
  platformRate: number;
  platformFee: number;
  accountantNet: number;
  currency: string;
}

/**
 * Calculates platform fee and accountant net earnings based on dynamic platform commission rate.
 * Default platform commission is 15% (0.15) and accountant net is 85% (0.85).
 */
export function calculateCommission(
  totalAmount: number,
  platformRate: number = 0.15,
  currency: string = 'EGP'
): CommissionSplit {
  if (totalAmount < 0) {
    throw new Error('Total amount cannot be negative');
  }
  if (platformRate < 0 || platformRate > 1) {
    throw new Error('Platform rate must be between 0 and 1');
  }

  // Rounded to 2 decimal places for accurate banking math
  const platformFee = Math.round(totalAmount * platformRate * 100) / 100;
  const accountantNet = Math.round((totalAmount - platformFee) * 100) / 100;

  return {
    totalAmount,
    platformRate,
    platformFee,
    accountantNet,
    currency,
  };
}

/**
 * Calculates refund amount based on cancellation lead time.
 * - 24+ hours before: Full 100% refund
 * - 2 to 24 hours before: 50% partial refund
 * - Under 2 hours before: No refund (0%)
 */
export function calculateRefundAmount(
  totalAmount: number,
  hoursBeforeAppointment: number
): { refundAmount: number; refundPercentage: number; penaltyAmount: number } {
  if (totalAmount <= 0) {
    return { refundAmount: 0, refundPercentage: 0, penaltyAmount: 0 };
  }

  let refundPercentage = 0;
  if (hoursBeforeAppointment >= 24) {
    refundPercentage = 1.0;
  } else if (hoursBeforeAppointment >= 2) {
    refundPercentage = 0.5;
  } else {
    refundPercentage = 0.0;
  }

  const refundAmount = Math.round(totalAmount * refundPercentage * 100) / 100;
  const penaltyAmount = Math.round((totalAmount - refundAmount) * 100) / 100;

  return { refundAmount, refundPercentage: refundPercentage * 100, penaltyAmount };
}

/**
 * Egyptian Progressive Income Tax Estimator (Law 91/2005 & recent updates)
 * For sole proprietorships, freelancers, and commercial professions.
 */
export function calculateEgyptianIncomeTaxEstimate(annualNetIncome: number): {
  taxableIncome: number;
  totalTax: number;
  effectiveRate: number;
  slabs: { nameAr: string; bracketAmount: number; rate: number; tax: number }[];
} {
  if (annualNetIncome <= 0) {
    return { taxableIncome: 0, totalTax: 0, effectiveRate: 0, slabs: [] };
  }

  // Personal exemption limit (حد الإعفاء الشخصي الإجمالي 40,000 ج.م)
  const brackets = [
    { nameAr: 'الشريحة الأولى (معفاة حتى 40,000 ج.م)', limit: 40000, rate: 0.0 },
    { nameAr: 'الشريحة الثانية (أكثر من 40,000 إلى 55,000 ج.م)', limit: 15000, rate: 0.10 },
    { nameAr: 'الشريحة الثالثة (أكثر من 55,000 إلى 70,000 ج.م)', limit: 15000, rate: 0.15 },
    { nameAr: 'الشريحة الرابعة (أكثر من 70,000 إلى 200,000 ج.م)', limit: 130000, rate: 0.20 },
    { nameAr: 'الشريحة الخامسة (أكثر من 200,000 إلى 400,000 ج.م)', limit: 200000, rate: 0.225 },
    { nameAr: 'الشريحة السادسة (ما زاد عن 400,000 ج.م)', limit: Infinity, rate: 0.25 },
  ];

  let remaining = annualNetIncome;
  let totalTax = 0;
  const slabs = [];

  for (const b of brackets) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, b.limit);
    const bracketTax = taxableInBracket * b.rate;
    totalTax += bracketTax;
    slabs.push({
      nameAr: b.nameAr,
      bracketAmount: taxableInBracket,
      rate: b.rate,
      tax: bracketTax,
    });
    remaining -= taxableInBracket;
  }

  totalTax = Math.round(totalTax * 100) / 100;
  const effectiveRate = Math.round((totalTax / annualNetIncome) * 10000) / 100;

  return {
    taxableIncome: annualNetIncome,
    totalTax,
    effectiveRate,
    slabs,
  };
}
