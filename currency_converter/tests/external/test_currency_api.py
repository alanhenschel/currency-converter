import pytest
from unittest.mock import Mock, patch
from requests.exceptions import Timeout, ConnectionError

from currency_converter.app.infrastructure.external.currency_api import CurrencyAPI
from currency_converter.app.schemas.conversion import ConversionRequest
from currency_converter.app.exceptions import (
    ConversionErrorException,
    CurrencyNotFoundException,
)


class TestCurrencyAPI:
    """Unit tests for the external currency exchange API."""

    def setup_method(self):
        """Setup executed before each test."""
        self.api_key = "test-api-key"
        self.currency_api = CurrencyAPI(self.api_key)

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_exchange_rate_success(self, mock_client_class):
        """Test busca successful exchange rate."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        mock_client.latest.return_value = {"data": {"BRL": {"value": 5.0}}}

        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD", to_currency="BRL", amount=100.0
        )

        # Act
        result = currency_api.get_exchange_rate(conversion_request)

        # Assert
        assert result == 5.0
        mock_client.latest.assert_called_once_with(
            base_currency="USD", currencies=["BRL"]
        )

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_exchange_rate_api_error_response(self, mock_client_class):
        """Test erro na resposta da API externa."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        mock_client.latest.side_effect = Exception("API Error")

        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD", to_currency="XYZ", amount=100.0
        )

        # Act & Assert
        with pytest.raises(ConversionErrorException) as exc_info:
            currency_api.get_exchange_rate(conversion_request)

        assert "API Error" in str(exc_info.value)

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_exchange_rate_network_timeout(self, mock_client_class):
        """Test timeout de rede."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        mock_client.latest.side_effect = Timeout("Request timed out")

        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD", to_currency="BRL", amount=100.0
        )

        # Act & Assert
        with pytest.raises(ConversionErrorException) as exc_info:
            currency_api.get_exchange_rate(conversion_request)

        assert "Request timed out" in str(exc_info.value)

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_exchange_rate_connection_error(self, mock_client_class):
        """Test erro de conexão."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        mock_client.latest.side_effect = ConnectionError("Failed to connect to API")

        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD", to_currency="BRL", amount=100.0
        )

        # Act & Assert
        with pytest.raises(ConversionErrorException) as exc_info:
            currency_api.get_exchange_rate(conversion_request)

        assert "Failed to connect to API" in str(exc_info.value)

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_exchange_rate_malformed_response(self, mock_client_class):
        """Test resposta malformada da API."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        # Retorna resposta sem campo 'data'
        mock_client.latest.return_value = {
            "success": True,
            # Campo 'data' ausente
        }

        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD", to_currency="BRL", amount=100.0
        )

        # Act & Assert
        with pytest.raises(CurrencyNotFoundException):
            currency_api.get_exchange_rate(conversion_request)

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_exchange_rate_rate_not_found(self, mock_client_class):
        """Test quando a taxa para a moeda não é encontrada."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        mock_client.latest.return_value = {
            "data": {
                "EUR": {"value": 0.85},
                "GBP": {"value": 0.75}
                # BRL ausente
            }
        }

        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD", to_currency="BRL", amount=100.0
        )

        # Act & Assert
        with pytest.raises(CurrencyNotFoundException) as exc_info:
            currency_api.get_exchange_rate(conversion_request)

        assert "BRL" in str(exc_info.value)

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_exchange_rate_json_decode_error(self, mock_client_class):
        """Test erro ao decodificar JSON da resposta."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        mock_client.latest.side_effect = ValueError("Invalid JSON")

        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD", to_currency="BRL", amount=100.0
        )

        # Act & Assert
        with pytest.raises(ConversionErrorException) as exc_info:
            currency_api.get_exchange_rate(conversion_request)

        assert "Invalid JSON" in str(exc_info.value)

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_exchange_rate_different_currencies(self, mock_client_class):
        """Test conversão between different currency pairs."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        mock_client.latest.return_value = {"data": {"JPY": {"value": 140.0}}}

        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="EUR", to_currency="JPY", amount=50.0
        )

        # Act
        result = currency_api.get_exchange_rate(conversion_request)

        # Assert
        assert result == 140.0
        mock_client.latest.assert_called_once_with(
            base_currency="EUR", currencies=["JPY"]
        )

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_supported_currencies_success(self, mock_client_class):
        """Test busca successful supported currencies."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        expected_currencies = {
            "data": {
                "USD": {"name": "US Dollar"},
                "BRL": {"name": "Brazilian Real"},
                "EUR": {"name": "Euro"},
            }
        }
        mock_client.currencies.return_value = expected_currencies

        currency_api = CurrencyAPI(self.api_key)

        # Act
        result = currency_api.get_supported_currencies()

        # Assert
        assert result == expected_currencies
        mock_client.currencies.assert_called_once()

    @patch("currency_converter.app.infrastructure.external.currency_api.Client")
    def test_get_supported_currencies_error(self, mock_client_class):
        """Test erro when retrieving moedas suportadas."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client

        mock_client.currencies.side_effect = Exception("API Error")

        currency_api = CurrencyAPI(self.api_key)

        # Act & Assert
        with pytest.raises(ConversionErrorException) as exc_info:
            currency_api.get_supported_currencies()

        assert "API Error" in str(exc_info.value)
