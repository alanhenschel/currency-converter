from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.api.routers.transactions import router as transactions_router
from app.domain.models.transaction import Transaction
from app.domain.repositories.transaction_repository import TransactionRepository

app = FastAPI()
app.include_router(transactions_router)

client = TestClient(app)

def test_get_transactions():
    response = client.get("/transactions?userId=123")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_transactions_empty():
    response = client.get("/transactions?userId=999")
    assert response.status_code == 200
    assert response.json() == []

def test_create_transaction():
    transaction_data = {
        "userId": 123,
        "fromCurrency": "USD",
        "toCurrency": "BRL",
        "fromValue": 100,
        "toValue": 525.32,
        "rate": 5.2532,
        "timestamp": "2024-05-19T18:00:00Z"
    }
    response = client.post("/transactions", json=transaction_data)
    assert response.status_code == 201
    assert response.json()["userId"] == transaction_data["userId"]

def test_create_transaction_invalid():
    transaction_data = {
        "userId": 123,
        "fromCurrency": "INVALID",
        "toCurrency": "BRL",
        "fromValue": "invalid_value",
        "toValue": 525.32,
        "rate": 5.2532,
        "timestamp": "2024-05-19T18:00:00Z"
    }
    response = client.post("/transactions", json=transaction_data)
    assert response.status_code == 422  # Unprocessable Entity for validation errors