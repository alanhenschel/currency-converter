import { useState, useCallback } from 'react';
import { ConvertCurrencyUseCase } from '../../application/usecases/ConvertCurrencyUseCase';
import { ConversionRequest, ConversionResponse } from '../../domain/entities/Transaction';
import { LoadingState } from '../../shared/types/common';

export const useConversion = (convertCurrencyUseCase: ConvertCurrencyUseCase) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
  });
  
  const [lastConversion, setLastConversion] = useState<ConversionResponse | null>(null);

  const convertCurrency = useCallback(async (request: ConversionRequest): Promise<ConversionResponse | null> => {
    setState({ isLoading: true, error: null });
    
    try {
      const result = await convertCurrencyUseCase.execute(request);
      setLastConversion(result);
      setState({ isLoading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setState({ isLoading: false, error: errorMessage });
      return null;
    }
  }, [convertCurrencyUseCase]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearLastConversion = useCallback(() => {
    setLastConversion(null);
  }, []);

  return {
    ...state,
    lastConversion,
    convertCurrency,
    clearError,
    clearLastConversion,
  };
};
