/**
 * Booking State Machine Engine for MEEZAN
 * Enforces valid state transitions and permissions
 */

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

const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  DRAFT: ['PENDING_PAYMENT', 'CANCELLED'],
  PENDING_PAYMENT: ['PAID', 'CANCELLED'],
  PAID: ['CONFIRMED', 'REFUND_PENDING', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED', 'REFUND_PENDING', 'NO_SHOW'],
  IN_PROGRESS: ['COMPLETED', 'DISPUTED'],
  COMPLETED: ['DISPUTED'],
  CANCELLED: ['REFUND_PENDING'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [],
  DISPUTED: ['COMPLETED', 'REFUND_PENDING', 'REFUNDED'],
  NO_SHOW: ['REFUND_PENDING'],
};

/**
 * Validates whether transitioning from currentStatus to nextStatus is permissible.
 */
export function isValidTransition(currentStatus: BookingStatus, nextStatus: BookingStatus): boolean {
  if (currentStatus === nextStatus) return true;
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  return allowed ? allowed.includes(nextStatus) : false;
}

/**
 * Checks if a booking can be cancelled by the user.
 */
export function canCancelBooking(status: BookingStatus): boolean {
  return ['DRAFT', 'PENDING_PAYMENT', 'PAID', 'CONFIRMED'].includes(status);
}

/**
 * Checks if the consultation room can be accessed.
 */
export function canJoinConsultationRoom(status: BookingStatus): boolean {
  return ['CONFIRMED', 'IN_PROGRESS', 'COMPLETED'].includes(status);
}

/**
 * Checks if a customer can review the accountant.
 */
export function canReviewAccountant(status: BookingStatus): boolean {
  return status === 'COMPLETED';
}
