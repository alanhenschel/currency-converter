import { render, screen, fireEvent } from '@testing-library/react';
import { TransactionHistory } from '../../presentation/components/TransactionHistory';
import { Transaction } from '../../domain/entities/Transaction';

const mockOnRefresh = jest.fn();
const mockOnClearError = jest.fn();

const mockTransactions: Transaction[] = [
  {
    transactionId: 1,
    userId: 1,
    fromCurrency: 'USD',
    toCurrency: 'BRL',
    fromValue: 100,
    toValue: 520.50,
    rate: 5.205,
    timestamp: '2024-01-15T10:30:00Z',
  },
  {
    transactionId: 2,
    userId: 1,
    fromCurrency: 'EUR',
    toCurrency: 'JPY',
    fromValue: 50,
    toValue: 7500,
    rate: 150,
    timestamp: '2024-01-15T11:00:00Z',
  },
];

const defaultProps = {
  transactions: mockTransactions,
  isLoading: false,
  error: null,
  onRefresh: mockOnRefresh,
  onClearError: mockOnClearError,
};

describe('TransactionHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders transaction history correctly', () => {
    render(<TransactionHistory {...defaultProps} />);
    
    expect(screen.getByText('Transaction History')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
    
    // Check if transactions are displayed
    expect(screen.getByText('$100.00 → R$520.50')).toBeInTheDocument();
    expect(screen.getByText('€50.00 → ¥7,500.00')).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<TransactionHistory {...defaultProps} isLoading={true} transactions={[]} />);
    
    expect(screen.getByText('Loading transactions...')).toBeInTheDocument();
  });

  it('shows empty state when no transactions', () => {
    render(<TransactionHistory {...defaultProps} transactions={[]} />);
    
    expect(screen.getByText('No transactions found')).toBeInTheDocument();
    expect(screen.getByText('Make your first currency conversion to see transactions here')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Failed to load transactions';
    render(<TransactionHistory {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onClearError when error close button is clicked', () => {
    const errorMessage = 'Failed to load transactions';
    render(<TransactionHistory {...defaultProps} error={errorMessage} />);
    
    const closeButton = screen.getByLabelText('Close error');
    fireEvent.click(closeButton);
    
    expect(mockOnClearError).toHaveBeenCalledTimes(1);
  });

  it('calls onRefresh when refresh button is clicked', () => {
    render(<TransactionHistory {...defaultProps} />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    fireEvent.click(refreshButton);
    
    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it('disables refresh button when loading', () => {
    render(<TransactionHistory {...defaultProps} isLoading={true} />);
    
    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toBeDisabled();
  });

  it('displays exchange rates correctly', () => {
    render(<TransactionHistory {...defaultProps} />);
    
    expect(screen.getByText('Rate: 1 USD = 5.2050 BRL')).toBeInTheDocument();
    expect(screen.getByText('Rate: 1 EUR = 150.0000 JPY')).toBeInTheDocument();
  });

  it('displays transaction IDs correctly', () => {
    render(<TransactionHistory {...defaultProps} />);
    
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
  });

  it('displays formatted timestamps', () => {
    render(<TransactionHistory {...defaultProps} />);
    
    // Check for date elements (format may vary by locale)
    expect(screen.getAllByText(/Jan.*15.*2024/)[0]).toBeInTheDocument();
  });
});
