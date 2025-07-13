from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
import logging

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        logging.info(f"Request: {request.method} {request.url}")
        response: Response = await call_next(request)
        logging.info(f"Response: {response.status_code}")
        return response

class ExceptionHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        try:
            response: Response = await call_next(request)
            return response
        except Exception as e:
            logging.error(f"An error occurred: {str(e)}")
            return Response(content="Internal Server Error", status_code=500)
        
def add_middleware(app):
    app.add_middleware(LoggingMiddleware)
    app.add_middleware(ExceptionHandlingMiddleware)