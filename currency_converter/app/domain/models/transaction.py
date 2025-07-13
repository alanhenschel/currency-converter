from datetime import datetime
from pydantic import BaseModel

class Transaction(BaseModel):
    user_id: int
    from_currency: str
    to_currency: str
    from_value: float
    to_value: float
    rate: float
    timestamp: datetime

    class Config:
        orm_mode = True