import { ConversionFormData, ValidationErrors } from '../types/common';

export const validateConversionForm = (data: ConversionFormData): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.fromCurrency.trim()) {
    errors.fromCurrency = 'From currency is required';
  }

  if (!data.toCurrency.trim()) {
    errors.toCurrency = 'To currency is required';
  }

  if (data.fromCurrency && data.toCurrency && data.fromCurrency === data.toCurrency) {
    errors.toCurrency = 'From and to currencies cannot be the same';
  }

  if (!data.amount.trim()) {
    errors.amount = 'Amount is required';
  } else {
    const amount = parseFloat(data.amount);
    if (isNaN(amount) || amount <= 0) {
      errors.amount = 'Amount must be a positive number';
    }
  }

  return errors;
};

export const hasValidationErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
