import os
# from pydantic_settings import BaseSettings

class Settings:
    PROJECT_NAME: str = "Pizza Delivery API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv(
        "PIZZA_DATABASE_URL", 
        "postgresql://postgres:949474@localhost:5432/MyPizzaApp?sslmode=prefer&connect_timeout=10"
    )
    CORS_ORIGINS: list = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
    ).split(",")
    CORS_ALLOW_REGEX: str = os.getenv(
        "CORS_ALLOW_REGEX",
        r"https://.*\.ngrok(-free)?\.(app|dev)"
    )

settings = Settings()
