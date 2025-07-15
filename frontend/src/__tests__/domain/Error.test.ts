import { AppError, NetworkError, ServerError, ValidationError } from '../../domain/entities/Error';

describe('Error entities', () => {
  describe('AppError', () => {
    it('should create AppError with message and status', () => {
      const error = new AppError('Test error', 400);
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(400);
      expect(error.name).toBe('AppError');
      expect(error).toBeInstanceOf(Error);
    });

    it('should create AppError with default status', () => {
      const error = new AppError('Test error');
      
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(500); // AppError has default status 500
    });
  });

  describe('ValidationError', () => {
    it('should create ValidationError with message', () => {
      const error = new ValidationError('Validation failed');
      
      expect(error.message).toBe('Validation failed');
      expect(error.name).toBe('ValidationError');
      expect(error).toBeInstanceOf(AppError);
    });

    it('should create ValidationError with message and status', () => {
      const error = new ValidationError('Invalid input');
      
      expect(error.message).toBe('Invalid input');
      expect(error.status).toBe(400); // ValidationError uses 400, not 422
    });
  });

  describe('NetworkError', () => {
    it('should create NetworkError with message', () => {
      const error = new NetworkError('Network connection failed');
      
      expect(error.message).toBe('Network connection failed');
      expect(error.name).toBe('NetworkError');
      expect(error).toBeInstanceOf(AppError);
    });

    it('should create NetworkError with default message', () => {
      const error = new NetworkError();
      
      expect(error.message).toBe('Network error occurred');
    });
  });

  describe('ServerError', () => {
    it('should create ServerError with message and status', () => {
      const error = new ServerError('Internal server error', 500);
      
      expect(error.message).toBe('Internal server error');
      expect(error.status).toBe(500);
      expect(error.name).toBe('ServerError');
      expect(error).toBeInstanceOf(AppError);
    });

    it('should create ServerError with default message', () => {
      const error = new ServerError();
      
      expect(error.message).toBe('Server error occurred');
      expect(error.status).toBe(500); // ServerError has default status 500
    });
  });
});
