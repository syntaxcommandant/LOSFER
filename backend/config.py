from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database (Defaults to SQLite for fast local setup, supports PostgreSQL/pgvector via ENV)
    DATABASE_URL: str = "sqlite:///./losefer.db"

    # Security & Auth
    SECRET_KEY: str = "DYNAMIC_SECRET_KEY_MUST_BE_PROVIDED_IN_ENV"
    ALGORITHM: str = "HS256"

    # Match Engine Thresholds & Integration Settings
    MATCH_SCORE_THRESHOLD: float = 50.0  # Percentage threshold to mark high confidence
    MEMBER_C_AI_SERVICE_URL: str = "http://localhost:8000/internal-ai-match"

    # Notification Config
    ENABLE_MATCH_NOTIFICATIONS: bool = True

    class Config:
        env_file = ".env"

settings = Settings()