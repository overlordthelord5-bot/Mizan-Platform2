import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCommission,
  calculateRefundAmount,
  calculateEgyptianIncomeTaxEstimate,
} from './finance';

test('calculateCommission splits standard 15% platform and 85% accountant share', () => {
  const result = calculateCommission(1000, 0.15);
  assert.equal(result.totalAmount, 1000);
  assert.equal(result.platformFee, 150);
  assert.equal(result.accountantNet, 850);
  assert.equal(result.currency, 'EGP');
});

test('calculateCommission supports dynamic platform rate configured by admin', () => {
  const customResult = calculateCommission(2500, 0.10); // 10% platform fee
  assert.equal(customResult.platformFee, 250);
  assert.equal(customResult.accountantNet, 2250);
});

test('calculateRefundAmount applies cancellation rules correctly', () => {
  // > 24 hours: 100% refund
  const fullRefund = calculateRefundAmount(1000, 30);
  assert.equal(fullRefund.refundAmount, 1000);
  assert.equal(fullRefund.penaltyAmount, 0);

  // Between 2 and 24 hours: 50% refund
  const partialRefund = calculateRefundAmount(1000, 12);
  assert.equal(partialRefund.refundAmount, 500);
  assert.equal(partialRefund.penaltyAmount, 500);

  // Under 2 hours: 0% refund
  const noRefund = calculateRefundAmount(1000, 1);
  assert.equal(noRefund.refundAmount, 0);
  assert.equal(noRefund.penaltyAmount, 1000);
});

test('calculateEgyptianIncomeTaxEstimate applies 2024 progressive tax slabs', () => {
  // 35,000 EGP (within exempt bracket of 40,000)
  const exemptCase = calculateEgyptianIncomeTaxEstimate(35000);
  assert.equal(exemptCase.totalTax, 0);

  // 50,000 EGP (40,000 exempt + 10,000 * 10% = 1,000 EGP)
  const bracket2Case = calculateEgyptianIncomeTaxEstimate(50000);
  assert.equal(bracket2Case.totalTax, 1000);
});
