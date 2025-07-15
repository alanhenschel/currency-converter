import { ConversionRepository } from '../repositories/ConversionRepository';
import { ConversionRequest, ConversionResponse, Transaction } from '../entities/Transaction';
import { ValidationError } from '../entities/Error';
import { SUPPORTED_CURRENCIES } from '../entities/Currency';

export class ConversionService {
  constructor(private readonly conversionRepository: ConversionRepository) {}

  async convertCurrency(request: ConversionRequest): Promise<ConversionResponse> {
    this.validateConversionRequest(request);
    return await this.conversionRepository.convertCurrency(request);
  }

  async getTransactionHistory(): Promise<Transaction[]> {
    return await this.conversionRepository.getTransactionsByUserId();
  }

  private validateConversionRequest(request: ConversionRequest): void {
    const { fromCurrency, toCurrency, amount } = request;

    if (!fromCurrency || !toCurrency) {
      throw new ValidationError('From and to currencies are required');
    }

    if (fromCurrency === toCurrency) {
      throw new ValidationError('From and to currencies cannot be the same');
    }

    const supportedCodes = SUPPORTED_CURRENCIES.map(c => c.code);
    if (!supportedCodes.includes(fromCurrency)) {
      throw new ValidationError(`Unsupported currency: ${fromCurrency}`);
    }

    if (!supportedCodes.includes(toCurrency)) {
      throw new ValidationError(`Unsupported currency: ${toCurrency}`);
    }

    if (!amount || amount <= 0) {
      throw new ValidationError('Amount must be a positive number');
    }
  }
}
