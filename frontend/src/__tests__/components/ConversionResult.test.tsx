import { render, screen, fireEvent } from '@testing-library/react';
import { ConversionResult } from '../../presentation/components/ConversionResult';
import { ConversionResponse } from '../../domain/entities/Transaction';

const mockOnClose = jest.fn();

const mockResult: ConversionResponse = {
  transactionId: 123,
  userId: 1,
  fromCurrency: 'USD',
  toCurrency: 'BRL',
  fromValue: 100,
  toValue: 520.50,
  rate: 5.205,
  timestamp: '2024-01-15T10:30:00Z',
};

const defaultProps = {
  result: mockResult,
  onClose: mockOnClose,
};

describe('ConversionResult', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders conversion result correctly', () => {
    render(<ConversionResult {...defaultProps} />);
    
    expect(screen.getByText('Conversion Result')).toBeInTheDocument();
    expect(screen.getByText('Currency conversion completed successfully!')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('R$520.50')).toBeInTheDocument();
    expect(screen.getByText('#123')).toBeInTheDocument();
  });

  it('displays exchange rate correctly', () => {
    render(<ConversionResult {...defaultProps} />);
    
    expect(screen.getByText('1 USD = 5.2050 BRL')).toBeInTheDocument();
  });

  it('displays formatted timestamp', () => {
    render(<ConversionResult {...defaultProps} />);
    
    // The exact format might vary based on locale, so we check for date elements
    expect(screen.getByText(/Jan.*15.*2024/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ConversionResult {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders different currency symbols correctly', () => {
    const euroResult: ConversionResponse = {
      ...mockResult,
      fromCurrency: 'EUR',
      toCurrency: 'JPY',
      fromValue: 50,
      toValue: 7500,
      rate: 150,
    };

    render(<ConversionResult result={euroResult} onClose={mockOnClose} />);
    
    expect(screen.getByText('€50.00')).toBeInTheDocument();
    expect(screen.getByText('¥7,500.00')).toBeInTheDocument();
    expect(screen.getByText('1 EUR = 150.0000 JPY')).toBeInTheDocument();
  });
});
