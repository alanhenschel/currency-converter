FROM python:3.10-slim

WORKDIR app

# Instalar curl para health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install poetry && poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi

COPY . .

ENV PYTHONUNBUFFERED=1

CMD ["uvicorn", "currency_converter.app.main:app", "--host", "0.0.0.0", "--port", "8000"]