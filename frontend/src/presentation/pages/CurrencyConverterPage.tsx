import React, { useEffect } from 'react';
import { ConversionForm } from '../components/ConversionForm';
import { ConversionResult } from '../components/ConversionResult';
import { TransactionHistory } from '../components/TransactionHistory';
import { useConversion } from '../hooks/useConversion';
import { useTransactionHistory } from '../hooks/useTransactionHistory';

// Dependency injection props
interface CurrencyConverterPageProps {
  convertCurrencyUseCase: any;
  getTransactionHistoryUseCase: any;
}

export const CurrencyConverterPage: React.FC<CurrencyConverterPageProps> = ({
  convertCurrencyUseCase,
  getTransactionHistoryUseCase
}) => {
  const conversion = useConversion(convertCurrencyUseCase);
  const transactionHistory = useTransactionHistory(getTransactionHistoryUseCase);

  // Load transaction history when component mounts
  useEffect(() => {
    transactionHistory.loadTransactions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleConversion = async (data: { fromCurrency: string; toCurrency: string; amount: number }) => {
    const result = await conversion.convertCurrency(data);
    
    if (result) {
      // Refresh transaction history after successful conversion
      setTimeout(() => {
        transactionHistory.loadTransactions();
      }, 500); // Small delay to ensure backend has processed the transaction
    }
  };

  const handleRefreshHistory = () => {
    transactionHistory.loadTransactions();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Currency Converter</h1>
          <p className="text-gray-600">Convert currencies with real-time exchange rates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ConversionForm
              onSubmit={handleConversion}
              isLoading={conversion.isLoading}
              error={conversion.error}
              onClearError={conversion.clearError}
            />

            {conversion.lastConversion && (
              <ConversionResult
                result={conversion.lastConversion}
                onClose={conversion.clearLastConversion}
              />
            )}
          </div>

          <div>
            <TransactionHistory
              transactions={transactionHistory.transactions}
              isLoading={transactionHistory.isLoading}
              error={transactionHistory.error}
              onRefresh={handleRefreshHistory}
              onClearError={transactionHistory.clearError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
