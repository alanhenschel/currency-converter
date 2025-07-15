import React from 'react';
import { ConversionResponse } from '../../domain/entities/Transaction';
import { formatCurrency } from '../../domain/entities/Currency';
import { formatDate } from '../../shared/utils/format';
import { SuccessMessage } from './SuccessMessage';

interface ConversionResultProps {
  result: ConversionResponse;
  onClose: () => void;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({ result, onClose }) => {
  return (
    <div className="card mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Conversion Result</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <SuccessMessage 
        message="Currency conversion completed successfully!"
        className="mb-4"
      />

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">From:</span>
          <span className="font-semibold text-gray-800">
            {formatCurrency(result.fromValue, result.fromCurrency)}
          </span>
        </div>

        <div className="flex justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h10.586l-2.293-2.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">To:</span>
          <span className="font-bold text-lg text-primary-600">
            {formatCurrency(result.toValue, result.toCurrency)}
          </span>
        </div>

        <hr className="border-gray-200" />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 block">Exchange Rate:</span>
            <span className="font-medium">1 {result.fromCurrency} = {result.rate.toFixed(4)} {result.toCurrency}</span>
          </div>
          <div>
            <span className="text-gray-600 block">Transaction ID:</span>
            <span className="font-medium">#{result.transactionId}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-600 block">Date & Time:</span>
            <span className="font-medium">{formatDate(result.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
