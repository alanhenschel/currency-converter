from unittest.mock import Mock
from fastapi.testclient import TestClient
from datetime import datetime, timezone

from currency_converter.app.main import app
from currency_converter.app.domain.models.transaction import Transaction
from currency_converter.app.exceptions import ServiceException
from currency_converter.app.api.dependencies import get_transaction_service

client = TestClient(app)


class TestTransactionsAPI:
    """Isolated unit tests for the transactions API."""

    def test_get_transactions_success(self):
        """Test successful retrieval of user transactions."""
        # Arrange
        mock_service = Mock()
        mock_transactions = [
            Transaction(
                transaction_id=1,
                user_id=123,
                from_currency="USD",
                to_currency="BRL",
                from_value=100.0,
                to_value=500.0,
                rate=5.0,
                timestamp=datetime.now(timezone.utc),
            ),
            Transaction(
                transaction_id=2,
                user_id=123,
                from_currency="EUR",
                to_currency="USD",
                from_value=50.0,
                to_value=55.0,
                rate=1.1,
                timestamp=datetime.now(timezone.utc),
            ),
        ]
        mock_service.get_transactions.return_value = mock_transactions

        # Override dependency
        app.dependency_overrides[get_transaction_service] = lambda: mock_service

        try:
            # Act
            response = client.get("/api/v1/transactions?userId=123")

            # Assert
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 2
            assert data[0]["transaction_id"] == 1
            assert data[0]["from_currency"] == "USD"
            assert data[0]["to_currency"] == "BRL"
            assert data[1]["transaction_id"] == 2
            assert data[1]["from_currency"] == "EUR"
            assert data[1]["to_currency"] == "USD"

            # Verify that the service was called correctly
            mock_service.get_transactions.assert_called_once_with(123)
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_get_transactions_empty_list(self):
        """Test transaction retrieval when user has no transactions."""
        # Arrange
        mock_service = Mock()
        mock_service.get_transactions.return_value = []

        # Override dependency
        app.dependency_overrides[get_transaction_service] = lambda: mock_service

        try:
            # Act
            response = client.get("/api/v1/transactions?userId=456")

            # Assert
            assert response.status_code == 200
            data = response.json()
            assert len(data) == 0
            assert data == []

            # Verify that the service was called correctly
            mock_service.get_transactions.assert_called_once_with(456)
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_get_transactions_service_exception(self):
        """Test service error when retrieving transactions."""
        # Arrange
        mock_service = Mock()
        mock_service.get_transactions.side_effect = ServiceException(
            "Database connection failed"
        )

        # Override dependency
        app.dependency_overrides[get_transaction_service] = lambda: mock_service

        try:
            # Act
            response = client.get("/api/v1/transactions?userId=123")

            # Assert
            assert response.status_code == 500
            assert "Database connection failed" in response.json()["detail"]
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_get_transactions_unexpected_error(self):
        """Test unexpected error when retrieving transactions."""
        # Arrange
        mock_service = Mock()
        mock_service.get_transactions.side_effect = Exception("Unexpected error")

        # Override dependency
        app.dependency_overrides[get_transaction_service] = lambda: mock_service

        try:
            # Act
            response = client.get("/api/v1/transactions?userId=123")

            # Assert
            assert response.status_code == 500
            assert "Internal Server Error" in response.json()["detail"]
        finally:
            # Clean up
            app.dependency_overrides.clear()

    def test_get_transactions_invalid_user_id(self):
        """Test request with invalid user_id."""
        # Act
        response = client.get("/api/v1/transactions?userId=invalid")

        # Assert
        assert response.status_code == 422
        assert "detail" in response.json()

    def test_get_transactions_negative_user_id(self):
        """Test request with negative user_id."""
        # Arrange
        mock_service = Mock()
        mock_service.get_transactions.side_effect = ServiceException("Invalid user ID")

        # Override dependency
        app.dependency_overrides[get_transaction_service] = lambda: mock_service

        try:
            # Act
            response = client.get("/api/v1/transactions?userId=-1")

            # Assert
            assert response.status_code == 500
            assert "Invalid user ID" in response.json()["detail"]
        finally:
            # Clean up
            app.dependency_overrides.clear()
