from pydantic import BaseModel
from datetime import datetime

class TransactionBase(BaseModel):
    user_id: int
    from_currency: str
    to_currency: str
    from_value: float
    to_value: float
    rate: float
    timestamp: datetime

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    transaction_id: int

    class Config:
        orm_mode = True
        
class TransactionResponse(Transaction):
    pass