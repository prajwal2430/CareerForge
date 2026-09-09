"""
Re-export gemini_service from app.services.gemini_service
for flexible root-level and app-level imports.
"""

from app.services.gemini_service import (
    GeminiService,
    GeminiServiceError,
    GeminiAPIKeyMissingError,
    GeminiTimeoutError,
    GeminiRateLimitError,
    GeminiResponseParsingError,
    GeminiAPIError,
    gemini_service,
)

__all__ = [
    "GeminiService",
    "GeminiServiceError",
    "GeminiAPIKeyMissingError",
    "GeminiTimeoutError",
    "GeminiRateLimitError",
    "GeminiResponseParsingError",
    "GeminiAPIError",
    "gemini_service",
]
