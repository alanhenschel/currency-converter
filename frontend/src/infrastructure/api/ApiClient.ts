import axios from 'axios';
import { AppError, NetworkError, ServerError } from '../../domain/entities/Error';

export class ApiClient {
  private readonly client: any;

  constructor(baseURL: string = process.env.REACT_APP_API_URL || 'http://localhost:8000') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: any) => {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error: any) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: any) => {
        console.log(`[API] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error: any) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): AppError {
    console.error('[API] Response error:', error);

    if (!error.response) {
      // Network error
      return new NetworkError('Unable to connect to the server. Please check your connection.');
    }

    const { status, data } = error.response;
    const message = (data as any)?.detail || (data as any)?.message || 'An error occurred';

    if (status >= 400 && status < 500) {
      return new AppError(message, status);
    }

    return new ServerError(message, status);
  }

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }
}
