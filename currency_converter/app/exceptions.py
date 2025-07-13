# app/exceptions.py

class CurrencyConverterException(Exception):
    """Base class for all exceptions raised by the currency converter application."""
    pass

class CurrencyNotFoundException(CurrencyConverterException):
    """Exception raised when a requested currency is not found."""
    def __init__(self, currency_code):
        self.currency_code = currency_code
        super().__init__(f"Currency '{currency_code}' not found.")

class ConversionErrorException(CurrencyConverterException):
    """Exception raised when there is an error during currency conversion."""
    def __init__(self, message):
        super().__init__(message)

class TransactionNotFoundException(CurrencyConverterException):
    """Exception raised when a requested transaction is not found."""
    def __init__(self, transaction_id):
        self.transaction_id = transaction_id
        super().__init__(f"Transaction with ID '{transaction_id}' not found.")