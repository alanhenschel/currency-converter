import React from 'react';
import { Transaction } from '../../domain/entities/Transaction';
import { formatCurrency } from '../../domain/entities/Currency';
import { formatDate } from '../../shared/utils/format';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onClearError: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  isLoading,
  error,
  onRefresh,
  onClearError
}) => {
  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="btn-secondary flex items-center"
        >
          {isLoading && <LoadingSpinner size="small" className="mr-2" />}
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <ErrorMessage 
          message={error} 
          onClose={onClearError}
          className="mb-4"
        />
      )}

      {isLoading && transactions.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="large" />
          <span className="ml-3 text-gray-600">Loading transactions...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <p>No transactions found</p>
          <p className="text-sm">Make your first currency conversion to see transactions here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.transactionId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-100 rounded-full p-2">
                    <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h10.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {formatCurrency(transaction.fromValue, transaction.fromCurrency)} → {formatCurrency(transaction.toValue, transaction.toCurrency)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Rate: 1 {transaction.fromCurrency} = {transaction.rate.toFixed(4)} {transaction.toCurrency}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">#{transaction.transactionId}</div>
                  <div className="text-sm text-gray-500">{formatDate(transaction.timestamp)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
