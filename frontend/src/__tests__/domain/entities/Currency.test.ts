import { 
  Currency, 
  SUPPORTED_CURRENCIES, 
  getCurrencyByCode, 
  formatCurrency 
} from '../../../domain/entities/Currency';

describe('Currency entities', () => {
  describe('Currency interface', () => {
    it('should define Currency interface correctly', () => {
      const currency: Currency = {
        code: 'USD',
        name: 'US Dollar',
        symbol: '$'
      };

      expect(currency.code).toBe('USD');
      expect(currency.name).toBe('US Dollar');
      expect(currency.symbol).toBe('$');
    });
  });

  describe('SUPPORTED_CURRENCIES', () => {
    it('should contain USD currency', () => {
      const usd = SUPPORTED_CURRENCIES.find(c => c.code === 'USD');
      
      expect(usd).toBeDefined();
      expect(usd?.name).toBe('US Dollar');
      expect(usd?.symbol).toBe('$');
    });

    it('should contain EUR currency', () => {
      const eur = SUPPORTED_CURRENCIES.find(c => c.code === 'EUR');
      
      expect(eur).toBeDefined();
      expect(eur?.name).toBe('Euro');
      expect(eur?.symbol).toBe('€');
    });

    it('should contain BRL currency', () => {
      const brl = SUPPORTED_CURRENCIES.find(c => c.code === 'BRL');
      
      expect(brl).toBeDefined();
      expect(brl?.name).toBe('Brazilian Real');
      expect(brl?.symbol).toBe('R$');
    });

    it('should contain JPY currency', () => {
      const jpy = SUPPORTED_CURRENCIES.find(c => c.code === 'JPY');
      
      expect(jpy).toBeDefined();
      expect(jpy?.name).toBe('Japanese Yen');
      expect(jpy?.symbol).toBe('¥');
    });

    it('should contain exactly 4 currencies', () => {
      expect(SUPPORTED_CURRENCIES).toHaveLength(4);
    });
  });

  describe('getCurrencyByCode', () => {
    it('should return USD currency for USD code', () => {
      const currency = getCurrencyByCode('USD');
      
      expect(currency).toBeDefined();
      expect(currency?.code).toBe('USD');
      expect(currency?.name).toBe('US Dollar');
    });

    it('should return EUR currency for EUR code', () => {
      const currency = getCurrencyByCode('EUR');
      
      expect(currency).toBeDefined();
      expect(currency?.code).toBe('EUR');
    });

    it('should return undefined for unsupported currency', () => {
      const currency = getCurrencyByCode('XYZ');
      
      expect(currency).toBeUndefined();
    });

    it('should be case sensitive', () => {
      const currency = getCurrencyByCode('usd');
      
      expect(currency).toBeUndefined();
    });
  });

  describe('formatCurrency', () => {
    it('should format USD currency correctly', () => {
      const formatted = formatCurrency(100, 'USD');
      
      expect(formatted).toContain('100');
      expect(formatted).toMatch(/\$|USD/);
    });

    it('should format EUR currency correctly', () => {
      const formatted = formatCurrency(250.50, 'EUR');
      
      expect(formatted).toContain('250');
      expect(formatted).toMatch(/€|EUR/);
    });

    it('should handle unsupported currency gracefully', () => {
      const formatted = formatCurrency(100, 'XYZ');
      
      expect(formatted).toBe('100 XYZ');
    });

    it('should format decimal amounts correctly', () => {
      const formatted = formatCurrency(123.45, 'USD');
      
      expect(formatted).toContain('123.45');
    });

    it('should format zero amount', () => {
      const formatted = formatCurrency(0, 'USD');
      
      expect(formatted).toContain('0');
    });
  });
});
