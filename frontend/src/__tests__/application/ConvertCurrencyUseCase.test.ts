import { ConvertCurrencyUseCase } from '../../application/usecases/ConvertCurrencyUseCase';
import { ConversionService } from '../../domain/services/ConversionService';
import { ConversionRequest, ConversionResponse } from '../../domain/entities/Transaction';

// Mock ConversionService
const mockConversionService: jest.Mocked<ConversionService> = {
  convertCurrency: jest.fn(),
  getTransactionHistory: jest.fn(),
} as any;

describe('ConvertCurrencyUseCase', () => {
  let useCase: ConvertCurrencyUseCase;

  beforeEach(() => {
    useCase = new ConvertCurrencyUseCase(mockConversionService);
    jest.clearAllMocks();
  });

  it('should execute conversion successfully', async () => {
    const request: ConversionRequest = {
      fromCurrency: 'USD',
      toCurrency: 'BRL',
      amount: 100
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

    mockConversionService.convertCurrency.mockResolvedValue(expectedResponse);

    const result = await useCase.execute(request);

    expect(mockConversionService.convertCurrency).toHaveBeenCalledWith(request);
    expect(result).toEqual(expectedResponse);
  });

  it('should propagate errors from service', async () => {
    const request: ConversionRequest = {
      fromCurrency: 'USD',
      toCurrency: 'BRL',
      amount: 100
    };

    const error = new Error('Service error');
    mockConversionService.convertCurrency.mockRejectedValue(error);

    await expect(useCase.execute(request)).rejects.toThrow('Service error');
    expect(mockConversionService.convertCurrency).toHaveBeenCalledWith(request);
  });
});
