from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_watchlist_api_seed_and_list():
    seed_response = client.post("/api/watchlists/seed")

    assert seed_response.status_code == 200

    list_response = client.get("/api/watchlists")

    assert list_response.status_code == 200
    assert "watchlists" in list_response.json()


def test_watchlist_api_create_add_remove_delete():
    create_response = client.post(
        "/api/watchlists",
        json={"name": "UnitTest", "symbols": [], "description": ""},
    )

    assert create_response.status_code == 200

    add_response = client.post(
        "/api/watchlists/UnitTest/symbols",
        json={"symbol": "AAPL"},
    )

    assert add_response.status_code == 200
    assert "AAPL" in add_response.json()["symbols"]

    remove_response = client.delete("/api/watchlists/UnitTest/symbols/AAPL")

    assert remove_response.status_code == 200
    assert "AAPL" not in remove_response.json()["symbols"]

    delete_response = client.delete("/api/watchlists/UnitTest")

    assert delete_response.status_code == 200
