from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"ping": "pong", "service": "trip-service", "status": "online"}

def test_get_all_trips():
    response = client.get("/trips")
    assert response.status_code == 200
    assert "trips" in response.json()