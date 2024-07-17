from pydantic import EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class EnvConfig(BaseSettings):
    model_config = SettingsConfigDict(env_file="./.env", env_file_encoding="utf-8")
    DJANGO_SECRET_KEY: str
    DJANGO_DEBUG: bool | None = True
    POSTGRES_HOST: str | None = "localhost"
    POSTGRES_PORT: int | None = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DATABASE_NAME: str
    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_HOST_USER: EmailStr
    EMAIL_HOST_PASSWORD: str
    DEFAULT_FROM_EMAIL: str
    EMAIL_USE_TLS: bool | None = True
    REDIS_HOST: str | None = "localhost"
    REDIS_PORT: int | None = 6379


envConfig = EnvConfig()
