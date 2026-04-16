import sys
import os
from fastapi.testclient import TestClient

# dodajemy ścieżkę do ai-service
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../ai-service")))

from main import app

client = TestClient(app)


def test_ping():
    response = client.get("/ping")
    assert response.status_code == 200
    assert response.json()["ping"] == "pong"


def test_get_all_trips():
    response = client.get("/trips")
    assert response.status_code == 200
    assert "trips" in response.json()