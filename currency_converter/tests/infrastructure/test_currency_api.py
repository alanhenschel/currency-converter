import pytest
from app.infrastructure.external.currency_api import CurrencyAPI

@pytest.fixture
def currency_api():
    return CurrencyAPI()

def test_get_exchange_rate(currency_api):
    rate = currency_api.get_exchange_rate("USD", "BRL")
    assert rate is not None
    assert isinstance(rate, float)

def test_get_exchange_rate_invalid_currency(currency_api):
    with pytest.raises(ValueError):
        currency_api.get_exchange_rate("INVALID", "BRL")

def test_get_exchange_rate_nonexistent_currency(currency_api):
    with pytest.raises(ValueError):
        currency_api.get_exchange_rate("USD", "NONEXISTENT")