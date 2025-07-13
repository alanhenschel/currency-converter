from datetime import datetime
from typing import List, Optional
from ...domain.models.transaction import Transaction
from ...domain.repositories.transaction_repository import TransactionRepository

class TransactionService:
    def __init__(self, transaction_repository: TransactionRepository):
        self.transaction_repository = transaction_repository

    def record_transaction(self, user_id: int, from_currency: str, to_currency: str, from_value: float, to_value: float, rate: float) -> Transaction:
        transaction = Transaction(
            user_id=user_id,
            from_currency=from_currency,
            to_currency=to_currency,
            from_value=from_value,
            to_value=to_value,
            rate=rate,
            timestamp=datetime.utcnow()
        )
        return self.transaction_repository.save(transaction)

    def get_transactions(self, user_id: int) -> List[Transaction]:
        return self.transaction_repository.find_by_user_id(user_id)

    def get_transaction_by_id(self, transaction_id: int) -> Optional[Transaction]:
        return self.transaction_repository.find_by_id(transaction_id)