from typing import Dict, Any
import requests

class CurrencyAPI:
    BASE_URL = "https://api.currencyapi.com/v3"

    def __init__(self, api_key: str):
        self.api_key = api_key

    def get_exchange_rate(self, from_currency: str, to_currency: str) -> Dict[str, Any]:
        endpoint = f"{self.BASE_URL}/convert"
        params = {
            "apikey": self.api_key,
            "from": from_currency,
            "to": to_currency,
            "amount": 1
        }
        response = requests.get(endpoint, params=params)
        response.raise_for_status()
        return response.json()

    def get_supported_currencies(self) -> Dict[str, Any]:
        endpoint = f"{self.BASE_URL}/currencies"
        response = requests.get(endpoint)
        response.raise_for_status()
        return response.json()