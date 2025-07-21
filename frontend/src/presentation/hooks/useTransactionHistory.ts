import { useState, useCallback } from 'react';
import { GetTransactionHistoryUseCase } from '../../application/usecases/GetTransactionHistoryUseCase';
import { Transaction } from '../../domain/entities/Transaction';
import { LoadingState } from '../../shared/types/common';

export const useTransactionHistory = (getTransactionHistoryUseCase: GetTransactionHistoryUseCase) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const loadTransactions = useCallback(async (): Promise<void> => {
    setState({ isLoading: true, error: null });
    
    try {
      const result = await getTransactionHistoryUseCase.execute();
      setTransactions(result);
      setState({ isLoading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState({ isLoading: false, error: errorMessage });
      setTransactions([]);
    }
  }, [getTransactionHistoryUseCase]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearTransactions = useCallback(() => {
    setTransactions([]);
  }, []);

  return {
    ...state,
    transactions,
    loadTransactions,
    clearError,
    clearTransactions,
  };
};
