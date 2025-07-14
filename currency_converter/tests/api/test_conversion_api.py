import pytest
from unittest.mock import Mock
from fastapi.testclient import TestClient
from datetime import datetime, timezone

from currency_converter.app.main import app
from currency_converter.app.schemas.conversion import ConversionRequest
from currency_converter.app.domain.models.transaction import Transaction
from currency_converter.app.exceptions import (
    ConversionErrorException, 
    CurrencyNotFoundException, 
    ValidationServiceException
)
from currency_converter.app.api.dependencies import get_conversion_service

client = TestClient(app)


class TestConversionAPI:
    """Testes unitários isolados para a API de conversão de moedas."""

    def test_convert_currency_success(self):
        """Testa conversão bem-sucedida de moeda."""
        # Arrange
        mock_service = Mock()
        mock_transaction = Transaction(
            transaction_id=1,
            user_id=123,
            from_currency="USD",
            to_currency="BRL", 
            from_value=100.0,
            to_value=500.0,
            rate=5.0,
            timestamp=datetime.now(timezone.utc)
        )
        mock_service.convert.return_value = mock_transaction

        # Override dependency
        app.dependency_overrides[get_conversion_service] = lambda: mock_service

        try:
            # Act
            response = client.post(
                "/api/v1/conversion",
                json={"from_currency": "USD", "to_currency": "BRL", "amount": 100}
            )

            # Assert
            assert response.status_code == 200
            data = response.json()
            assert data["from_currency"] == "USD"
            assert data["to_currency"] == "BRL"
            assert data["from_value"] == 100.0
            assert data["to_value"] == 500.0
            assert data["rate"] == 5.0
            assert data["transaction_id"] == 1
            assert "timestamp" in data
            
            # Verifica se o serviço foi chamado corretamente
            mock_service.convert.assert_called_once()
            call_args = mock_service.convert.call_args[0][0]
            assert call_args.from_currency == "USD"
            assert call_args.to_currency == "BRL"
            assert call_args.amount == 100
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_convert_currency_validation_service_exception(self):
        """Testa exceção de validação do serviço."""
        # Arrange
        mock_service = Mock()
        mock_service.convert.side_effect = ValidationServiceException("Amount must be greater than zero")

        # Override dependency
        app.dependency_overrides[get_conversion_service] = lambda: mock_service

        try:
            # Act
            response = client.post(
                "/api/v1/conversion",
                json={"from_currency": "USD", "to_currency": "BRL", "amount": -10}
            )

            # Assert
            assert response.status_code == 422
            assert "Amount must be greater than zero" in response.json()["detail"]
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_convert_currency_not_found_exception(self):
        """Testa exceção de moeda não encontrada."""
        # Arrange
        mock_service = Mock()
        mock_service.convert.side_effect = CurrencyNotFoundException("Currency XYZ not found")

        # Override dependency
        app.dependency_overrides[get_conversion_service] = lambda: mock_service

        try:
            # Act
            response = client.post(
                "/api/v1/conversion",
                json={"from_currency": "XYZ", "to_currency": "BRL", "amount": 100}
            )

            # Assert
            assert response.status_code == 404
            assert "Currency XYZ not found" in response.json()["detail"]
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_convert_currency_conversion_error(self):
        """Testa erro durante conversão."""
        # Arrange
        mock_service = Mock()
        mock_service.convert.side_effect = ConversionErrorException("API rate limit exceeded")

        # Override dependency
        app.dependency_overrides[get_conversion_service] = lambda: mock_service

        try:
            # Act
            response = client.post(
                "/api/v1/conversion",
                json={"from_currency": "USD", "to_currency": "BRL", "amount": 100}
            )

            # Assert
            assert response.status_code == 400
            assert "API rate limit exceeded" in response.json()["detail"]
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_convert_currency_unexpected_error(self):
        """Testa erro inesperado."""
        # Arrange
        mock_service = Mock()
        mock_service.convert.side_effect = Exception("Unexpected database error")

        # Override dependency
        app.dependency_overrides[get_conversion_service] = lambda: mock_service

        try:
            # Act
            response = client.post(
                "/api/v1/conversion",
                json={"from_currency": "USD", "to_currency": "BRL", "amount": 100}
            )

            # Assert
            assert response.status_code == 500
            assert "Internal Server Error" in response.json()["detail"]
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_convert_currency_missing_fields(self):
        """Testa requisição com campos obrigatórios faltando."""
        # Act
        response = client.post(
            "/api/v1/conversion",
            json={"from_currency": "USD", "amount": 100}  # Missing to_currency
        )

        # Assert
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_convert_currency_invalid_json(self):
        """Testa requisição com JSON inválido."""
        # Act
        response = client.post(
            "/api/v1/conversion",
            json={"from_currency": "USD", "to_currency": "BRL", "amount": "invalid"}
        )

        # Assert
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_convert_currency_invalid_amount_validation(self):
        """Testa validação de valor inválido (zero) que deveria ser rejeitado pelo serviço."""
        # Arrange
        mock_service = Mock()
        mock_service.convert.side_effect = ValidationServiceException("Amount must be greater than zero")

        # Override dependency
        app.dependency_overrides[get_conversion_service] = lambda: mock_service

        try:
            # Act
            response = client.post(
                "/api/v1/conversion", 
                json={"from_currency": "USD", "to_currency": "BRL", "amount": 0}
            )

            # Assert
            assert response.status_code == 422
            assert "Amount must be greater than zero" in response.json()["detail"]
        finally:
            # Clean up
            app.dependency_overrides.clear()
