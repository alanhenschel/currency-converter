from pydantic import BaseSettings


class Settings(BaseSettings):
    # Application settings
    app_name: str = "Currency Converter"
    app_version: str = "1.0.0"

    # Database settings
    database_url: str

    # External API settings
    currency_api_url: str = "https://app.currencyapi.com/"
    currency_api_key: str

    class Config:
        env_file = ".env"


settings = Settings()
