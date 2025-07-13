from fastapi import Depends
from sqlalchemy.orm import Session

from ..infrastructure.db.session import get_db
from ..domain.repositories.transaction_repository import TransactionRepository
from ..infrastructure.repositories.transaction_repository_impl import TransactionRepositoryImpl
from ..domain.services.conversion_service import ConversionService
from ..domain.services.transaction_service import TransactionService
from ..infrastructure.external.currency_api import CurrencyAPI
from ..core.config import settings

def get_transaction_repository(db: Session = Depends(get_db)) -> TransactionRepository:
    return TransactionRepositoryImpl(db)

def get_currency_api() -> CurrencyAPI:
    return CurrencyAPI(settings.currency_api_key)

def get_conversion_service(
    transaction_repository: TransactionRepository = Depends(get_transaction_repository),
    currency_api: CurrencyAPI = Depends(get_currency_api),
) -> ConversionService:
    return ConversionService(transaction_repository, currency_api)

def get_transaction_service(
    transaction_repository: TransactionRepository = Depends(get_transaction_repository),
) -> TransactionService:
    return TransactionService(transaction_repository)