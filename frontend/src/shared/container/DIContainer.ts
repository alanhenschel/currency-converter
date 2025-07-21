import { ApiClient } from '../../infrastructure/api/ApiClient';
import { ApiConversionRepository } from '../../infrastructure/repositories/ApiConversionRepository';
import { ConversionService } from '../../domain/services/ConversionService';
import { ConvertCurrencyUseCase } from '../../application/usecases/ConvertCurrencyUseCase';
import { GetTransactionHistoryUseCase } from '../../application/usecases/GetTransactionHistoryUseCase';

// Dependency Injection Container
export class DIContainer {
  private static instance: DIContainer;
  
  private readonly apiClient: ApiClient;
  private readonly conversionRepository: ApiConversionRepository;
  private readonly conversionService: ConversionService;
  private readonly convertCurrencyUseCase: ConvertCurrencyUseCase;
  private readonly getTransactionHistoryUseCase: GetTransactionHistoryUseCase;

  private constructor() {
    // Infrastructure layer
    this.apiClient = new ApiClient();
    this.conversionRepository = new ApiConversionRepository(this.apiClient);
    
    // Domain layer
    this.conversionService = new ConversionService(this.conversionRepository);
    
    // Application layer
    this.convertCurrencyUseCase = new ConvertCurrencyUseCase(this.conversionService);
    this.getTransactionHistoryUseCase = new GetTransactionHistoryUseCase(this.conversionService);
  }

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  getConvertCurrencyUseCase(): ConvertCurrencyUseCase {
    return this.convertCurrencyUseCase;
  }

  getGetTransactionHistoryUseCase(): GetTransactionHistoryUseCase {
    return this.getTransactionHistoryUseCase;
  }
}
