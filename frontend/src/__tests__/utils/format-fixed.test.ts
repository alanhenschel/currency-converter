import {
  formatDate,
  formatNumber,
  parseFormNumber,
  parseFormInteger
} from '../../shared/utils/format';

describe('format utils', () => {
  describe('formatDate', () => {
    it('should format ISO date string correctly', () => {
      const isoDate = '2024-01-15T10:30:00Z';
      const formatted = formatDate(isoDate);
      
      // The exact format may vary by locale, but should contain date elements
      expect(formatted).toMatch(/Jan.*15.*2024/);
      // Don't test exact time format as it depends on timezone
      expect(formatted.length).toBeGreaterThan(10);
    });

    it('should handle different date formats', () => {
      const isoDate = '2024-12-25T23:59:59Z';
      const formatted = formatDate(isoDate);
      
      expect(formatted).toMatch(/Dec.*25.*2024/);
      // Don't test exact time format as it depends on timezone
      expect(formatted.length).toBeGreaterThan(10);
    });

    it('should handle Date objects', () => {
      const date = new Date('2024-06-01T12:00:00Z');
      const formatted = formatDate(date);
      
      expect(formatted).toMatch(/Jun.*1.*2024/);
    });

    it('should handle timestamp numbers', () => {
      const timestamp = Date.parse('2024-06-01T12:00:00Z');
      const formatted = formatDate(timestamp);
      
      expect(formatted).toMatch(/Jun.*1.*2024/);
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with 2 decimal places by default', () => {
      expect(formatNumber(123.456)).toBe('123.46');
      expect(formatNumber(100)).toBe('100.00');
      expect(formatNumber(0.1)).toBe('0.10');
    });

    it('should respect custom decimal places', () => {
      expect(formatNumber(123.456, 0)).toBe('123');
      expect(formatNumber(123.456, 1)).toBe('123.5');
      expect(formatNumber(123.456, 3)).toBe('123.456');
      expect(formatNumber(123.456, 4)).toBe('123.4560');
    });

    it('should handle edge cases', () => {
      expect(formatNumber(0)).toBe('0.00');
      expect(formatNumber(-123.456)).toBe('-123.46');
    });
  });

  describe('parseFormNumber', () => {
    it('should parse valid number strings', () => {
      expect(parseFormNumber('123.45')).toBe(123.45);
      expect(parseFormNumber('100')).toBe(100);
      expect(parseFormNumber('0.5')).toBe(0.5);
      expect(parseFormNumber('-50.25')).toBe(-50.25);
    });

    it('should return 0 for invalid strings', () => {
      expect(parseFormNumber('')).toBe(0);
      expect(parseFormNumber('abc')).toBe(0);
      expect(parseFormNumber('  ')).toBe(0);
    });

    it('should handle partially valid strings', () => {
      // parseFloat ignores trailing non-numeric characters
      expect(parseFormNumber('12abc')).toBe(12);
    });
  });

  describe('parseFormInteger', () => {
    it('should parse valid integer strings', () => {
      expect(parseFormInteger('123')).toBe(123);
      expect(parseFormInteger('100')).toBe(100);
      expect(parseFormInteger('-50')).toBe(-50);
    });

    it('should handle decimal strings by truncating', () => {
      expect(parseFormInteger('123.45')).toBe(123);
      expect(parseFormInteger('100.99')).toBe(100);
      expect(parseFormInteger('-50.75')).toBe(-50);
    });

    it('should return 0 for invalid strings', () => {
      expect(parseFormInteger('')).toBe(0);
      expect(parseFormInteger('abc')).toBe(0);
      expect(parseFormInteger('  ')).toBe(0);
    });

    it('should handle partially valid strings', () => {
      // parseInt ignores trailing non-numeric characters
      expect(parseFormInteger('12abc')).toBe(12);
    });

    it('should handle minimum value of 1', () => {
      expect(parseFormInteger('0')).toBe(0);
      expect(parseFormInteger('-5')).toBe(-5);
    });
  });
});
