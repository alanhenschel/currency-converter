import { ConversionFormData, LoadingState } from '../../../shared/types/common';

describe('Common Types', () => {
  describe('ConversionFormData', () => {
    it('should define ConversionFormData interface', () => {
      const formData: ConversionFormData = {
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        amount: '100'
      };

      expect(formData.fromCurrency).toBe('USD');
      expect(formData.toCurrency).toBe('BRL');
      expect(formData.amount).toBe('100');
    });

    it('should allow all string values', () => {
      const formData: ConversionFormData = {
        fromCurrency: 'EUR',
        toCurrency: 'JPY',
        amount: '500.50'
      };

      expect(typeof formData.fromCurrency).toBe('string');
      expect(typeof formData.toCurrency).toBe('string');
      expect(typeof formData.amount).toBe('string');
    });
  });

  describe('LoadingState', () => {
    it('should define LoadingState with isLoading false and no error', () => {
      const state: LoadingState = {
        isLoading: false,
        error: null
      };

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });

    it('should define LoadingState with isLoading true', () => {
      const state: LoadingState = {
        isLoading: true,
        error: null
      };

      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should define LoadingState with error', () => {
      const errorMessage = 'Something went wrong';
      const state: LoadingState = {
        isLoading: false,
        error: errorMessage
      };

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('should allow string or null for error', () => {
      const stateWithError: LoadingState = {
        isLoading: false,
        error: 'Error occurred'
      };

      const stateWithoutError: LoadingState = {
        isLoading: true,
        error: null
      };

      expect(typeof stateWithError.error).toBe('string');
      expect(stateWithoutError.error).toBe(null);
    });
  });
});
