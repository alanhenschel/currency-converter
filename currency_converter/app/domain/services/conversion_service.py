import datetime
from decimal import Decimal
from time import timezone
from typing import Tuple
from currency_converter.app.domain.models.transaction import Transaction
from currency_converter.app.schemas.conversion import ConversionRequest
from ...domain.models.currency import Currency
from ...domain.repositories.transaction_repository import TransactionRepository
from ...infrastructure.external.currency_api import CurrencyAPI

class ConversionService:
    def __init__(self, transaction_repository: TransactionRepository, currency_api: CurrencyAPI):
        self.transaction_repository = transaction_repository
        self.currency_api = currency_api

    def convert(self, conversion_request: ConversionRequest) -> None:
        if conversion_request.amount <= 0:
            raise ValueError("Amount must be greater than zero.")

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
        self.transaction_repository.save(transaction.to_orm())

    def validate_currencies(self, from_currency: Currency, to_currency: Currency) -> None:
        if from_currency.code == to_currency.code:
            raise ValueError("From and to currencies must be different.")