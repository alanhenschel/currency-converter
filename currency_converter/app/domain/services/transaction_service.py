from typing import List
from ...domain.models.transaction import Transaction
from ...domain.repositories.transaction_repository import TransactionRepository
from currency_converter.app.exceptions import ServiceException

class TransactionService:
    def __init__(self, transaction_repository: TransactionRepository):
        self.transaction_repository = transaction_repository

    def record_transaction(self, transaction: Transaction) -> Transaction:
        try:
            return self.transaction_repository.save(transaction.to_orm())
        except Exception as e:
            raise ServiceException(f"Error recording transaction: {e}")


    def get_transactions(self, user_id: int) -> List[Transaction]:
        try:
            transactions = self.transaction_repository.get_by_user_id(user_id)
            return [Transaction.from_orm(db_tr) for db_tr in transactions]
        except Exception as e:
            raise ServiceException(f"Error fetching transactions: {e}")