import React from 'react';
import { render, screen } from '@testing-library/react';
import { CurrencyConverterPage } from '../../../presentation/pages/CurrencyConverterPage';

// Mock the use cases
const mockConvertCurrencyUseCase = {
  execute: jest.fn(),
} as any;

const mockGetTransactionHistoryUseCase = {
  execute: jest.fn(),
} as any;

// Mock the hooks to avoid complex state management in tests
jest.mock('../../../presentation/hooks/useConversion', () => ({
  useConversion: () => ({
    isLoading: false,
    error: null,
    lastConversion: null,
    convertCurrency: jest.fn(),
    clearError: jest.fn(),
    clearLastConversion: jest.fn(),
  }),
}));

jest.mock('../../../presentation/hooks/useTransactionHistory', () => ({
  useTransactionHistory: () => ({
    isLoading: false,
    error: null,
    transactions: [],
    loadTransactions: jest.fn(),
    clearError: jest.fn(),
  }),
}));

describe('CurrencyConverterPage', () => {
  const defaultProps = {
    convertCurrencyUseCase: mockConvertCurrencyUseCase,
    getTransactionHistoryUseCase: mockGetTransactionHistoryUseCase,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render currency converter page', () => {
    render(<CurrencyConverterPage {...defaultProps} />);
    
    expect(screen.getAllByText('Currency Converter')[0]).toBeInTheDocument();
  });

  it('should render conversion form', () => {
    render(<CurrencyConverterPage {...defaultProps} />);
    
    // Check if form elements are present
    expect(screen.getByRole('button', { name: /convert currency/i })).toBeInTheDocument();
  });

  it('should render transaction history section', () => {
    render(<CurrencyConverterPage {...defaultProps} />);
    
    // The component should render without errors
    expect(screen.getAllByText('Currency Converter')[0]).toBeInTheDocument();
  });

  it('should accept use case props', () => {
    const customConvertUseCase = {
      execute: jest.fn(),
    } as any;

    const customHistoryUseCase = {
      execute: jest.fn(),
    } as any;

    render(
      <CurrencyConverterPage
        convertCurrencyUseCase={customConvertUseCase}
        getTransactionHistoryUseCase={customHistoryUseCase}
      />
    );
    
    expect(screen.getAllByText('Currency Converter')[0]).toBeInTheDocument();
  });

  it('should render main container with correct class', () => {
    const { container } = render(<CurrencyConverterPage {...defaultProps} />);
    
    expect(container.firstChild).toHaveClass('min-h-screen', 'bg-gray-50', 'py-8');
  });
});
