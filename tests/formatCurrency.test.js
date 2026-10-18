import assert from 'node:assert/strict';
import test from 'node:test';
import { formatCurrency } from '../src/utils/formatCurrency.js';

test('formats USD prices with a dollar sign', () => {
  assert.equal(formatCurrency(45, 'USD'), '$45.00');
});

test('formats GBP prices with a pound sign instead of a dollar sign', () => {
  assert.equal(formatCurrency(45, 'GBP'), '£45.00');
});

test('formats a zero-priced event as a valid currency amount', () => {
  assert.equal(formatCurrency(0, 'USD'), '$0.00');
});
