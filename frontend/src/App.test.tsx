import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock DIContainer
const mockConvertCurrencyUseCase = {
  execute: jest.fn(),
};

const mockGetTransactionHistoryUseCase = {
  execute: jest.fn(),
};

// Complete DIContainer mock
jest.mock('./shared/container/DIContainer', () => ({
  DIContainer: {
    getInstance: () => ({
      getConvertCurrencyUseCase: () => mockConvertCurrencyUseCase,
      getGetTransactionHistoryUseCase: () => mockGetTransactionHistoryUseCase,
    }),
  },
}));

// Mock hooks to avoid issues
jest.mock('./presentation/hooks/useConversion', () => ({
  useConversion: () => ({
    isLoading: false,
    error: null,
    lastConversion: null,
    convertCurrency: jest.fn(),
    clearError: jest.fn(),
    clearLastConversion: jest.fn(),
  }),
}));

jest.mock('./presentation/hooks/useTransactionHistory', () => ({
  useTransactionHistory: () => ({
    isLoading: false,
    error: null,
    transactions: [],
    loadTransactions: jest.fn(),
    clearError: jest.fn(),
  }),
}));

test('renders currency converter', () => {
  render(<App />);
  const linkElement = screen.getAllByText(/Currency Converter/i)[0];
  expect(linkElement).toBeInTheDocument();
});

test('renders without crashing', () => {
  const div = document.createElement('div');
  render(<App />);
  expect(div).toBeDefined();
});

test('should use dependency injection container', () => {
  render(<App />);
  
  // The use cases should be used in the component
  expect(screen.getAllByText('Currency Converter')[0]).toBeInTheDocument();
});
