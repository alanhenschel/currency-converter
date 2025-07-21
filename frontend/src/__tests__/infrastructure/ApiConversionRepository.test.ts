import { ApiConversionRepository } from '../../infrastructure/repositories/ApiConversionRepository';
import { ApiClient } from '../../infrastructure/api/ApiClient';
import { ConversionRequest, ConversionResponse, Transaction } from '../../domain/entities/Transaction';

// Mock ApiClient
const mockApiClient: jest.Mocked<ApiClient> = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
} as any;

describe('ApiConversionRepository', () => {
  let repository: ApiConversionRepository;

  beforeEach(() => {
    repository = new ApiConversionRepository(mockApiClient);
    jest.clearAllMocks();
  });

  describe('convertCurrency', () => {
    it('should convert currency successfully', async () => {
      const request: ConversionRequest = {
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        amount: 100
      };

      const mockBackendResponse = {
        transaction_id: 123,
        user_id: 123,
        from_currency: 'USD',
        to_currency: 'BRL',
        from_value: 100,
        to_value: 520.50,
        rate: 5.205,
        timestamp: '2024-01-15T10:30:00Z',
      };

      const expectedResponse: ConversionResponse = {
        transactionId: 123,
        userId: 123,
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        fromValue: 100,
        toValue: 520.50,
        rate: 5.205,
        timestamp: '2024-01-15T10:30:00Z',
      };

      mockApiClient.post.mockResolvedValue(mockBackendResponse);

      const result = await repository.convertCurrency(request);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/v1/conversion', {
        from_currency: 'USD',
        to_currency: 'BRL',
        amount: 100
      });
      expect(result).toEqual(expectedResponse);
    });

    it('should handle backend response with camelCase fields', async () => {
      const request: ConversionRequest = {
        fromCurrency: 'EUR',
        toCurrency: 'JPY',
        amount: 50
      };

      // Backend response already in camelCase (fallback)
      const mockBackendResponse = {
        transactionId: 456,
        userId: 123,
        fromCurrency: 'EUR',
        toCurrency: 'JPY',
        fromValue: 50,
        toValue: 7500,
        rate: 150,
        timestamp: '2024-01-15T11:30:00Z',
      };

      mockApiClient.post.mockResolvedValue(mockBackendResponse);

      const result = await repository.convertCurrency(request);

      expect(result).toEqual(mockBackendResponse);
    });
  });

  describe('getTransactionsByUserId', () => {
    it('should get transactions successfully', async () => {
      const mockBackendResponse = [
        {
          transaction_id: 1,
          user_id: 123,
          from_currency: 'USD',
          to_currency: 'BRL',
          from_value: 100,
          to_value: 520.50,
          rate: 5.205,
          timestamp: '2024-01-15T10:30:00Z',
        },
        {
          transaction_id: 2,
          user_id: 123,
          from_currency: 'EUR',
          to_currency: 'JPY',
          from_value: 50,
          to_value: 7500,
          rate: 150,
          timestamp: '2024-01-15T11:30:00Z',
        }
      ];

      const expectedTransactions: Transaction[] = [
        {
          transactionId: 1,
          userId: 123,
          fromCurrency: 'USD',
          toCurrency: 'BRL',
          fromValue: 100,
          toValue: 520.50,
          rate: 5.205,
          timestamp: '2024-01-15T10:30:00Z',
        },
        {
          transactionId: 2,
          userId: 123,
          fromCurrency: 'EUR',
          toCurrency: 'JPY',
          fromValue: 50,
          toValue: 7500,
          rate: 150,
          timestamp: '2024-01-15T11:30:00Z',
        }
      ];

      mockApiClient.get.mockResolvedValue(mockBackendResponse);

      const result = await repository.getTransactionsByUserId();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/v1/transactions/', { userId: 123 });
      expect(result).toEqual(expectedTransactions);
    });

    it('should return empty array when no transactions', async () => {
      mockApiClient.get.mockResolvedValue([]);

      const result = await repository.getTransactionsByUserId();

      expect(result).toEqual([]);
    });

    it('should propagate errors from API client', async () => {
      const error = new Error('API Error');
      mockApiClient.get.mockRejectedValue(error);

      await expect(repository.getTransactionsByUserId()).rejects.toThrow('API Error');
    });
  });
});
