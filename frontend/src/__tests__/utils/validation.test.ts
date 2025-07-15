import { 
  validateConversionForm, 
  hasValidationErrors 
} from '../../shared/utils/validation';
import { ConversionFormData } from '../../shared/types/common';

describe('validation utils', () => {
  describe('validateConversionForm', () => {
    const validData: ConversionFormData = {
      fromCurrency: 'USD',
      toCurrency: 'BRL',
      amount: '100'
    };

    it('should return no errors for valid data', () => {
      const errors = validateConversionForm(validData);
      expect(errors).toEqual({});
    });

    it('should return error for missing fromCurrency', () => {
      const invalidData = { ...validData, fromCurrency: '' };
      const errors = validateConversionForm(invalidData);
      expect(errors.fromCurrency).toBe('From currency is required');
    });

    it('should return error for missing toCurrency', () => {
      const invalidData = { ...validData, toCurrency: '' };
      const errors = validateConversionForm(invalidData);
      expect(errors.toCurrency).toBe('To currency is required');
    });

    it('should return error when fromCurrency equals toCurrency', () => {
      const invalidData = { ...validData, toCurrency: 'USD' };
      const errors = validateConversionForm(invalidData);
      expect(errors.toCurrency).toBe('From and to currencies cannot be the same');
    });

    it('should return error for missing amount', () => {
      const invalidData = { ...validData, amount: '' };
      const errors = validateConversionForm(invalidData);
      expect(errors.amount).toBe('Amount is required');
    });

    it('should return error for zero amount', () => {
      const invalidData = { ...validData, amount: '0' };
      const errors = validateConversionForm(invalidData);
      expect(errors.amount).toBe('Amount must be a positive number');
    });

    it('should return error for negative amount', () => {
      const invalidData = { ...validData, amount: '-100' };
      const errors = validateConversionForm(invalidData);
      expect(errors.amount).toBe('Amount must be a positive number');
    });

    it('should return error for invalid amount format', () => {
      const invalidData = { ...validData, amount: 'abc' };
      const errors = validateConversionForm(invalidData);
      expect(errors.amount).toBe('Amount must be a positive number');
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const invalidData: ConversionFormData = {
        fromCurrency: '',
        toCurrency: '',
        amount: ''
      };
      const errors = validateConversionForm(invalidData);
      
      expect(errors.fromCurrency).toBe('From currency is required');
      expect(errors.toCurrency).toBe('To currency is required');
      expect(errors.amount).toBe('Amount is required');
    });
  });

  describe('hasValidationErrors', () => {
    it('should return false for empty errors object', () => {
      expect(hasValidationErrors({})).toBe(false);
    });

    it('should return true when errors object has properties', () => {
      const errors = { amount: 'Amount is required' };
      expect(hasValidationErrors(errors)).toBe(true);
    });

    it('should return true for multiple errors', () => {
      const errors = {
        amount: 'Amount is required',
        fromCurrency: 'From currency is required',
      };
      expect(hasValidationErrors(errors)).toBe(true);
    });
  });
});
