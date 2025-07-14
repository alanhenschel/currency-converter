"""
Testes unitários isolados para CurrencyAPI.
Estes testes mockam diretamente o cliente da API externa para evitar chamadas reais.
"""

import pytest
from unittest.mock import Mock, patch
from currency_converter.app.infrastructure.external.currency_api import CurrencyAPI
from currency_converter.app.schemas.conversion import ConversionRequest
from currency_converter.app.exceptions import ConversionErrorException, CurrencyNotFoundException


class TestCurrencyAPIIsolated:
    """Testes unitários isolados para CurrencyAPI."""

    def setup_method(self):
        """Setup executado antes de cada teste."""
        self.api_key = "test_api_key"
        
    @patch('currency_converter.app.infrastructure.external.currency_api.Client')
    def test_get_exchange_rate_success(self, mock_client_class):
        """Testa busca bem-sucedida de taxa de câmbio."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client
        
        mock_client.latest.return_value = {
            'data': {
                'BRL': {
                    'value': 5.0
                }
            }
        }
        
        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=100.0
        )

        # Act
        result = currency_api.get_exchange_rate(conversion_request)

        # Assert
        assert result == 5.0
        mock_client.latest.assert_called_once_with(
            base_currency="USD",
            currencies=["BRL"]
        )

    @patch('currency_converter.app.infrastructure.external.currency_api.Client')
    def test_get_exchange_rate_currency_not_found(self, mock_client_class):
        """Testa quando a moeda não é encontrada na resposta."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client
        
        mock_client.latest.return_value = {
            'data': {
                'EUR': {
                    'value': 0.85
                }
                # BRL ausente
            }
        }
        
        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=100.0
        )

        # Act & Assert
        with pytest.raises(CurrencyNotFoundException) as exc_info:
            currency_api.get_exchange_rate(conversion_request)
        
        assert "BRL" in str(exc_info.value)

    @patch('currency_converter.app.infrastructure.external.currency_api.Client')
    def test_get_exchange_rate_empty_response(self, mock_client_class):
        """Testa resposta vazia da API."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client
        
        mock_client.latest.return_value = None
        
        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=100.0
        )

        # Act & Assert
        with pytest.raises(CurrencyNotFoundException):
            currency_api.get_exchange_rate(conversion_request)

    @patch('currency_converter.app.infrastructure.external.currency_api.Client')
    def test_get_exchange_rate_client_exception(self, mock_client_class):
        """Testa exceção do cliente da API."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client
        
        mock_client.latest.side_effect = Exception("API Error")
        
        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=100.0
        )

        # Act & Assert
        with pytest.raises(ConversionErrorException) as exc_info:
            currency_api.get_exchange_rate(conversion_request)
        
        assert "API Error" in str(exc_info.value)

    @patch('currency_converter.app.infrastructure.external.currency_api.Client')
    def test_get_exchange_rate_different_currencies(self, mock_client_class):
        """Testa conversão entre diferentes pares de moedas."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client
        
        mock_client.latest.return_value = {
            'data': {
                'JPY': {
                    'value': 140.0
                }
            }
        }
        
        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="EUR",
            to_currency="JPY",
            amount=50.0
        )

        # Act
        result = currency_api.get_exchange_rate(conversion_request)

        # Assert
        assert result == 140.0
        mock_client.latest.assert_called_once_with(
            base_currency="EUR",
            currencies=["JPY"]
        )

    @patch('currency_converter.app.infrastructure.external.currency_api.Client')
    def test_get_exchange_rate_malformed_response(self, mock_client_class):
        """Testa resposta malformada da API."""
        # Arrange
        mock_client = Mock()
        mock_client_class.return_value = mock_client
        
        mock_client.latest.return_value = {
            'wrong_field': {}
            # Campo 'data' ausente
        }
        
        currency_api = CurrencyAPI(self.api_key)
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=100.0
        )

        # Act & Assert
        with pytest.raises(CurrencyNotFoundException):
            currency_api.get_exchange_rate(conversion_request)
