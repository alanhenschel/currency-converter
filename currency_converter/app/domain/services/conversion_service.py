from decimal import Decimal
from typing import Tuple
from ...domain.models.currency import Currency
from ...domain.repositories.transaction_repository import TransactionRepository
from ...infrastructure.external.currency_api import CurrencyAPI

class ConversionService:
    def __init__(self, transaction_repository: TransactionRepository, currency_api: CurrencyAPI):
        self.transaction_repository = transaction_repository
        self.currency_api = currency_api

    def convert(self, from_currency: Currency, to_currency: Currency, amount: Decimal) -> Tuple[Decimal, Decimal]:
        if amount <= 0:
            raise ValueError("Amount must be greater than zero.")

        exchange_rate = self.currency_api.get_exchange_rate(from_currency.code, to_currency.code)
        converted_amount = amount * exchange_rate

        return converted_amount, exchange_rate

    def validate_currencies(self, from_currency: Currency, to_currency: Currency) -> None:
        if from_currency.code == to_currency.code:
            raise ValueError("From and to currencies must be different.")