from typing import Dict, Any
from currencyapicom import Client
from currency_converter.app.schemas.conversion import ConversionRequest
from currency_converter.app.exceptions import (
    ConversionErrorException,
    CurrencyNotFoundException,
)


class CurrencyAPI:
    def __init__(self, api_key: str):
        self.client = Client(api_key)

    def get_exchange_rate(self, conversion_request: ConversionRequest) -> float:
        try:
            result = self.client.latest(
                base_currency=conversion_request.from_currency,
                currencies=[conversion_request.to_currency],
            )
            if (
                not result
                or "data" not in result
                or conversion_request.to_currency not in result["data"]
            ):
                raise CurrencyNotFoundException(conversion_request.to_currency)
            return result["data"][conversion_request.to_currency]["value"]
        except CurrencyNotFoundException:
            # Re-raise without wrapping
            raise
        except Exception as e:
            raise ConversionErrorException(f"Unexpected error: {str(e)}")

    def get_supported_currencies(self) -> Dict[str, Any]:
        try:
            return self.client.currencies()
        except Exception as e:
            raise ConversionErrorException(f"Unexpected error: {str(e)}")
