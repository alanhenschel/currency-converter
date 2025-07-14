
from loguru import logger
from fastapi import APIRouter, HTTPException, Depends

from currency_converter.app.exceptions import TransactionNotFoundException, TransactionServiceException, ServiceException
from ...domain.services.transaction_service import TransactionService
from ...schemas.transaction import TransactionResponse
from ...api.dependencies import get_transaction_service

router = APIRouter()

@router.get("/", response_model=list[TransactionResponse])
async def get_transactions(userId: int, transaction_service: TransactionService = Depends(get_transaction_service)):
    try:
        transactions = transaction_service.get_transactions(userId)
        return transactions  # Retorna lista vazia se não houver transações
    except TransactionNotFoundException as e:
        logger.error(f"Transaction not found: {e}")
        raise HTTPException(status_code=404, detail=str(e))
    except TransactionServiceException as e:
        logger.error(f"Transaction service error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except ServiceException as e:
        logger.error(f"Service error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.exception(f"Unexpected error during transaction retrieval: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")