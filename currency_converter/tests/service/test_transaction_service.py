import pytest
from unittest.mock import Mock
from datetime import datetime, timezone

from currency_converter.app.domain.services.transaction_service import TransactionService
from currency_converter.app.domain.models.transaction import Transaction
from currency_converter.app.infrastructure.db.models import Transaction as TransactionORM
from currency_converter.app.exceptions import ServiceException


class TestTransactionService:
    """Testes unitários isolados para o serviço transactions."""

    def setup_method(self):
        """Setup executed before each test."""
        self.mock_transaction_repository = Mock()
        self.service = TransactionService(self.mock_transaction_repository)

    def test_record_transaction_success(self):
        """Test gravação successful of a transaction."""
        # Arrange
        transaction = Transaction(
            user_id=123,
            transaction_id=None,  # Ainda não tem ID
            from_currency="USD",
            to_currency="BRL",
            from_value=100.0,
            to_value=500.0,
            rate=5.0,
            timestamp=datetime.now(timezone.utc)
        )
        
        # Mock do ORM retornado pelo repositório
        saved_orm_transaction = TransactionORM(
            id=1,
            user_id=123,
            from_currency="USD",
            to_currency="BRL",
            from_value=100.0,
            to_value=500.0,
            rate=5.0,
            timestamp=datetime.now(timezone.utc)
        )
        
        self.mock_transaction_repository.save.return_value = saved_orm_transaction

        # Act
        result = self.service.record_transaction(transaction)

        # Assert
        assert result == saved_orm_transaction
        
        # Verify se o repositório foi chamado com o ORM correto
        self.mock_transaction_repository.save.assert_called_once()
        call_args = self.mock_transaction_repository.save.call_args[0][0]
        assert isinstance(call_args, TransactionORM)
        assert call_args.user_id == 123
        assert call_args.from_currency == "USD"
        assert call_args.to_currency == "BRL"
        assert call_args.from_value == 100.0
        assert call_args.to_value == 500.0
        assert call_args.rate == 5.0

    def test_record_transaction_repository_error_raises_service_exception(self):
        """Test erro no repositório ao gravar transação."""
        # Arrange
        transaction = Transaction(
            user_id=123,
            transaction_id=None,
            from_currency="USD",
            to_currency="BRL",
            from_value=100.0,
            to_value=500.0,
            rate=5.0,
            timestamp=datetime.now(timezone.utc)
        )
        
        # Mock do repositório levantando exceção
        self.mock_transaction_repository.save.side_effect = Exception("Database connection failed")

        # Act & Assert
        with pytest.raises(ServiceException) as exc_info:
            self.service.record_transaction(transaction)
        
        assert "Error recording transaction" in str(exc_info.value)
        assert "Database connection failed" in str(exc_info.value)
        
        # Verify que o repositório foi chamado
        self.mock_transaction_repository.save.assert_called_once()

    def test_get_transactions_success(self):
        """Test busca successful transactions by user."""
        # Arrange
        user_id = 123
        
        # Mock das transações ORM retornadas pelo repositório
        orm_transactions = [
            TransactionORM(
                id=1,
                user_id=123,
                from_currency="USD",
                to_currency="BRL",
                from_value=100.0,
                to_value=500.0,
                rate=5.0,
                timestamp=datetime.now(timezone.utc)
            ),
            TransactionORM(
                id=2,
                user_id=123,
                from_currency="EUR",
                to_currency="USD",
                from_value=50.0,
                to_value=55.0,
                rate=1.1,
                timestamp=datetime.now(timezone.utc)
            )
        ]
        
        self.mock_transaction_repository.get_by_user_id.return_value = orm_transactions

        # Act
        result = self.service.get_transactions(user_id)

        # Assert
        assert len(result) == 2
        
        # Verify first transaction
        assert isinstance(result[0], Transaction)
        assert result[0].transaction_id == 1
        assert result[0].user_id == 123
        assert result[0].from_currency == "USD"
        assert result[0].to_currency == "BRL"
        assert result[0].from_value == 100.0
        assert result[0].to_value == 500.0
        assert result[0].rate == 5.0
        
        # Verify second transaction
        assert isinstance(result[1], Transaction)
        assert result[1].transaction_id == 2
        assert result[1].user_id == 123
        assert result[1].from_currency == "EUR"
        assert result[1].to_currency == "USD"
        assert result[1].from_value == 50.0
        assert result[1].to_value == 55.0
        assert result[1].rate == 1.1
        
        # Verify that the repository was called correctly
        self.mock_transaction_repository.get_by_user_id.assert_called_once_with(user_id)

    def test_get_transactions_empty_list(self):
        """Test busca transactions quando o usuário não tem transações."""
        # Arrange
        user_id = 456
        self.mock_transaction_repository.get_by_user_id.return_value = []

        # Act
        result = self.service.get_transactions(user_id)

        # Assert
        assert result == []
        assert len(result) == 0
        
        # Verify that the repository was called correctly
        self.mock_transaction_repository.get_by_user_id.assert_called_once_with(user_id)

    def test_get_transactions_repository_error_raises_service_exception(self):
        """Test erro no repositório when retrieving transações."""
        # Arrange
        user_id = 123
        self.mock_transaction_repository.get_by_user_id.side_effect = Exception("Database timeout")

        # Act & Assert
        with pytest.raises(ServiceException) as exc_info:
            self.service.get_transactions(user_id)
        
        assert "Error fetching transactions" in str(exc_info.value)
        assert "Database timeout" in str(exc_info.value)
        
        # Verify que o repositório foi chamado
        self.mock_transaction_repository.get_by_user_id.assert_called_once_with(user_id)

    def test_record_transaction_converts_domain_to_orm(self):
        """Test se a conversão de domínio para ORM está correta."""
        # Arrange
        now = datetime.now(timezone.utc)
        transaction = Transaction(
            user_id=456,
            transaction_id=None,
            from_currency="GBP",
            to_currency="JPY",
            from_value=75.0,
            to_value=10500.0,
            rate=140.0,
            timestamp=now
        )
        
        # Mock simples do repositório
        self.mock_transaction_repository.save.return_value = Mock()

        # Act
        self.service.record_transaction(transaction)

        # Assert
        # Verify se o repositório foi chamado com os valores corretos
        call_args = self.mock_transaction_repository.save.call_args[0][0]
        assert call_args.user_id == 456
        assert call_args.from_currency == "GBP"
        assert call_args.to_currency == "JPY"
        assert call_args.from_value == 75.0
        assert call_args.to_value == 10500.0
        assert call_args.rate == 140.0
        assert call_args.timestamp == now
