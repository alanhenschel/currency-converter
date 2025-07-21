from sqlalchemy.orm import Session
from ...infrastructure.db.models import Transaction
from ...domain.repositories.transaction_repository import TransactionRepository
from currency_converter.app.exceptions import DatabaseException


class TransactionRepositoryImpl(TransactionRepository):
    def __init__(self, db: Session):
        self.db = db

    def save(self, transaction: Transaction) -> Transaction:
        try:
            self.db.add(transaction)
            self.db.commit()
            self.db.refresh(transaction)
            return transaction
        except Exception as e:
            raise DatabaseException(f"Error saving transaction: {e}")

    def get_by_user_id(self, user_id: int):
        try:
            return (
                self.db.query(Transaction).filter(Transaction.user_id == user_id).all()
            )
        except Exception as e:
            raise DatabaseException(
                f"Error fetching transactions for user {user_id}: {e}"
            )
