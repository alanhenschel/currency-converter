import pytest
from unittest.mock import Mock, MagicMock
from datetime import datetime, timezone
from sqlalchemy.exc import SQLAlchemyError

from currency_converter.app.infrastructure.repositories.transaction_repository_impl import TransactionRepositoryImpl
from currency_converter.app.infrastructure.db.models import Transaction as TransactionORM
from currency_converter.app.exceptions import DatabaseException


class TestTransactionRepository:
    """Isolated unit tests for the transaction repository."""

    def setup_method(self):
        """Setup executado antes de cada teste."""
        self.mock_db_session = Mock()
        self.repository = TransactionRepositoryImpl(self.mock_db_session)

    def test_save_transaction_success(self):
        """Testa salvamento bem-sucedido de uma transação."""
        # Arrange
        now = datetime.now(timezone.utc)
        transaction = TransactionORM(
            user_id=123,
            from_currency="USD",
            to_currency="BRL",
            from_value=100.0,
            to_value=500.0,
            rate=5.0,
            timestamp=now
        )
        
        # Mock do comportamento do SQLAlchemy
        def mock_refresh(obj):
            obj.id = 1  # Simula o ID gerado após commit
            
        self.mock_db_session.add = Mock()
        self.mock_db_session.commit = Mock()
        self.mock_db_session.refresh = Mock(side_effect=mock_refresh)

        # Act
        result = self.repository.save(transaction)

        # Assert
        assert result == transaction
        assert result.id == 1  # ID foi atribuído pelo refresh
        
        # Verifica se os métodos do SQLAlchemy foram chamados na ordem correta
        self.mock_db_session.add.assert_called_once_with(transaction)
        self.mock_db_session.commit.assert_called_once()
        self.mock_db_session.refresh.assert_called_once_with(transaction)

    def test_save_transaction_database_error_raises_database_exception(self):
        """Testa erro de banco de dados ao salvar transação."""
        # Arrange
        transaction = TransactionORM(
            user_id=123,
            from_currency="USD",
            to_currency="BRL",
            from_value=100.0,
            to_value=500.0,
            rate=5.0,
            timestamp=datetime.now(timezone.utc)
        )
        
        # Mock do erro de banco de dados
        self.mock_db_session.add = Mock()
        self.mock_db_session.commit.side_effect = SQLAlchemyError("Connection timeout")

        # Act & Assert
        with pytest.raises(DatabaseException) as exc_info:
            self.repository.save(transaction)
        
        assert "Error saving transaction" in str(exc_info.value)
        assert "Connection timeout" in str(exc_info.value)
        
        # Verifica que add foi chamado mas commit falhou
        self.mock_db_session.add.assert_called_once_with(transaction)
        self.mock_db_session.commit.assert_called_once()
        self.mock_db_session.refresh.assert_not_called()

    def test_get_by_user_id_success(self):
        """Testa busca bem-sucedida de transações por usuário."""
        # Arrange
        user_id = 123
        now = datetime.now(timezone.utc)
        
        mock_transactions = [
            TransactionORM(
                id=1,
                user_id=123,
                from_currency="USD",
                to_currency="BRL",
                from_value=100.0,
                to_value=500.0,
                rate=5.0,
                timestamp=now
            ),
            TransactionORM(
                id=2,
                user_id=123,
                from_currency="EUR",
                to_currency="USD",
                from_value=50.0,
                to_value=55.0,
                rate=1.1,
                timestamp=now
            )
        ]
        
        # Mock do query SQLAlchemy
        mock_query = Mock()
        mock_filter = Mock()
        mock_query.filter.return_value = mock_filter
        mock_filter.all.return_value = mock_transactions
        self.mock_db_session.query.return_value = mock_query

        # Act
        result = self.repository.get_by_user_id(user_id)

        # Assert
        assert result == mock_transactions
        assert len(result) == 2
        assert result[0].id == 1
        assert result[0].user_id == 123
        assert result[1].id == 2
        assert result[1].user_id == 123
        
        # Verifica se a query foi construída corretamente
        self.mock_db_session.query.assert_called_once_with(TransactionORM)
        mock_query.filter.assert_called_once()
        mock_filter.all.assert_called_once()

    def test_get_by_user_id_empty_result(self):
        """Testa busca de transações quando usuário não tem transações."""
        # Arrange
        user_id = 456
        
        # Mock do query SQLAlchemy retornando lista vazia
        mock_query = Mock()
        mock_filter = Mock()
        mock_query.filter.return_value = mock_filter
        mock_filter.all.return_value = []
        self.mock_db_session.query.return_value = mock_query

        # Act
        result = self.repository.get_by_user_id(user_id)

        # Assert
        assert result == []
        assert len(result) == 0
        
        # Verifica se a query foi construída corretamente
        self.mock_db_session.query.assert_called_once_with(TransactionORM)
        mock_query.filter.assert_called_once()
        mock_filter.all.assert_called_once()

    def test_get_by_user_id_database_error_raises_database_exception(self):
        """Testa erro de banco de dados ao buscar transações."""
        # Arrange
        user_id = 123
        
        # Mock do erro de banco de dados
        mock_query = Mock()
        mock_filter = Mock()
        mock_query.filter.return_value = mock_filter
        mock_filter.all.side_effect = SQLAlchemyError("Table does not exist")
        self.mock_db_session.query.return_value = mock_query

        # Act & Assert
        with pytest.raises(DatabaseException) as exc_info:
            self.repository.get_by_user_id(user_id)
        
        assert "Error fetching transactions for user 123" in str(exc_info.value)
        assert "Table does not exist" in str(exc_info.value)
        
        # Verifica que a query foi tentada
        self.mock_db_session.query.assert_called_once_with(TransactionORM)
        mock_query.filter.assert_called_once()
        mock_filter.all.assert_called_once()

    def test_save_transaction_handles_generic_exception(self):
        """Testa tratamento de exceção genérica ao salvar."""
        # Arrange
        transaction = TransactionORM(
            user_id=123,
            from_currency="USD",
            to_currency="BRL",
            from_value=100.0,
            to_value=500.0,
            rate=5.0,
            timestamp=datetime.now(timezone.utc)
        )
        
        # Mock de exceção genérica
        self.mock_db_session.add.side_effect = Exception("Generic database error")

        # Act & Assert
        with pytest.raises(DatabaseException) as exc_info:
            self.repository.save(transaction)
        
        assert "Error saving transaction" in str(exc_info.value)
        assert "Generic database error" in str(exc_info.value)

    def test_get_by_user_id_handles_generic_exception(self):
        """Testa tratamento de exceção genérica ao buscar."""
        # Arrange
        user_id = 123
        
        # Mock de exceção genérica
        self.mock_db_session.query.side_effect = Exception("Generic query error")

        # Act & Assert
        with pytest.raises(DatabaseException) as exc_info:
            self.repository.get_by_user_id(user_id)
        
        assert "Error fetching transactions for user 123" in str(exc_info.value)
        assert "Generic query error" in str(exc_info.value)

    def test_save_transaction_preserves_transaction_data(self):
        """Testa se os dados da transação são preservados durante o save."""
        # Arrange
        now = datetime.now(timezone.utc)
        transaction = TransactionORM(
            user_id=789,
            from_currency="GBP",
            to_currency="JPY", 
            from_value=200.0,
            to_value=28000.0,
            rate=140.0,
            timestamp=now
        )
        
        # Mock simples do SQLAlchemy
        self.mock_db_session.add = Mock()
        self.mock_db_session.commit = Mock()
        self.mock_db_session.refresh = Mock()

        # Act
        result = self.repository.save(transaction)

        # Assert
        assert result.user_id == 789
        assert result.from_currency == "GBP"
        assert result.to_currency == "JPY"
        assert result.from_value == 200.0
        assert result.to_value == 28000.0
        assert result.rate == 140.0
        assert result.timestamp == now
