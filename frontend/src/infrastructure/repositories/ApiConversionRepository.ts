import { ConversionRepository } from '../../domain/repositories/ConversionRepository';
import { ConversionRequest, ConversionResponse, Transaction } from '../../domain/entities/Transaction';
import { ApiClient } from '../api/ApiClient';

export class ApiConversionRepository implements ConversionRepository {
  constructor(private readonly apiClient: ApiClient) {}

  async convertCurrency(request: ConversionRequest): Promise<ConversionResponse> {
    // Map frontend camelCase to backend snake_case
    const backendRequest = {
      from_currency: request.fromCurrency,
      to_currency: request.toCurrency,
      amount: request.amount
    };
    
    const response = await this.apiClient.post<any>('/api/v1/conversion', backendRequest);
    // Map backend snake_case to frontend camelCase
    return {
      transactionId: response.transaction_id || response.transactionId,
      userId: response.user_id || response.userId,
      fromCurrency: response.from_currency || response.fromCurrency,
      toCurrency: response.to_currency || response.toCurrency,
      fromValue: response.from_value || response.fromValue,
      toValue: response.to_value || response.toValue,
      rate: response.rate,
      timestamp: response.timestamp
    };
  }

  async getTransactionsByUserId(): Promise<Transaction[]> {
    const response = await this.apiClient.get<any[]>('/api/v1/transactions/', { userId: 123 });
    // Map backend snake_case to frontend camelCase
    return response.map(item => ({
      transactionId: item.transaction_id,
      userId: item.user_id,
      fromCurrency: item.from_currency,
      toCurrency: item.to_currency,
      fromValue: item.from_value,
      toValue: item.to_value,
      rate: item.rate,
      timestamp: item.timestamp
    }));
  }
}
