from app.domain.services.conversion_service import ConversionService
from app.domain.services.transaction_service import TransactionService
from app.domain.models.transaction import Transaction
from app.domain.models.currency import Currency
from app.domain.repositories.transaction_repository import TransactionRepository
from unittest import TestCase
from unittest.mock import MagicMock

class TestConversionService(TestCase):
    def setUp(self):
        self.conversion_service = ConversionService()
    
    def test_conversion(self):
        result = self.conversion_service.convert(100, 'USD', 'BRL')
        self.assertIsInstance(result, float)

class TestTransactionService(TestCase):
    def setUp(self):
        self.transaction_service = TransactionService()
        self.mock_repository = MagicMock(spec=TransactionRepository)
        self.transaction_service.repository = self.mock_repository

    def test_record_transaction(self):
        transaction = Transaction(user_id=1, from_currency=Currency(code='USD'), to_currency=Currency(code='BRL'), from_value=100, to_value=525.32, rate=5.2532)
        self.transaction_service.record_transaction(transaction)
        self.mock_repository.save.assert_called_once_with(transaction)

    def test_get_transactions(self):
        user_id = 1
        self.mock_repository.get_by_user_id.return_value = []
        transactions = self.transaction_service.get_transactions(user_id)
        self.assertEqual(transactions, [])
        self.mock_repository.get_by_user_id.assert_called_once_with(user_id)