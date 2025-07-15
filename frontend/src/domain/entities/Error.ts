export interface ApiError {
  message: string;
  status: number;
  detail?: string;
}

export class AppError extends Error {
  public readonly status: number;
  public readonly detail?: string;

  constructor(message: string, status: number = 500, detail?: string) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.detail = detail;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, detail?: string) {
    super(message, 400, detail);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred', detail?: string) {
    super(message, 0, detail);
    this.name = 'NetworkError';
  }
}

export class ServerError extends AppError {
  constructor(message: string = 'Server error occurred', status: number = 500, detail?: string) {
    super(message, status, detail);
    this.name = 'ServerError';
  }
}
