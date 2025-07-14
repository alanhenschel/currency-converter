# 💸 Currency Converter API

A FastAPI-based currency conversion service that allows conversion between multiple currencies with transaction tracking and comprehensive testing.

## 📑 Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Production Deployment](#production-deployment)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Docker](#docker)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)

## ✨ Features

### Core Functionality
- ✅ Currency conversion between BRL, USD, EUR, JPY
- ✅ Real-time exchange rates from CurrencyAPI.com
- ✅ Transaction persistence with complete audit trail
- ✅ RESTful API endpoints
- ✅ Comprehensive error handling
- ✅ Request/Response validation with Pydantic

### Technical Features
- ✅ Clean Architecture with Domain-Driven Design
- ✅ Structured logging with proper middleware
- ✅ Unit and integration tests (50 tests with 100% pass rate)
- ✅ Database migrations with Alembic
- ✅ Docker containerization
- ✅ Automatic API documentation (Swagger/OpenAPI)
- ✅ Code linting and formatting tools

## 🏗️ Architecture

The project follows **Clean Architecture** principles with clear separation of concerns:

```
currency_converter/
├── app/
│   ├── api/                    # Presentation Layer
│   │   ├── routers/           # API endpoints
│   │   ├── middlewares.py     # Cross-cutting concerns
│   │   └── dependencies.py    # Dependency injection
│   ├── core/                  # Application configuration
│   ├── domain/                # Business Logic Layer
│   │   ├── models/           # Domain entities
│   │   ├── repositories/     # Repository interfaces
│   │   └── services/         # Business services
│   ├── infrastructure/        # Infrastructure Layer
│   │   ├── db/              # Database configuration
│   │   ├── external/        # External API clients
│   │   └── repositories/    # Repository implementations
│   └── schemas/              # Data transfer objects
└── tests/                    # Comprehensive test suite
```

### Design Patterns Used
- **Repository Pattern**: Database abstraction
- **Dependency Injection**: Loose coupling
- **Service Layer**: Business logic encapsulation
- **Factory Pattern**: Database session management

## 📋 Requirements

- Python 3.10+
- Poetry (dependency management)
- PostgreSQL (production) / SQLite (development)
- Docker & Docker Compose (optional)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd currency-converter
```

### 2. Install Dependencies with Poetry
```bash
# Install Poetry if not already installed
curl -sSL https://install.python-poetry.org | python3 -

# Install project dependencies
poetry install

# Activate virtual environment
poetry shell
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
CURRENCY_API_KEY=your_currency_api_key
DATABASE_URL=sqlite:///./test.db
```

### 4. Database Setup
```bash
# Run migrations
alembic -c currency_converter/alembic.ini upgrade head
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Using Poetry
poetry run uvicorn currency_converter.app.main:app --reload --host 0.0.0.0 --port 8000

# Or if already in poetry shell
uvicorn currency_converter.app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
# Using Poetry
poetry run uvicorn currency_converter.app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Or using Gunicorn (install separately)
poetry add gunicorn
poetry run gunicorn currency_converter.app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

The application will be available at: `http://localhost:8000`

## 🚀 Production Deployment

### Environment Variables for Production
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/currency_db"
export CURRENCY_API_KEY="your_production_api_key"
export ENVIRONMENT="production"
```

### Using Systemd (Linux)
Create `/etc/systemd/system/currency-converter.service`:
```ini
[Unit]
Description=Currency Converter API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
WorkingDirectory=/path/to/currency-converter
Environment=PATH=/path/to/currency-converter/.venv/bin
ExecStart=/path/to/currency-converter/.venv/bin/gunicorn currency_converter.app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
ExecReload=/bin/kill -s HUP $MAINPID
Restart=always

[Install]
WantedBy=multi-user.target
```

### Using Docker in Production
```bash
# Build production image
docker build -t currency-converter:prod .

# Run with production database
docker run -d \
  --name currency-converter \
  -p 8000:8000 \
  -e DATABASE_URL="postgresql://user:password@host:5432/db" \
  -e CURRENCY_API_KEY="your_key" \
  currency-converter:prod
```

## 🧪 Testing

### Run All Tests
```bash
# Using Poetry
poetry run pytest

# With coverage report
poetry run pytest --cov=currency_converter --cov-report=html

# Run specific test modules
poetry run pytest currency_converter/tests/api/
poetry run pytest currency_converter/tests/service/
poetry run pytest currency_converter/tests/repository/
```

### Test Categories
- **Unit Tests**: Individual component testing
- **Integration Tests**: API endpoint testing
- **Repository Tests**: Database interaction testing
- **Service Tests**: Business logic testing

### Test Results
- ✅ **50/50 tests passing** (100% success rate)
- Full coverage of API endpoints, services, and repositories
- Mock external dependencies for reliable testing

## 🔍 Code Quality

### Linting and Formatting
```bash
# Format code with Black
poetry run black currency_converter/

# Lint with Ruff
poetry run ruff check currency_converter/

# Type checking with MyPy
poetry run mypy currency_converter/

# All quality checks at once
poetry run black currency_converter/ && poetry run ruff check currency_converter/ && poetry run mypy currency_converter/
```

### Pre-commit Hooks (Optional)
```bash
# Install pre-commit
poetry add --group dev pre-commit

# Install hooks
poetry run pre-commit install

# Run manually
poetry run pre-commit run --all-files
```

## 🐳 Docker

### Development with Docker Compose
```bash
# Start all services (app + PostgreSQL)
docker-compose up --build

# Run in background
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Services Included
- **app**: FastAPI application (port 8000)
- **db**: PostgreSQL database (port 5432)
- **volumes**: Persistent database storage

### Docker Commands
```bash
# Build only the app
docker-compose build app

# Run database migrations
docker-compose exec app alembic -c currency_converter/alembic.ini upgrade head

# Run tests in container
docker-compose exec app pytest

# Access app container shell
docker-compose exec app bash
```

## 📚 API Documentation

### Automatic Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI Schema**: `http://localhost:8000/openapi.json`

### Main Endpoints

#### Currency Conversion
```bash
POST /convert
Content-Type: application/json

{
  "fromCurrency": "USD",
  "toCurrency": "BRL",
  "amount": 100,
  "userId": 123
}
```

#### Transaction History
```bash
GET /transactions?userId=123
```

### Response Format
```json
{
  "transactionId": 42,
  "userId": 123,
  "fromCurrency": "USD",
  "toCurrency": "BRL",
  "fromValue": 100.0,
  "toValue": 525.32,
  "rate": 5.2532,
  "timestamp": "2024-05-19T18:00:00Z"
}
```

## 📁 Project Structure

```
currency-converter/
├── 📄 README.md                    # Portuguese documentation
├── 📄 README_EN.md                 # English documentation
├── 📄 THOUGHTS.md                  # Technical decisions
├── 📄 pyproject.toml               # Dependencies and configuration
├── 📄 docker-compose.yml           # Docker services
├── 📄 Dockerfile                   # Container configuration
├── 📄 alembic.ini                  # Migration configuration
├── 📄 .gitignore                   # Git ignore rules
│
├── 📁 currency_converter/
│   ├── 📁 app/
│   │   ├── 📄 main.py              # FastAPI application
│   │   ├── 📄 exceptions.py        # Custom exceptions
│   │   ├── 📁 api/
│   │   │   ├── 📄 dependencies.py  # Dependency injection
│   │   │   ├── 📄 middlewares.py   # Cross-cutting concerns
│   │   │   └── 📁 routers/
│   │   │       ├── 📄 conversion.py    # Conversion endpoints
│   │   │       └── 📄 transactions.py  # Transaction endpoints
│   │   ├── 📁 core/
│   │   │   ├── 📄 config.py        # Configuration
│   │   │   └── 📄 logging.py       # Logging setup
│   │   ├── 📁 domain/
│   │   │   ├── 📁 models/          # Domain entities
│   │   │   ├── 📁 repositories/    # Repository interfaces
│   │   │   └── 📁 services/        # Business services
│   │   ├── 📁 infrastructure/
│   │   │   ├── 📁 db/              # Database configuration
│   │   │   ├── 📁 external/        # External API clients
│   │   │   └── 📁 repositories/    # Repository implementations
│   │   └── 📁 schemas/             # Pydantic models
│   ├── 📁 alembic/                 # Database migrations
│   └── 📁 tests/                   # Test suite
│       ├── 📁 api/                 # API tests
│       ├── 📁 external/            # External service tests
│       ├── 📁 repository/          # Repository tests
│       └── 📁 service/             # Service tests
```

## 🔧 Development Guidelines

### Code Style
- Follow PEP 8 standards
- Use type hints throughout the codebase
- Maintain test coverage above 90%
- Document complex business logic

### Git Workflow
- Create feature branches from main
- Use conventional commit messages
- Run tests before pushing
- Create descriptive pull requests

### Dependencies
- Use Poetry for dependency management
- Pin major versions in pyproject.toml
- Separate dev dependencies from production
- Update dependencies regularly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using FastAPI, SQLAlchemy, and modern Python practices**
