from fastapi import FastAPI
from .api.routers import conversion, transactions
from .api.middlewares import add_middleware
from .core.config import settings

app = FastAPI(title="Currency Converter API", version="1.0")

app.include_router(conversion.router, prefix="/api/v1/conversion", tags=["Conversion"])
app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["Transactions"])

add_middleware(app)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Currency Converter API!"}