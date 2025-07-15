import { GetTransactionHistoryUseCase } from '../../application/usecases/GetTransactionHistoryUseCase';
import { ConversionService } from '../../domain/services/ConversionService';
import { Transaction } from '../../domain/entities/Transaction';

// Mock ConversionService
const mockConversionService: jest.Mocked<ConversionService> = {
  convertCurrency: jest.fn(),
  getTransactionHistory: jest.fn(),
} as any;

describe('GetTransactionHistoryUseCase', () => {
  let useCase: GetTransactionHistoryUseCase;

  beforeEach(() => {
    useCase = new GetTransactionHistoryUseCase(mockConversionService);
    jest.clearAllMocks();
  });

  it('should execute and return transaction history successfully', async () => {
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

    mockConversionService.getTransactionHistory.mockResolvedValue(expectedTransactions);

    const result = await useCase.execute();

    expect(mockConversionService.getTransactionHistory).toHaveBeenCalledWith();
    expect(result).toEqual(expectedTransactions);
  });

  it('should return empty array when no transactions found', async () => {
    mockConversionService.getTransactionHistory.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(mockConversionService.getTransactionHistory).toHaveBeenCalledWith();
    expect(result).toEqual([]);
  });

  it('should propagate errors from service', async () => {
    const error = new Error('Service error');
    mockConversionService.getTransactionHistory.mockRejectedValue(error);

    await expect(useCase.execute()).rejects.toThrow('Service error');
    expect(mockConversionService.getTransactionHistory).toHaveBeenCalledWith();
  });
});
