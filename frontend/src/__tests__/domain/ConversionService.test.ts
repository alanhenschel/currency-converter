import { ConversionService } from '../../domain/services/ConversionService';
import { ConversionRepository } from '../../domain/repositories/ConversionRepository';
import { ConversionRequest, ConversionResponse, Transaction } from '../../domain/entities/Transaction';
import { ValidationError } from '../../domain/entities/Error';

// Mock repository
const mockRepository: jest.Mocked<ConversionRepository> = {
  convertCurrency: jest.fn(),
  getTransactionsByUserId: jest.fn(),
};

describe('ConversionService', () => {
  let service: ConversionService;

  beforeEach(() => {
    service = new ConversionService(mockRepository);
    jest.clearAllMocks();
  });

  describe('convertCurrency', () => {
    const validRequest: ConversionRequest = {
      fromCurrency: 'USD',
      toCurrency: 'BRL',
      amount: 100
    };

    const mockResponse: ConversionResponse = {
      transactionId: 123,
      userId: 123,
      fromCurrency: 'USD',
      toCurrency: 'BRL',
      fromValue: 100,
      toValue: 520.50,
      rate: 5.205,
      timestamp: '2024-01-15T10:30:00Z',
    };

    it('should convert currency successfully with valid request', async () => {
      mockRepository.convertCurrency.mockResolvedValue(mockResponse);

      const result = await service.convertCurrency(validRequest);

      expect(mockRepository.convertCurrency).toHaveBeenCalledWith(validRequest);
      expect(result).toEqual(mockResponse);
    });

    it('should throw ValidationError when fromCurrency is missing', async () => {
      const invalidRequest = { ...validRequest, fromCurrency: '' };

      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow(ValidationError);
      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow('From and to currencies are required');
      expect(mockRepository.convertCurrency).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when toCurrency is missing', async () => {
      const invalidRequest = { ...validRequest, toCurrency: '' };

      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow(ValidationError);
      expect(mockRepository.convertCurrency).not.toHaveBeenCalled();
    });

    it('should throw ValidationError when fromCurrency equals toCurrency', async () => {
      const invalidRequest = { ...validRequest, toCurrency: 'USD' };

      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow(ValidationError);
      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow('From and to currencies cannot be the same');
      expect(mockRepository.convertCurrency).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for unsupported fromCurrency', async () => {
      const invalidRequest = { ...validRequest, fromCurrency: 'XYZ' };

      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow(ValidationError);
      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow('Unsupported currency: XYZ');
      expect(mockRepository.convertCurrency).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for unsupported toCurrency', async () => {
      const invalidRequest = { ...validRequest, toCurrency: 'XYZ' };

      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow(ValidationError);
      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow('Unsupported currency: XYZ');
      expect(mockRepository.convertCurrency).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for zero amount', async () => {
      const invalidRequest = { ...validRequest, amount: 0 };

      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow(ValidationError);
      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow('Amount must be a positive number');
      expect(mockRepository.convertCurrency).not.toHaveBeenCalled();
    });

    it('should throw ValidationError for negative amount', async () => {
      const invalidRequest = { ...validRequest, amount: -100 };

      await expect(service.convertCurrency(invalidRequest)).rejects.toThrow(ValidationError);
      expect(mockRepository.convertCurrency).not.toHaveBeenCalled();
    });
  });

  describe('getTransactionHistory', () => {
    const mockTransactions: Transaction[] = [
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
    ];

    it('should get transaction history successfully', async () => {
      mockRepository.getTransactionsByUserId.mockResolvedValue(mockTransactions);

      const result = await service.getTransactionHistory();

      expect(mockRepository.getTransactionsByUserId).toHaveBeenCalledWith();
      expect(result).toEqual(mockTransactions);
    });

    it('should return empty array when no transactions found', async () => {
      mockRepository.getTransactionsByUserId.mockResolvedValue([]);

      const result = await service.getTransactionHistory();

      expect(result).toEqual([]);
      expect(mockRepository.getTransactionsByUserId).toHaveBeenCalledWith();
    });
  });
});
