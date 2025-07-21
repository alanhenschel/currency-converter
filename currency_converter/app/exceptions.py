# app/exceptions.py


# Base Exception
class CurrencyConverterException(Exception):
    """Base class for all exceptions raised by the currency converter application."""

    pass


# API Exceptions
class APIException(CurrencyConverterException):
    """Base exception for API layer."""

    pass


class BadRequestException(APIException):
    """Exception for invalid requests."""

    def __init__(self, message):
        super().__init__(message)


class UnauthorizedException(APIException):
    """Exception for unauthorized access."""

    def __init__(self, message="Unauthorized"):
        super().__init__(message)


class ForbiddenException(APIException):
    """Exception for forbidden access."""

    def __init__(self, message="Forbidden"):
        super().__init__(message)


class NotFoundException(APIException):
    """Exception for not found resources."""

    def __init__(self, resource="Resource"):
        super().__init__(f"{resource} not found.")


# Service Exceptions
class ServiceException(CurrencyConverterException):
    """Base exception for service layer."""

    pass


class ValidationServiceException(ServiceException):
    """Exception for validation errors in service layer."""

    def __init__(self, message):
        super().__init__(message)


class BusinessRuleException(ServiceException):
    """Exception for business rule violations."""

    def __init__(self, message):
        super().__init__(message)


class TransactionServiceException(ServiceException):
    """Exception for transaction service errors."""

    def __init__(self, message):
        super().__init__(message)


# Infrastructure Exceptions
class InfrastructureException(CurrencyConverterException):
    """Base exception for infrastructure layer."""

    pass


class DatabaseException(InfrastructureException):
    """Exception for database errors."""

    def __init__(self, message):
        super().__init__(message)


class ExternalAPIException(InfrastructureException):
    """Exception for errors calling external APIs."""

    def __init__(self, message):
        super().__init__(message)


class CurrencyNotFoundException(NotFoundException):
    """Exception raised when a requested currency is not found."""

    def __init__(self, currency_code):
        self.currency_code = currency_code
        super().__init__(f"Currency '{currency_code}'")


class ConversionErrorException(ServiceException):
    """Exception raised when there is an error during currency conversion."""

    def __init__(self, message):
        super().__init__(message)


class TransactionNotFoundException(NotFoundException):
    """Exception raised when a requested transaction is not found."""

    def __init__(self, transaction_id):
        self.transaction_id = transaction_id
        super().__init__(f"Transaction with ID '{transaction_id}'")
