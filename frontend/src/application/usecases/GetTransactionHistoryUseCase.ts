import { ConversionService } from '../../domain/services/ConversionService';
import { Transaction } from '../../domain/entities/Transaction';

export class GetTransactionHistoryUseCase {
  constructor(private readonly conversionService: ConversionService) {}

  async execute(): Promise<Transaction[]> {
    return await this.conversionService.getTransactionHistory();
  }
}
