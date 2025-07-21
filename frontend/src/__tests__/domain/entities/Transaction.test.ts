import { Transaction, ConversionRequest, ConversionResponse } from '../../../domain/entities/Transaction';

describe('Transaction entities', () => {
  describe('Transaction interface', () => {
    it('should define Transaction interface correctly', () => {
      const transaction: Transaction = {
        transactionId: 1,
        userId: 123,
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        fromValue: 100,
        toValue: 500,
        rate: 5.0,
        timestamp: '2024-01-01T10:00:00Z'
      };

      expect(transaction.transactionId).toBe(1);
      expect(transaction.userId).toBe(123);
      expect(transaction.fromCurrency).toBe('USD');
      expect(transaction.toCurrency).toBe('BRL');
      expect(transaction.fromValue).toBe(100);
      expect(transaction.toValue).toBe(500);
      expect(transaction.rate).toBe(5.0);
      expect(transaction.timestamp).toBe('2024-01-01T10:00:00Z');
    });

    it('should allow different currency codes', () => {
      const transaction: Transaction = {
        transactionId: 2,
        userId: 123,
        fromCurrency: 'EUR',
        toCurrency: 'JPY',
        fromValue: 200,
        toValue: 24000,
        rate: 120.0,
        timestamp: '2024-01-02T10:00:00Z'
      };

      expect(transaction.fromCurrency).toBe('EUR');
      expect(transaction.toCurrency).toBe('JPY');
    });
  });

  describe('ConversionRequest interface', () => {
    it('should define ConversionRequest interface correctly', () => {
      const request: ConversionRequest = {
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        amount: 100
      };

      expect(request.fromCurrency).toBe('USD');
      expect(request.toCurrency).toBe('BRL');
      expect(request.amount).toBe(100);
    });

    it('should allow decimal amounts', () => {
      const request: ConversionRequest = {
        fromCurrency: 'EUR',
        toCurrency: 'USD',
        amount: 250.75
      };

      expect(request.amount).toBe(250.75);
    });
  });

  describe('ConversionResponse interface', () => {
    it('should define ConversionResponse interface correctly', () => {
      const response: ConversionResponse = {
        transactionId: 3,
        userId: 123,
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        fromValue: 100,
        toValue: 500,
        rate: 5.0,
        timestamp: '2024-01-03T10:00:00Z'
      };

      expect(response.transactionId).toBe(3);
      expect(response.userId).toBe(123);
      expect(response.fromCurrency).toBe('USD');
      expect(response.toCurrency).toBe('BRL');
      expect(response.fromValue).toBe(100);
      expect(response.toValue).toBe(500);
      expect(response.rate).toBe(5.0);
      expect(response.timestamp).toBe('2024-01-03T10:00:00Z');
    });

    it('should be compatible with Transaction interface', () => {
      const response: ConversionResponse = {
        transactionId: 4,
        userId: 123,
        fromCurrency: 'EUR',
        toCurrency: 'JPY',
        fromValue: 100,
        toValue: 12000,
        rate: 120.0,
        timestamp: '2024-01-04T10:00:00Z'
      };

      // Should be assignable to Transaction
      const transaction: Transaction = response;
      expect(transaction.transactionId).toBe(response.transactionId);
    });
  });
});
