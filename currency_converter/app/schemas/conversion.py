from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class ConversionRequest(BaseModel):
    from_currency: str
    to_currency: str
    amount: float
    
class ConversionResponse(BaseModel):
    transaction_id: Optional[int]
    from_currency: str
    to_currency: str
    from_value: float
    to_value: float
    rate: float
    timestamp: datetime