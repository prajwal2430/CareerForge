"""
Test Suite: Gemini Integration Service
======================================
Tests:
1. API Key reading and missing/placeholder validation.
2. Structured JSON response generation and Pydantic parsing.
3. Timeout handling.
4. Error handling and classification.
5. Privacy-preserving logging (verifies that sensitive student data is never logged).
6. Security checks: zero exposure of API key in response or logs.
7. Controlled connectivity test function.
"""

import sys
import os
import io
import logging
import asyncio
from unittest.mock import AsyncMock, patch, MagicMock
from pydantic import BaseModel, Field
from typing import List, Optional

# Ensure app is in path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.services.gemini_service import (
    GeminiService,
    GeminiServiceError,
    GeminiAPIKeyMissingError,
    GeminiTimeoutError,
    GeminiRateLimitError,
    GeminiResponseParsingError,
    _sanitize_error_message,
)
from app.config.settings import settings


class CareerSkillRecommendation(BaseModel):
    career_role: str
    recommended_skills: List[str]
    confidence_score: float


async def test_api_key_loading():
    print("\n--- Test 1: API Key Reading & Placeholder Protection ---")
    
    # 1. Test placeholder rejected
    with patch.dict(os.environ, {"GEMINI_API_KEY": "your_gemini_api_key_here"}):
        svc = GeminiService()
        assert not svc.is_configured(), "Placeholder API key should NOT be considered configured"
        try:
            svc.get_client()
            assert False, "Should have raised GeminiAPIKeyMissingError"
        except GeminiAPIKeyMissingError:
            print("[OK] Placeholder API key correctly rejected with GeminiAPIKeyMissingError")

    # 2. Test empty key rejected
    with patch.dict(os.environ, {"GEMINI_API_KEY": ""}):
        svc = GeminiService()
        assert not svc.is_configured(), "Empty API key should NOT be considered configured"
        print("[OK] Empty API key correctly rejected")

    # 3. Test valid non-placeholder recognized
    dummy_key = "AIzaSy_TEST_KEY_DUMMY_1234567890abcdef"
    with patch.dict(os.environ, {"GEMINI_API_KEY": dummy_key}):
        svc = GeminiService()
        assert svc.is_configured(), "Valid format API key should be recognized as configured"
        assert svc._resolve_api_key() == dummy_key
        print("[OK] Valid environment API key correctly resolved")


async def test_privacy_preserving_logging():
    print("\n--- Test 2: Privacy-Preserving Error Logging ---")
    
    # Simulate an error with sensitive student data in prompt and a fake API key
    dummy_key = "AIzaSyABCDEFGHIJKLMNOPQRSTUVWXYZ12345"
    sensitive_student_prompt = (
        "Student: John Doe, Email: john.doe@university.edu, GPA: 3.9, "
        "Resume: Developed secure fintech backend in Java, Weakness: Dynamic Programming"
    )
    
    # Capture log output
    log_stream = io.StringIO()
    handler = logging.StreamHandler(log_stream)
    from app.utils.logger import logger
    logger.addHandler(handler)
    
    try:
        # Create service with dummy key
        svc = GeminiService(api_key=dummy_key)
        
        # Mock client to raise an exception
        mock_client = MagicMock()
        mock_client.aio.models.generate_content = AsyncMock(
            side_effect=RuntimeError(f"Simulated upstream error for {dummy_key}")
        )
        svc._client = mock_client
        
        try:
            await svc.generate_text(prompt=sensitive_student_prompt, timeout=5.0)
        except GeminiServiceError:
            pass

        log_output = log_stream.getvalue()
        
        # Verify student sensitive info is NOT in logs
        assert "john.doe@university.edu" not in log_output, "Student email leaked to logs!"
        assert "John Doe" not in log_output, "Student name leaked to logs!"
        assert "Dynamic Programming" not in log_output, "Student weakness leaked to logs!"
        assert dummy_key not in log_output, "API key leaked to logs!"
        assert "[MASKED_API_KEY]" in log_output or "AIzaSy" not in log_output, "API key should be masked"

        print("[OK] Zero sensitive student data or API keys present in log output")
    finally:
        logger.removeHandler(handler)


async def test_timeout_handling():
    print("\n--- Test 3: Strict Timeout Handling ---")
    
    svc = GeminiService(api_key="AIzaSyDummyTestKeyForTesting12345")
    
    # Mock client with long delay
    async def delayed_generate(*args, **kwargs):
        await asyncio.sleep(2.0)
        return MagicMock(text="Finished")

    mock_client = MagicMock()
    mock_client.aio.models.generate_content = delayed_generate
    svc._client = mock_client

    try:
        # Request with a 0.2 second timeout
        await svc.generate_text("Test prompt", timeout=0.2)
        assert False, "Should have raised GeminiTimeoutError"
    except GeminiTimeoutError as te:
        print(f"[OK] Successfully caught GeminiTimeoutError: {te}")


async def test_structured_json_parsing():
    print("\n--- Test 4: Structured JSON Generation & Schema Validation ---")
    
    svc = GeminiService(api_key="AIzaSyDummyTestKeyForTesting12345")
    
    # 1. Test valid JSON returned with markdown code fence (common in LLM output)
    mock_llm_json = """```json
{
  "career_role": "Full Stack Engineer",
  "recommended_skills": ["Node.js", "React", "Docker", "FastAPI"],
  "confidence_score": 0.94
}
```"""
    
    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(
        return_value=MagicMock(text=mock_llm_json)
    )
    svc._client = mock_client

    result = await svc.generate_structured_json(
        prompt="Recommend skills for full stack role",
        response_schema=CareerSkillRecommendation
    )

    assert isinstance(result, CareerSkillRecommendation), "Output should be an instance of CareerSkillRecommendation"
    assert result.career_role == "Full Stack Engineer"
    assert len(result.recommended_skills) == 4
    assert result.confidence_score == 0.94
    print("[OK] Structured Pydantic validation successful (with markdown strip)")

    # 2. Test invalid schema raises GeminiResponseParsingError
    invalid_llm_json = '{"wrong_key": 123}'
    mock_client.aio.models.generate_content = AsyncMock(
        return_value=MagicMock(text=invalid_llm_json)
    )
    try:
        await svc.generate_structured_json(
            prompt="Test",
            response_schema=CareerSkillRecommendation
        )
        assert False, "Should have raised GeminiResponseParsingError"
    except GeminiResponseParsingError:
        print("[OK] Invalid schema accurately raises GeminiResponseParsingError")


async def test_controlled_connectivity_function():
    print("\n--- Test 5: Controlled Connectivity Test Function ---")
    
    # 1. Unconfigured state
    with patch.dict(os.environ, {"GEMINI_API_KEY": ""}):
        svc = GeminiService()
        status_report = await svc.test_connection()
        assert not status_report["success"], "Unconfigured test must report success=False"
        assert not status_report["configured"]
        print("[OK] Unconfigured service status report verified")

    # 2. Configured state (mocked response)
    mock_response = MagicMock(
        text='{"status": "connected", "service": "career-forge-ai", "verified": true}'
    )
    svc = GeminiService(api_key="AIzaSyDummyTestKeyForTesting12345")
    mock_client = MagicMock()
    mock_client.aio.models.generate_content = AsyncMock(return_value=mock_response)
    svc._client = mock_client

    status_report = await svc.test_connection()
    assert status_report["success"] is True
    assert status_report["verification"]["status"] == "connected"
    assert status_report["verification"]["verified"] is True
    print("[OK] Configured service verification report successfully verified")


async def main():
    print("=========================================================")
    print("Running Gemini Service Verification Suite")
    print("=========================================================")
    await test_api_key_loading()
    await test_privacy_preserving_logging()
    await test_timeout_handling()
    await test_structured_json_parsing()
    await test_controlled_connectivity_function()
    print("\n=========================================================")
    print("ALL GEMINI SERVICE TESTS PASSED SUCCESSFULLY!")
    print("=========================================================")


if __name__ == "__main__":
    asyncio.run(main())
