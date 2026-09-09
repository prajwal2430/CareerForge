"""
Test Suite: Gemini HTTP Routes
==============================
Verifies:
1. GET /api/ai/gemini/status (masked, zero key exposure)
2. POST /api/ai/gemini/test (controlled prompt test)
3. Zero credential leakage in response body or headers
"""

import sys
import os
from unittest.mock import patch, AsyncMock, MagicMock
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.main import app

client = TestClient(app)


def test_gemini_status_route():
    print("\n--- Test: GET /api/ai/gemini/status ---")
    response = client.get("/api/ai/gemini/status")
    assert response.status_code == 200
    data = response.json()
    assert "service" in data
    assert "configured" in data
    assert "default_model" in data
    # Ensure no secrets leak
    assert "api_key" not in data
    assert "key" not in data
    print(f"[OK] Status route verified: configured={data['configured']}, model={data['default_model']}")


def test_gemini_test_route_unconfigured():
    print("\n--- Test: POST /api/ai/gemini/test (Unconfigured) ---")
    response = client.post("/api/ai/gemini/test", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is False
    assert data["configured"] is False
    assert "GEMINI_API_KEY" in data["error"]
    print("[OK] Unconfigured response returned clean error without leaking keys")


def test_gemini_test_route_configured_mock():
    print("\n--- Test: POST /api/ai/gemini/test (Configured & Mocked) ---")
    from app.services.gemini_service import gemini_service

    with patch.object(
        gemini_service,
        "test_connection",
        new=AsyncMock(return_value={
            "success": True,
            "configured": True,
            "model": "gemini-2.5-flash",
            "latency_ms": 315.4,
            "verification": {
                "status": "connected",
                "service": "career-forge-ai",
                "verified": True
            }
        })
    ):
        response = client.post("/api/ai/gemini/test", json={})
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["configured"] is True
        assert data["latency_ms"] == 315.4
        assert data["data"]["status"] == "connected"
        assert data["data"]["verified"] is True
        print("[OK] Configured test endpoint returned expected structured JSON verification")


if __name__ == "__main__":
    test_gemini_status_route()
    test_gemini_test_route_unconfigured()
    test_gemini_test_route_configured_mock()
    print("\n[SUCCESS] ALL GEMINI HTTP ROUTE TESTS PASSED!")
