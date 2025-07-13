from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_conversion_success():
    response = client.post("/convert", json={
        "from_currency": "USD",
        "to_currency": "BRL",
        "amount": 100
    })
    assert response.status_code == 200
    data = response.json()
    assert "converted_amount" in data
    assert "exchange_rate" in data

def test_conversion_invalid_currency():
    response = client.post("/convert", json={
        "from_currency": "INVALID",
        "to_currency": "BRL",
        "amount": 100
    })
    assert response.status_code == 400
    assert response.json() == {"detail": "Invalid currency code"}

def test_conversion_negative_amount():
    response = client.post("/convert", json={
        "from_currency": "USD",
        "to_currency": "BRL",
        "amount": -100
    })
    assert response.status_code == 400
    assert response.json() == {"detail": "Amount must be greater than zero"}