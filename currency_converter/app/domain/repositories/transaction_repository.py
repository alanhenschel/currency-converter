from abc import ABC, abstractmethod
from typing import List
from ...domain.models.transaction import Transaction

class TransactionRepository(ABC):
    @abstractmethod
    def save(self, transaction: Transaction) -> Transaction:
        """Save a transaction to the repository."""
        pass

    @abstractmethod
    def get_by_user_id(self, user_id: int) -> List[Transaction]:
        """Retrieve transactions for a specific user by user ID."""
        pass

    @abstractmethod
    def get_all(self) -> List[Transaction]:
        """Retrieve all transactions."""
        pass