import pytest
from unittest.mock import Mock, patch
from datetime import datetime, timezone

from currency_converter.app.domain.services.conversion_service import ConversionService
from currency_converter.app.schemas.conversion import ConversionRequest
from currency_converter.app.domain.models.transaction import Transaction
from currency_converter.app.exceptions import (
    ConversionErrorException,
    ValidationServiceException
)


class TestConversionService:
    """Isolated unit tests for the currency conversion service."""

    def setup_method(self):
        """Setup executed before each test."""
        self.mock_transaction_repository = Mock()
        self.mock_currency_api = Mock()
        self.mock_transaction_service = Mock()
        
        self.service = ConversionService(
            transaction_repository=self.mock_transaction_repository,
            currency_api=self.mock_currency_api,
            transaction_service=self.mock_transaction_service
        )

    def test_convert_success(self):
        """Test successful conversion."""
        # Arrange
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=100.0
        )
        
        # Mock da API externa retornando taxa de câmbio
        self.mock_currency_api.get_exchange_rate.return_value = 5.0
        
        # Mock do transaction_service retornando transação salva
        saved_transaction = Transaction(
            transaction_id=1,
            user_id=123,
            from_currency="USD",
            to_currency="BRL",
            from_value=100.0,
            to_value=500.0,
            rate=5.0,
            timestamp=datetime.now(timezone.utc)
        )
        self.mock_transaction_service.record_transaction.return_value = saved_transaction
        
        # Mock do Transaction.from_orm
        with patch.object(Transaction, 'from_orm', return_value=saved_transaction):
            # Act
            result = self.service.convert(conversion_request)

        # Assert
        assert result.from_currency == "USD"
        assert result.to_currency == "BRL"
        assert result.from_value == 100.0
        assert result.to_value == 500.0
        assert result.rate == 5.0
        assert result.transaction_id == 1
        
        # Verify se os mocks foram chamados corretamente
        self.mock_currency_api.get_exchange_rate.assert_called_once_with(conversion_request)
        self.mock_transaction_service.record_transaction.assert_called_once()

    def test_convert_zero_amount_raises_validation_error(self):
        """Test validation error para valor zero."""
        # Arrange
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=0.0
        )

        # Act & Assert
        with pytest.raises(ValidationServiceException) as exc_info:
            self.service.convert(conversion_request)
        
        assert "Amount must be greater than zero" in str(exc_info.value)
        
        # Verify que os mocks não foram chamados
        self.mock_currency_api.get_exchange_rate.assert_not_called()
        self.mock_transaction_service.record_transaction.assert_not_called()

    def test_convert_negative_amount_raises_validation_error(self):
        """Test validation error para valor negativo."""
        # Arrange
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=-10.0
        )

        # Act & Assert
        with pytest.raises(ValidationServiceException) as exc_info:
            self.service.convert(conversion_request)
        
        assert "Amount must be greater than zero" in str(exc_info.value)
        
        # Verify que os mocks não foram chamados
        self.mock_currency_api.get_exchange_rate.assert_not_called()
        self.mock_transaction_service.record_transaction.assert_not_called()

    def test_convert_currency_api_error_raises_conversion_error(self):
        """Test erro na API de câmbio."""
        # Arrange
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=100.0
        )
        
        # Mock da API externa levantando exceção ConversionErrorException
        self.mock_currency_api.get_exchange_rate.side_effect = ConversionErrorException("API timeout")

        # Act & Assert
        with pytest.raises(ConversionErrorException) as exc_info:
            self.service.convert(conversion_request)
        
        assert "API timeout" in str(exc_info.value)
        
        # Verify que a API foi chamada mas o transaction_service não
        self.mock_currency_api.get_exchange_rate.assert_called_once_with(conversion_request)
        self.mock_transaction_service.record_transaction.assert_not_called()

    def test_convert_transaction_service_error_raises_conversion_error(self):
        """Test erro no serviço transactions."""
        # Arrange
        conversion_request = ConversionRequest(
            from_currency="USD",
            to_currency="BRL",
            amount=100.0
        )
        
        # Mock da API externa retornando taxa de câmbio
        self.mock_currency_api.get_exchange_rate.return_value = 5.0
        
        # Mock do transaction_service levantando exceção
        self.mock_transaction_service.record_transaction.side_effect = Exception("Database error")

        # Act & Assert
        with pytest.raises(ConversionErrorException) as exc_info:
            self.service.convert(conversion_request)
        
        assert "Error during conversion" in str(exc_info.value)
        assert "Database error" in str(exc_info.value)
        
        # Verify que ambos foram chamados
        self.mock_currency_api.get_exchange_rate.assert_called_once_with(conversion_request)
        self.mock_transaction_service.record_transaction.assert_called_once()

    def test_convert_calculates_correct_amount(self):
        """Test se o cálculo da conversão está correto."""
        # Arrange
        conversion_request = ConversionRequest(
            from_currency="EUR",
            to_currency="USD",
            amount=50.0
        )
        
        # Mock da API externa retornando taxa de câmbio
        self.mock_currency_api.get_exchange_rate.return_value = 1.1
        
        # Mock do transaction_service
        def capture_transaction(transaction):
            # Captura a transação para verificar os valores
            assert transaction.from_value == 50.0
            assert abs(transaction.to_value - 55.0) < 0.001  # Tolerância para ponto flutuante
            assert transaction.rate == 1.1
            assert transaction.from_currency == "EUR"
            assert transaction.to_currency == "USD"
            return transaction
            
        self.mock_transaction_service.record_transaction.side_effect = capture_transaction
        
        # Mock do Transaction.from_orm
        result_transaction = Transaction(
            transaction_id=1,
            user_id=123,
            from_currency="EUR",
            to_currency="USD",
            from_value=50.0,
            to_value=55.0,
            rate=1.1,
            timestamp=datetime.now(timezone.utc)
        )
        
        # Mock do Transaction.from_orm
        with patch.object(Transaction, 'from_orm', return_value=result_transaction):
            # Act
            result = self.service.convert(conversion_request)

        # Assert
        assert result.to_value == 55.0
        assert result.rate == 1.1
