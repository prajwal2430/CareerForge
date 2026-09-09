import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    """
    Application Settings loaded safely from environment variables and .env file.
    """
    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    port: int = Field(default=8000, alias="PORT")
    environment: str = Field(default="development", alias="ENVIRONMENT")
    log_level: str = Field(default="info", alias="LOG_LEVEL")

    service_name: str = Field(default="career-forge-ai", alias="SERVICE_NAME")

    # Google Gemini API
    gemini_api_key: str = Field(default="your_gemini_api_key_here", alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="gemini-2.5-flash", alias="GEMINI_MODEL")
    gemini_timeout_seconds: float = Field(default=30.0, alias="GEMINI_TIMEOUT_SECONDS")

    # MongoDB Configuration
    mongo_uri: str = Field(default="mongodb://localhost:27017/learnhub", alias="MONGO_URI")
    mongo_db_name: str = Field(default="learnhub", alias="MONGO_DB_NAME")

    # CORS Configuration (comma-separated origins)
    allowed_origins: str = Field(
        default="http://localhost:3000,http://localhost:5000,http://localhost:5002,http://localhost:5173",
        alias="ALLOWED_ORIGINS"
    )

    def get_allowed_origins(self) -> list[str]:
        """
        Parse comma-separated origins into a clean list of allowed URLs.
        """
        if self.environment == "development" and (not self.allowed_origins or self.allowed_origins.strip() == "*"):
            return ["*"]
        origins = [o.strip() for o in self.allowed_origins.split(",") if o.strip()]
        return origins or ["http://localhost:3000", "http://localhost:5000", "http://localhost:5002"]


settings = Settings()

