import React, { useState } from 'react';
import { SUPPORTED_CURRENCIES } from '../../domain/entities/Currency';
import { ConversionFormData, ValidationErrors } from '../../shared/types/common';
import { validateConversionForm, hasValidationErrors } from '../../shared/utils/validation';
import { parseFormNumber } from '../../shared/utils/format';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface ConversionFormProps {
  onSubmit: (data: { fromCurrency: string; toCurrency: string; amount: number }) => void;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

export const ConversionForm: React.FC<ConversionFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError
}) => {
  const [formData, setFormData] = useState<ConversionFormData>({
    fromCurrency: '',
    toCurrency: '',
    amount: ''
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleInputChange = (field: keyof ConversionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateConversionForm(formData);
    setValidationErrors(errors);

    if (!hasValidationErrors(errors)) {
      onSubmit({
        fromCurrency: formData.fromCurrency,
        toCurrency: formData.toCurrency,
        amount: parseFormNumber(formData.amount)
      });
    }
  };

  const swapCurrencies = () => {
    setFormData(prev => ({
      ...prev,
      fromCurrency: prev.toCurrency,
      toCurrency: prev.fromCurrency
    }));
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Currency Converter</h2>
      
      {error && (
        <ErrorMessage 
          message={error} 
          onClose={onClearError}
          className="mb-4"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="from-currency" className="block text-sm font-medium text-gray-700 mb-1">
              From Currency
            </label>
            <select
              id="from-currency"
              value={formData.fromCurrency}
              onChange={(e) => handleInputChange('fromCurrency', e.target.value)}
              className={`select-field ${validationErrors.fromCurrency ? 'border-error-500' : ''}`}
            >
              <option value="">Select currency</option>
              {SUPPORTED_CURRENCIES.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
            {validationErrors.fromCurrency && (
              <p className="text-error-500 text-sm mt-1">{validationErrors.fromCurrency}</p>
            )}
          </div>

          <div>
            <label htmlFor="to-currency" className="block text-sm font-medium text-gray-700 mb-1">
              To Currency
            </label>
            <div className="relative">
              <select
                id="to-currency"
                value={formData.toCurrency}
                onChange={(e) => handleInputChange('toCurrency', e.target.value)}
                className={`select-field ${validationErrors.toCurrency ? 'border-error-500' : ''}`}
              >
                <option value="">Select currency</option>
                {SUPPORTED_CURRENCIES.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={swapCurrencies}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                disabled={!formData.fromCurrency || !formData.toCurrency}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            {validationErrors.toCurrency && (
              <p className="text-error-500 text-sm mt-1">{validationErrors.toCurrency}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleInputChange('amount', e.target.value)}
            className={`input-field ${validationErrors.amount ? 'border-error-500' : ''}`}
            placeholder="Enter amount to convert"
          />
          {validationErrors.amount && (
            <p className="text-error-500 text-sm mt-1">{validationErrors.amount}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center"
        >
          {isLoading && <LoadingSpinner size="small" className="mr-2 text-white" />}
          {isLoading ? 'Converting...' : 'Convert Currency'}
        </button>
      </form>
    </div>
  );
};
