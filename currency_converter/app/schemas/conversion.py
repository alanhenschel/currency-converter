from pydantic import BaseModel
from typing import Any, Dict, Optional

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
    timestamp: str
    
class ExchangeRateData(BaseModel):
    code: str
    value: float

class ExchangeRateResponse(BaseModel):
    meta: Dict[str, Any]
    data: Dict[str, ExchangeRateData]

    @property
    def last_updated_at(self) -> Optional[str]:
        return self.meta.get("last_updated_at")