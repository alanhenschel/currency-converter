import { ConversionService } from '../../domain/services/ConversionService';
import { ConversionRequest, ConversionResponse } from '../../domain/entities/Transaction';

export class ConvertCurrencyUseCase {
  constructor(private readonly conversionService: ConversionService) {}

  async execute(request: ConversionRequest): Promise<ConversionResponse> {
    return await this.conversionService.convertCurrency(request);
  }
}
