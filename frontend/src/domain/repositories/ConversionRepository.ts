import { ConversionRequest, ConversionResponse, Transaction } from '../entities/Transaction';

export interface ConversionRepository {
  convertCurrency(request: ConversionRequest): Promise<ConversionResponse>;
  getTransactionsByUserId(): Promise<Transaction[]>;
}
