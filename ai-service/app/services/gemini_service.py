"""
CareerForge AI Service - Gemini Integration Service
===================================================
A reusable, robust service for interacting with Google Gemini models.

Design & Security Standards:
1. Environment-driven: Reads GEMINI_API_KEY exclusively from environment variables / settings.
2. Zero hardcoding: No keys or sensitive secrets exist in code.
3. Structured JSON responses: Native schema enforcement with Pydantic and JSON validation.
4. Timeout handling: Strict, configurable async timeout protection for every call.
5. Robust error handling: Hierarchical custom exceptions with clean error classification.
6. Zero client exposure: Strictly server-side; keys are never sent to React or the browser.
7. Privacy-preserving logging: Logs error types and token metadata without writing sensitive
   student information (resumes, grades, interview transcripts, personal info) to log files.
"""

import os
import json
import re
import time
import asyncio
from typing import Any, Dict, Optional, Type, TypeVar, Union
from pydantic import BaseModel, ValidationError
from google import genai
from google.genai import types
from google.genai import errors as genai_errors

from app.config.settings import settings
from app.utils.logger import logger

T = TypeVar("T", bound=BaseModel)


# ==============================================================================
# Custom Exceptions
# ==============================================================================

class GeminiServiceError(Exception):
    """Base exception for Gemini service errors."""
    pass


class GeminiAPIKeyMissingError(GeminiServiceError):
    """Raised when GEMINI_API_KEY is missing or set to placeholder."""
    pass


class GeminiTimeoutError(GeminiServiceError):
    """Raised when an operation to Gemini exceeds the configured timeout."""
    pass


class GeminiRateLimitError(GeminiServiceError):
    """Raised when the Gemini API rate limit or quota is exceeded."""
    pass


class GeminiResponseParsingError(GeminiServiceError):
    """Raised when a structured JSON response fails schema validation or JSON decoding."""
    pass


class GeminiAPIError(GeminiServiceError):
    """Raised when the upstream Gemini API returns an error."""
    def __init__(self, message: str, status_code: Optional[int] = None):
        super().__init__(message)
        self.status_code = status_code


# ==============================================================================
# Privacy-Preserving Helper
# ==============================================================================

def _sanitize_error_message(error: Any) -> str:
    """
    Sanitize error message to ensure no sensitive student data or full API keys leak into logs.
    """
    raw = str(error)
    # Strip potential API key strings (AIza...)
    sanitized = re.sub(r"AIza[A-Za-z0-9_-]{10,}", "[MASKED_API_KEY]", raw)
    # Truncate if unusually long to avoid dumping prompt reflection from error text
    if len(sanitized) > 250:
        sanitized = sanitized[:250] + " ... [TRUNCATED]"
    return sanitized


# ==============================================================================
# Gemini Service Implementation
# ==============================================================================

class GeminiService:
    """
    Production-ready asynchronous Gemini service.
    """

    def __init__(self, api_key: Optional[str] = None, default_model: Optional[str] = None):
        self._explicit_api_key = api_key
        self._default_model = default_model
        self._client: Optional[genai.Client] = None

    def _resolve_api_key(self) -> Optional[str]:
        """
        Safely resolve API key from constructor argument, environment variables, or settings.
        Never returns placeholder strings.
        """
        key = self._explicit_api_key or os.environ.get("GEMINI_API_KEY") or settings.gemini_api_key
        if not key or key.strip() in ("", "your_gemini_api_key_here", "placeholder"):
            return None
        return key.strip()

    def is_configured(self) -> bool:
        """
        Check if a valid, non-placeholder GEMINI_API_KEY is available.
        """
        return self._resolve_api_key() is not None

    def get_client(self) -> genai.Client:
        """
        Get or initialize the Google GenAI client lazily.
        Raises GeminiAPIKeyMissingError if the key is not set.
        """
        if self._client is None:
            api_key = self._resolve_api_key()
            if not api_key:
                raise GeminiAPIKeyMissingError(
                    "GEMINI_API_KEY is not configured in the environment. "
                    "Please set a valid GEMINI_API_KEY in ai-service/.env."
                )
            try:
                self._client = genai.Client(api_key=api_key)
                logger.info("Google Gemini client initialized successfully.")
            except Exception as e:
                safe_msg = _sanitize_error_message(e)
                logger.error(f"Failed to initialize Gemini client: {safe_msg}")
                raise GeminiServiceError(f"Failed to initialize Gemini client: {safe_msg}") from e
        return self._client

    @property
    def default_model(self) -> str:
        return self._default_model or settings.gemini_model or "gemini-2.5-flash"

    # --------------------------------------------------------------------------
    # Text Generation
    # --------------------------------------------------------------------------

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        timeout: Optional[float] = None
    ) -> str:
        """
        Generate plain text asynchronously using Gemini.

        Args:
            prompt: User or task prompt.
            system_instruction: Optional system instruction/persona.
            model: Model name (defaults to settings.gemini_model).
            temperature: Sampling temperature.
            timeout: Timeout in seconds (defaults to settings.gemini_timeout_seconds).

        Returns:
            Generated text content as a string.
        """
        client = self.get_client()
        target_model = model or self.default_model
        timeout_sec = timeout or settings.gemini_timeout_seconds

        config = types.GenerateContentConfig(
            temperature=temperature,
            system_instruction=system_instruction
        )

        start_time = time.perf_counter()
        try:
            # Execute with timeout handling
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=target_model,
                    contents=prompt,
                    config=config
                ),
                timeout=timeout_sec
            )
            elapsed = time.perf_counter() - start_time
            logger.debug(f"Gemini text generated | model={target_model} | prompt_len={len(prompt)} | elapsed={elapsed:.2f}s")
            return response.text or ""

        except asyncio.TimeoutError:
            # Privacy-safe log: Log metadata only, never student prompt
            logger.error(
                f"Gemini request timed out | model={target_model} | prompt_len={len(prompt)} | timeout={timeout_sec}s"
            )
            raise GeminiTimeoutError(f"Gemini API request timed out after {timeout_sec}s")

        except genai_errors.APIError as e:
            safe_err = _sanitize_error_message(e)
            logger.error(
                f"Gemini APIError | model={target_model} | code={getattr(e, 'code', None)} | error={safe_err}"
            )
            if getattr(e, "code", None) == 429:
                raise GeminiRateLimitError(f"Gemini rate limit exceeded: {safe_err}") from e
            raise GeminiAPIError(f"Gemini API error: {safe_err}", status_code=getattr(e, "code", None)) from e

        except Exception as e:
            if isinstance(e, GeminiServiceError):
                raise
            safe_err = _sanitize_error_message(e)
            logger.error(f"Unexpected Gemini error | model={target_model} | error_type={type(e).__name__} | msg={safe_err}")
            raise GeminiServiceError(f"Gemini invocation failed: {safe_err}") from e

    # --------------------------------------------------------------------------
    # Structured JSON Generation
    # --------------------------------------------------------------------------

    async def generate_structured_json(
        self,
        prompt: str,
        response_schema: Union[Type[T], Dict[str, Any]],
        system_instruction: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.2,
        timeout: Optional[float] = None
    ) -> Union[T, Dict[str, Any]]:
        """
        Generate structured JSON and validate against a Pydantic model or schema.

        Args:
            prompt: User or task prompt.
            response_schema: Pydantic model class or JSON schema dict.
            system_instruction: Optional system instruction.
            model: Model name (defaults to settings.gemini_model).
            temperature: Sampling temperature (default 0.2 for deterministic JSON).
            timeout: Timeout in seconds.

        Returns:
            Instance of response_schema (if Pydantic model) or parsed dict.
        """
        client = self.get_client()
        target_model = model or self.default_model
        timeout_sec = timeout or settings.gemini_timeout_seconds

        # Configure native JSON output with schema enforcement
        config = types.GenerateContentConfig(
            response_mime_type="application/json",
            response_schema=response_schema,
            system_instruction=system_instruction,
            temperature=temperature
        )

        start_time = time.perf_counter()
        try:
            response = await asyncio.wait_for(
                client.aio.models.generate_content(
                    model=target_model,
                    contents=prompt,
                    config=config
                ),
                timeout=timeout_sec
            )
            elapsed = time.perf_counter() - start_time
            raw_text = response.text or "{}"
            logger.debug(f"Gemini JSON generated | model={target_model} | prompt_len={len(prompt)} | elapsed={elapsed:.2f}s")

        except asyncio.TimeoutError:
            logger.error(
                f"Gemini structured request timed out | model={target_model} | prompt_len={len(prompt)} | timeout={timeout_sec}s"
            )
            raise GeminiTimeoutError(f"Gemini API structured request timed out after {timeout_sec}s")

        except genai_errors.APIError as e:
            safe_err = _sanitize_error_message(e)
            logger.error(f"Gemini APIError during structured call | model={target_model} | code={getattr(e, 'code', None)} | error={safe_err}")
            if getattr(e, "code", None) == 429:
                raise GeminiRateLimitError(f"Gemini rate limit exceeded: {safe_err}") from e
            raise GeminiAPIError(f"Gemini API error: {safe_err}", status_code=getattr(e, "code", None)) from e

        except Exception as e:
            if isinstance(e, GeminiServiceError):
                raise
            safe_err = _sanitize_error_message(e)
            logger.error(f"Unexpected error during structured call | model={target_model} | error_type={type(e).__name__} | msg={safe_err}")
            raise GeminiServiceError(f"Gemini invocation failed: {safe_err}") from e

        # Clean and parse response JSON
        cleaned_json = self._clean_json_string(raw_text)

        # Validate against Pydantic model if supplied
        if isinstance(response_schema, type) and issubclass(response_schema, BaseModel):
            try:
                parsed_model = response_schema.model_validate_json(cleaned_json)
                return parsed_model
            except ValidationError as ve:
                logger.error(f"Schema validation error on Gemini JSON output | error_type=ValidationError | field_errors={len(ve.errors())}")
                raise GeminiResponseParsingError(f"Model failed schema validation: {ve}") from ve
            except Exception as e:
                logger.error(f"JSON parsing error on Gemini output | error_type={type(e).__name__}")
                raise GeminiResponseParsingError(f"Failed to parse JSON response: {e}") from e

        # Otherwise parse into a standard dictionary
        try:
            return json.loads(cleaned_json)
        except json.JSONDecodeError as jde:
            logger.error(f"Invalid JSON received from Gemini | pos={jde.pos} | msg={jde.msg}")
            raise GeminiResponseParsingError(f"Invalid JSON received from Gemini: {jde.msg}") from jde

    # --------------------------------------------------------------------------
    # Health & Connectivity Verification
    # --------------------------------------------------------------------------

    async def test_connection(self, model: Optional[str] = None) -> Dict[str, Any]:
        """
        Send a controlled, safe prompt to Gemini to verify connectivity and structured output.
        Returns a sanitized status report with ZERO credential exposure.
        """
        target_model = model or self.default_model

        if not self.is_configured():
            return {
                "success": False,
                "configured": False,
                "model": target_model,
                "error": "GEMINI_API_KEY is not configured or is using default placeholder in ai-service/.env",
                "message": "To enable live Gemini AI capabilities, set your GEMINI_API_KEY in ai-service/.env"
            }

        class TestVerificationPayload(BaseModel):
            status: str
            service: str
            verified: bool
            timestamp: Optional[str] = None

        controlled_prompt = (
            "You are verifying the system connectivity for CareerForge AI Service. "
            "Output a JSON object matching the schema with status='connected', "
            "service='career-forge-ai', and verified=true."
        )

        start_time = time.perf_counter()
        try:
            result: TestVerificationPayload = await self.generate_structured_json(
                prompt=controlled_prompt,
                response_schema=TestVerificationPayload,
                model=target_model,
                temperature=0.0,
                timeout=15.0
            )
            latency_ms = round((time.perf_counter() - start_time) * 1000, 2)
            return {
                "success": True,
                "configured": True,
                "model": target_model,
                "latency_ms": latency_ms,
                "verification": result.model_dump()
            }
        except GeminiServiceError as gse:
            safe_msg = _sanitize_error_message(gse)
            return {
                "success": False,
                "configured": True,
                "model": target_model,
                "error_type": type(gse).__name__,
                "error": safe_msg
            }
        except Exception as e:
            safe_msg = _sanitize_error_message(e)
            return {
                "success": False,
                "configured": True,
                "model": target_model,
                "error_type": type(e).__name__,
                "error": safe_msg
            }

    # --------------------------------------------------------------------------
    # Internal Helpers
    # --------------------------------------------------------------------------

    @staticmethod
    def _clean_json_string(text: str) -> str:
        """
        Strip markdown code fences (```json ... ```) and whitespace.
        """
        cleaned = text.strip()
        if cleaned.startswith("```"):
            # Remove leading ``` or ```json
            cleaned = re.sub(r"^```[a-zA-Z]*\n?", "", cleaned)
            # Remove trailing ```
            cleaned = re.sub(r"\n?```$", "", cleaned)
        return cleaned.strip()


# Reusable singleton instance
gemini_service = GeminiService()
