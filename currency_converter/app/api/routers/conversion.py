from loguru import logger
from fastapi import APIRouter, HTTPException, Depends

from currency_converter.app.exceptions import (
    ConversionErrorException,
    CurrencyConverterException,
    CurrencyNotFoundException,
    ValidationServiceException,
)
from ...schemas.conversion import ConversionRequest, ConversionResponse
from ...domain.services.conversion_service import ConversionService
from ...api.dependencies import get_conversion_service

router = APIRouter()


@router.post("", response_model=ConversionResponse)
async def convert_currency(
    conversion_request: ConversionRequest,
    conversion_service: ConversionService = Depends(get_conversion_service),
):
    try:
        transaction = conversion_service.convert(conversion_request)
        response = ConversionResponse(
            transaction_id=transaction.transaction_id,
            from_currency=transaction.from_currency,
            to_currency=transaction.to_currency,
            from_value=transaction.from_value,
            to_value=transaction.to_value,
            rate=transaction.rate,
            timestamp=transaction.timestamp,
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except CurrencyNotFoundException as e:
        logger.error(f"Currency not found: {str(e)}")
        raise HTTPException(status_code=404, detail=str(e))
    except ConversionErrorException as e:
        print(e)
        logger.error(f"Conversion error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except ValidationServiceException as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except CurrencyConverterException as e:
        logger.error(f"Currency converter error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        logger.exception(f"Unexpected error during conversion: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
