import datetime
from currency_converter.app.domain.models.transaction import Transaction
from currency_converter.app.domain.services.transaction_service import (
    TransactionService,
)
from currency_converter.app.schemas.conversion import ConversionRequest
from ...domain.repositories.transaction_repository import TransactionRepository
from ...infrastructure.external.currency_api import CurrencyAPI
from currency_converter.app.exceptions import (
    ConversionErrorException,
    ValidationServiceException,
)


class ConversionService:
    def __init__(
        self,
        transaction_repository: TransactionRepository,
        currency_api: CurrencyAPI,
        transaction_service: TransactionService,
    ):
        self.transaction_repository = transaction_repository
        self.currency_api = currency_api
        self.transaction_service = transaction_service

    def convert(self, conversion_request: ConversionRequest) -> Transaction:
        if conversion_request.amount <= 0:
            raise ValidationServiceException("Amount must be greater than zero.")

        try:
            exchange_rate = self.currency_api.get_exchange_rate(conversion_request)
            converted_amount = conversion_request.amount * exchange_rate
            transaction = Transaction(
                user_id=123,
                from_currency=conversion_request.from_currency,
                to_currency=conversion_request.to_currency,
                from_value=float(conversion_request.amount),
                to_value=float(converted_amount),
                rate=float(exchange_rate),
                timestamp=datetime.datetime.now(datetime.timezone.utc),
            )
            recorded_transaction = self.transaction_service.record_transaction(
                transaction
            )
            transaction = Transaction.from_orm(recorded_transaction)
            return transaction
        except (ConversionErrorException, ValidationServiceException) as e:
            # Re-raise specific exceptions without wrapping
            raise e
        except Exception as e:
            raise ConversionErrorException(f"Error during conversion: {str(e)}")
