export interface Transaction {
  transactionId: number;
  userId: number;
  fromCurrency: string;
  toCurrency: string;
  fromValue: number;
  toValue: number;
  rate: number;
  timestamp: string;
}

export interface ConversionRequest {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface ConversionResponse {
  transactionId: number;
  userId: number;
  fromCurrency: string;
  toCurrency: string;
  fromValue: number;
  toValue: number;
  rate: number;
  timestamp: string;
}
