from fastapi import APIRouter, HTTPException, Depends
from ...schemas.conversion import ConversionRequest, ConversionResponse
from ...domain.services.conversion_service import ConversionService
from ...api.dependencies import get_conversion_service

router = APIRouter()

@router.post("", response_model=None)
async def convert_currency(
    conversion_request: ConversionRequest,
    conversion_service: ConversionService = Depends(get_conversion_service)
):
    try:
        conversion_service.convert(conversion_request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")