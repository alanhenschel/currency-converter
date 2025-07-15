import React from 'react';
import './App.css';
import { CurrencyConverterPage } from './presentation/pages/CurrencyConverterPage';
import { DIContainer } from './shared/container/DIContainer';

function App() {
  const container = DIContainer.getInstance();

  return (
    <div className="App">
      <CurrencyConverterPage
        convertCurrencyUseCase={container.getConvertCurrencyUseCase()}
        getTransactionHistoryUseCase={container.getGetTransactionHistoryUseCase()}
      />
    </div>
  );
}

export default App;
