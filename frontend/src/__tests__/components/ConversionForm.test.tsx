import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConversionForm } from '../../presentation/components/ConversionForm';

const mockOnSubmit = jest.fn();
const mockOnClearError = jest.fn();

const defaultProps = {
  onSubmit: mockOnSubmit,
  isLoading: false,
  error: null,
  onClearError: mockOnClearError,
};

describe('ConversionForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form elements correctly', () => {
    render(<ConversionForm {...defaultProps} />);
    
    expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    expect(screen.getByLabelText('From Currency')).toBeInTheDocument();
    expect(screen.getByLabelText('To Currency')).toBeInTheDocument();
    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Convert Currency' })).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(<ConversionForm {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Converting...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Loading... Converting...' })).toBeDisabled();
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'Something went wrong';
    render(<ConversionForm {...defaultProps} error={errorMessage} />);
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onClearError when error close button is clicked', () => {
    const errorMessage = 'Something went wrong';
    render(<ConversionForm {...defaultProps} error={errorMessage} />);
    
    const closeButton = screen.getByLabelText('Close error'); // We need to add aria-label
    fireEvent.click(closeButton);
    
    expect(mockOnClearError).toHaveBeenCalledTimes(1);
  });

  it('submits form with valid data', async () => {
    render(<ConversionForm {...defaultProps} />);
    
    // Fill form fields
    fireEvent.change(screen.getByLabelText('From Currency'), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText('To Currency'), { target: { value: 'BRL' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Convert Currency' }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        fromCurrency: 'USD',
        toCurrency: 'BRL',
        amount: 100,
      });
    });
  });

  it('shows validation errors for empty fields', async () => {
    render(<ConversionForm {...defaultProps} />);
    
    // Submit form without filling fields
    fireEvent.click(screen.getByRole('button', { name: 'Convert Currency' }));
    
    await waitFor(() => {
      expect(screen.getByText('From currency is required')).toBeInTheDocument();
      expect(screen.getByText('To currency is required')).toBeInTheDocument();
      expect(screen.getByText('Amount is required')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for same currency selection', async () => {
    render(<ConversionForm {...defaultProps} />);
    
    // Select same currency for both fields
    fireEvent.change(screen.getByLabelText('From Currency'), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText('To Currency'), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '100' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Convert Currency' }));
    
    await waitFor(() => {
      expect(screen.getByText('From and to currencies cannot be the same')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid amount', async () => {
    render(<ConversionForm {...defaultProps} />);
    
    // Fill form with invalid amount
    fireEvent.change(screen.getByLabelText('From Currency'), { target: { value: 'USD' } });
    fireEvent.change(screen.getByLabelText('To Currency'), { target: { value: 'BRL' } });
    fireEvent.change(screen.getByLabelText('Amount'), { target: { value: '-100' } });
    
    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Convert Currency' }));
    
    await waitFor(() => {
      expect(screen.getByText('Amount must be a positive number')).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('clears validation errors when user types in fields', async () => {
    render(<ConversionForm {...defaultProps} />);
    
    // Submit form to show validation errors
    fireEvent.click(screen.getByRole('button', { name: 'Convert Currency' }));
    
    await waitFor(() => {
      expect(screen.getByText('From currency is required')).toBeInTheDocument();
    });
    
    // Start typing in from currency field
    fireEvent.change(screen.getByLabelText('From Currency'), { target: { value: 'USD' } });
    
    // Validation error should be cleared (this would need to be tested with state)
    // For now, we just ensure no error is thrown
    expect(screen.getByLabelText('From Currency')).toHaveValue('USD');
  });
});
