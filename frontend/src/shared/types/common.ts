export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ConversionFormData {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
}

export interface ValidationErrors {
  fromCurrency?: string;
  toCurrency?: string;
  amount?: string;
}
