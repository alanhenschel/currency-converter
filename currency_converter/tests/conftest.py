import pytest
from unittest.mock import Mock
from datetime import datetime, timezone
from fastapi.testclient import TestClient

from currency_converter.app.main import app
from currency_converter.app.domain.models.transaction import Transaction
from currency_converter.app.infrastructure.db.models import Transaction as TransactionORM


@pytest.fixture
def client():
    """Fixture para cliente de teste do FastAPI."""
    return TestClient(app)


@pytest.fixture
def sample_transaction():
    """Fixture for an example transaction."""
    return Transaction(
        transaction_id=1,
        user_id=123,
        from_currency="USD",
        to_currency="BRL",
        from_value=100.0,
        to_value=500.0,
        rate=5.0,
        timestamp=datetime.now(timezone.utc)
    )


@pytest.fixture
def sample_transaction_orm():
    """Fixture for an example ORM transaction."""
    return TransactionORM(
        id=1,
        user_id=123,
        from_currency="USD",
        to_currency="BRL",
        from_value=100.0,
        to_value=500.0,
        rate=5.0,
        timestamp=datetime.now(timezone.utc)
    )


@pytest.fixture
def mock_db_session():
    """Fixture for database session mock."""
    return Mock()


@pytest.fixture
def mock_transaction_repository():
    """Fixture para mock do repositório transactions."""
    return Mock()


@pytest.fixture
def mock_currency_api():
    """Fixture para mock da API de câmbio."""
    mock = Mock()
    mock.get_exchange_rate.return_value = 5.0  # Default rate
    return mock


@pytest.fixture
def mock_transaction_service():
    """Fixture para mock do serviço transactions."""
    return Mock()


@pytest.fixture
def mock_conversion_service():
    """Fixture for conversion service mock."""
    return Mock()


@pytest.fixture(autouse=True)
def reset_mocks():
    """Fixture que roda automaticamente para resetar mocks entre testes."""
    yield
    # Cleanup após cada teste se necessário


class TestDataFactory:
    """Factory for creating standardized test data."""
    
    @staticmethod
    def create_transaction(
        transaction_id=1,
        user_id=123,
        from_currency="USD",
        to_currency="BRL",
        from_value=100.0,
        to_value=500.0,
        rate=5.0,
        timestamp=None
    ):
        """Creates a domain transaction."""
        if timestamp is None:
            timestamp = datetime.now(timezone.utc)
            
        return Transaction(
            transaction_id=transaction_id,
            user_id=user_id,
            from_currency=from_currency,
            to_currency=to_currency,
            from_value=from_value,
            to_value=to_value,
            rate=rate,
            timestamp=timestamp
        )
    
    @staticmethod
    def create_transaction_orm(
        id=1,
        user_id=123,
        from_currency="USD",
        to_currency="BRL",
        from_value=100.0,
        to_value=500.0,
        rate=5.0,
        timestamp=None
    ):
        """Creates an ORM transaction."""
        if timestamp is None:
            timestamp = datetime.now(timezone.utc)
            
        return TransactionORM(
            id=id,
            user_id=user_id,
            from_currency=from_currency,
            to_currency=to_currency,
            from_value=from_value,
            to_value=to_value,
            rate=rate,
            timestamp=timestamp
        )


# Configurações globais de teste
@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    """Configuração global do ambiente de teste."""
    # Configurar logging para testes, desabilitar logs externos, etc.
    import logging
    logging.getLogger("requests").setLevel(logging.WARNING)
    logging.getLogger("urllib3").setLevel(logging.WARNING)
    
    yield
    
    # Cleanup global se necessário
