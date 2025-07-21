from datetime import datetime
from pydantic import BaseModel
from typing import Optional
from currency_converter.app.infrastructure.db.models import (
    Transaction as TransactionORM,
)


class Transaction(BaseModel):
    user_id: int
    transaction_id: Optional[int]
    from_currency: str
    to_currency: str
    from_value: float
    to_value: float
    rate: float
    timestamp: datetime

    class Config:
        orm_mode = True

    def to_orm(self):
        return TransactionORM(
            user_id=self.user_id,
            from_currency=self.from_currency,
            to_currency=self.to_currency,
            from_value=self.from_value,
            to_value=self.to_value,
            rate=self.rate,
            timestamp=self.timestamp,
        )

    def from_orm(orm_obj):
        return Transaction(
            transaction_id=orm_obj.id,
            user_id=orm_obj.user_id,
            from_currency=orm_obj.from_currency,
            to_currency=orm_obj.to_currency,
            from_value=orm_obj.from_value,
            to_value=orm_obj.to_value,
            rate=orm_obj.rate,
            timestamp=orm_obj.timestamp,
        )
