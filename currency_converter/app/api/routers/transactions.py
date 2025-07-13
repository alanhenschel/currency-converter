from fastapi import APIRouter, HTTPException, Depends
from ...domain.services.transaction_service import TransactionService
from ...schemas.transaction import TransactionResponse
from ...api.dependencies import get_transaction_service

router = APIRouter()

@router.get("", response_model=list[TransactionResponse])
async def get_transactions(user_id: int, transaction_service: TransactionService = Depends(get_transaction_service)):
    transactions = transaction_service.get_transactions(user_id)
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this user.")
    return transactions