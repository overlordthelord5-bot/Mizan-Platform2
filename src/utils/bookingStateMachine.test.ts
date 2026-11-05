import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isValidTransition,
  canCancelBooking,
  canJoinConsultationRoom,
  canReviewAccountant,
} from './bookingStateMachine';

test('isValidTransition validates valid state progression', () => {
  assert.equal(isValidTransition('DRAFT', 'PENDING_PAYMENT'), true);
  assert.equal(isValidTransition('PENDING_PAYMENT', 'PAID'), true);
  assert.equal(isValidTransition('PAID', 'CONFIRMED'), true);
  assert.equal(isValidTransition('CONFIRMED', 'IN_PROGRESS'), true);
  assert.equal(isValidTransition('IN_PROGRESS', 'COMPLETED'), true);
});

test('isValidTransition blocks invalid illegal state hops', () => {
  assert.equal(isValidTransition('DRAFT', 'COMPLETED'), false);
  assert.equal(isValidTransition('CANCELLED', 'IN_PROGRESS'), false);
  assert.equal(isValidTransition('REFUNDED', 'PAID'), false);
});

test('canCancelBooking allows cancellation only prior to or at confirmation', () => {
  assert.equal(canCancelBooking('PENDING_PAYMENT'), true);
  assert.equal(canCancelBooking('CONFIRMED'), true);
  assert.equal(canCancelBooking('IN_PROGRESS'), false);
  assert.equal(canCancelBooking('COMPLETED'), false);
});

test('canJoinConsultationRoom and canReviewAccountant enforce lifecycle constraints', () => {
  assert.equal(canJoinConsultationRoom('CONFIRMED'), true);
  assert.equal(canJoinConsultationRoom('IN_PROGRESS'), true);
  assert.equal(canJoinConsultationRoom('PENDING_PAYMENT'), false);

  assert.equal(canReviewAccountant('COMPLETED'), true);
  assert.equal(canReviewAccountant('CONFIRMED'), false);
});
