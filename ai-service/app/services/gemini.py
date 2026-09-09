from typing import Optional
from google import genai
from app.services.gemini_service import gemini_service
from app.utils.logger import logger


def get_gemini_client() -> Optional[genai.Client]:
    """
    Initialize and return the Google Gemini client via GeminiService.
    Returns None if GEMINI_API_KEY is not configured.
    """
    try:
        return gemini_service.get_client()
    except Exception as e:
        logger.warning(f"Google Gemini client not initialized: {e}")
        return None
