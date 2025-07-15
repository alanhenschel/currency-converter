# 💸 Currency Converter

A complete currency conversion application with FastAPI backend and React TypeScript frontend, featuring automated CI/CD pipeline and AWS deployment.

## 📋 Requirements

### System Requirements
- **Docker**: Version 20.10+ (with Docker Compose support)
- **Git**: For cloning the repository
- **Operating System**: Linux, macOS, or Windows with WSL2

### Quick Setup (Recommended)
The easiest way to run the application is using the included `deploy.sh` script which handles all dependencies automatically through Docker containers.

### Manual Setup Requirements
If you prefer to run components manually without Docker:

#### Backend Requirements
- **Python**: 3.10 or higher
- **Poetry**: Python dependency manager
- **PostgreSQL**: 15+ (or use Docker container)

#### Frontend Requirements
- **Node.js**: 18+ with npm
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

#### Development Tools (Optional)
- **VS Code**: Recommended IDE with Python and TypeScript extensions
- **Postman**: For API testing (alternative to built-in Swagger UI)
- **Git**: Version control

### External Services
- **Currency API**: Free API key from [ExchangeRate-API](https://exchangerate-api.com/) or [CurrencyAPI](https://currencyapi.com/)
- **AWS Account**: (Optional) For production deployment with ECR and EC2

### Hardware Recommendations
- **Development**: 4GB RAM, 2GB free disk space
- **Production**: 8GB RAM, 20GB disk space (for AWS EC2 t3.medium)

## 📑 Table of Contents
- [Requirements](#-requirements)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Development Setup](#-development-setup)
- [Testing](#-testing)
- [Production Deployment](#-production-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Monitoring & Troubleshooting](#-monitoring--troubleshooting)

## 🏗️ Architecture

### Full Stack Application
- **Backend**: FastAPI with Python 3.10+ (Clean Architecture + DDD)
- **Frontend**: React 18 with TypeScript (Clean Architecture)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Deployment**: Docker containers on AWS EC2
- **CI/CD**: GitHub Actions with automated testing and deployment

### Backend Architecture (FastAPI + Python)
- **Framework**: FastAPI with automatic OpenAPI documentation
- **Database**: PostgreSQL with SQLAlchemy and Alembic migrations
- **Testing**: Pytest with comprehensive coverage
- **Code Quality**: Ruff (linting), Black (formatting), MyPy (type checking)
- **External API**: Real-time exchange rates from ExchangeRate-API

### Frontend Architecture (React + TypeScript)
- **Framework**: React 18 with TypeScript and strict type checking
- **Styling**: TailwindCSS for responsive design
- **HTTP Client**: Axios for API communication
- **Testing**: Jest + React Testing Library + Cypress E2E
- **Architecture**: Clean Architecture with dependency injection

## 🚀 Quick Start

### Using Deploy Script (Easiest)

The project includes an automated deploy script that handles the entire setup process:

```bash
# Clone the repository
git clone https://github.com/alanhenschel/currency-converter.git
cd currency-converter

# Make the deploy script executable and run it
chmod +x deploy.sh
./deploy.sh
```

The deploy script will automatically:
- ✅ Detect the correct Docker Compose command
- ✅ Check if Docker is running
- ✅ Create `.env` file from template if needed
- ✅ Build both backend and frontend Docker images
- ✅ Start all services with health checks
- ✅ Verify that all services are running correctly
- ✅ Display access URLs and useful commands

**What the script does:**
1. **Environment Setup**: Copies `.env.example` to `.env` if not exists
2. **Docker Images**: Builds fresh images for backend and frontend
3. **Service Management**: Stops old containers and starts new ones
4. **Health Verification**: Checks backend (`/health`) and frontend endpoints
5. **Status Report**: Shows service status and access information

### Using Docker (Manual)

If you prefer to run Docker commands manually:

```bash
# Clone the repository
git clone https://github.com/alanhenschel/currency-converter.git
cd currency-converter

# Start all services with Docker Compose
docker-compose up -d

# Wait for services to be ready (about 30-60 seconds)
# Then access the applications:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### Manual Setup

#### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 15+
- Poetry (Python dependency management)

#### Backend Setup
```bash
# Install Poetry if not installed
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies
poetry install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API credentials

# Start PostgreSQL (using Docker)
docker run -d --name postgres-dev \
  -p 5432:5432 \
  -e POSTGRES_DB=currency_converter \
  -e POSTGRES_USER=currency_user \
  -e POSTGRES_PASSWORD=currency_pass \
  postgres:15

# Run database migrations
poetry run alembic -c currency_converter/alembic.ini upgrade head

# Start the backend server
poetry run uvicorn currency_converter.app.main:app --reload
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your backend API URL

# Start the development server
npm start
```

## 💻 Development Setup

### Backend Development

#### Code Quality Tools
```bash
# Linting with Ruff
poetry run ruff check currency_converter/

# Code formatting with Black
poetry run black currency_converter/

# Type checking with MyPy
poetry run mypy currency_converter/

# Run all quality checks
poetry run ruff check currency_converter/ && \
poetry run black --check currency_converter/ && \
poetry run mypy currency_converter/
```

#### Database Operations
```bash
# Create new migration
poetry run alembic -c currency_converter/alembic.ini revision --autogenerate -m "description"

# Apply migrations
poetry run alembic -c currency_converter/alembic.ini upgrade head

# Rollback migration
poetry run alembic -c currency_converter/alembic.ini downgrade -1
```

### Frontend Development

```bash
cd frontend

# Start development server with hot reload
npm start

# Build production bundle
npm run build

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Type checking
npm run type-check
```

## 🧪 Testing

### Backend Testing

```bash
# Run all tests
poetry run pytest

# Run tests with coverage report
poetry run pytest --cov=currency_converter --cov-report=html --cov-report=term

# Run specific test categories
poetry run pytest currency_converter/tests/api/          # API tests
poetry run pytest currency_converter/tests/service/     # Service tests
poetry run pytest currency_converter/tests/repository/  # Repository tests

# Run tests with verbose output
poetry run pytest -v

# Run tests and stop on first failure
poetry run pytest -x
```

### Frontend Testing

```bash
cd frontend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (no watch)
npm run test:ci

# Run E2E tests with Cypress
npm run cypress:run

# Open Cypress test runner UI
npm run cypress:open

# Run specific test file
npm test -- ConversionForm.test.tsx
```

### Test Coverage Goals
- **Backend**: >90% coverage across all modules
- **Frontend**: >50% coverage with critical paths covered
- **E2E**: Core user journeys tested with Cypress

## 🚀 Production Deployment

### Local Development Deployment

For local development and testing, use the included deploy script:

```bash
# Run the automated deployment script
./deploy.sh

# The script will:
# 1. Check Docker availability
# 2. Setup environment variables
# 3. Build and start all services
# 4. Perform health checks
# 5. Display access information

# Monitor services
docker-compose logs -f

# Stop services when done
docker-compose down
```

**Deploy Script Features:**
- **Automatic Detection**: Finds the correct `docker-compose` or `docker compose` command
- **Environment Setup**: Creates `.env` from template if missing
- **Health Monitoring**: Verifies all services are running properly
- **Error Handling**: Displays logs if services fail to start
- **User Guidance**: Shows access URLs and management commands

### Automated Deployment (Recommended)

The application uses GitHub Actions for automated CI/CD deployment to AWS EC2.

#### Prerequisites
1. **AWS Account** with ECR and EC2 access
2. **EC2 Instance** (t3.medium or larger recommended)
3. **GitHub Secrets** configured (see configuration section)

#### Setup Steps

1. **Create ECR Repositories**
```bash
# Backend repository
aws ecr create-repository \
    --repository-name currency-converter-backend \
    --region us-east-1

# Frontend repository
aws ecr create-repository \
    --repository-name currency-converter-frontend \
    --region us-east-1
```

2. **Launch EC2 Instance**
   - Instance Type: t3.medium or larger
   - AMI: Ubuntu 22.04 LTS
   - Storage: 20GB+ EBS volume
   - Security Group: Allow ports 22, 80, 8000

3. **Configure GitHub Secrets**
   Add these secrets in GitHub repository settings:
```
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
EC2_HOST=your.ec2.public.ip.address
EC2_USERNAME=ubuntu
EC2_SSH_KEY=your_complete_private_key_content
EC2_PUBLIC_IP=your.ec2.public.ip.address
POSTGRES_USER=currency_user
POSTGRES_PASSWORD=your_secure_database_password
POSTGRES_DB=currency_converter
CURRENCY_API_KEY=your_currency_api_key
CURRENCY_API_URL=https://api.exchangerate-api.com/v4/latest
```

4. **Deploy**
   Simply push to the `main` branch to trigger automatic deployment!

### Manual Deployment

```bash
# Build and push images to ECR
aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin YOUR_ECR_REGISTRY

# Build images
docker build -t YOUR_ECR_REGISTRY/currency-converter-backend:latest .
docker build -t YOUR_ECR_REGISTRY/currency-converter-frontend:latest ./frontend

# Push images
docker push YOUR_ECR_REGISTRY/currency-converter-backend:latest
docker push YOUR_ECR_REGISTRY/currency-converter-frontend:latest

# Deploy on EC2
docker-compose -f docker-compose.prod.yml up -d
```

## 🔄 CI/CD Pipeline

The GitHub Actions pipeline provides automated testing and deployment:

### Pipeline Structure

1. **Backend Testing** (`test-backend`)
   - Environment: Ubuntu with PostgreSQL service
   - Python 3.10 + Poetry dependency management
   - Database migrations with Alembic
   - Code quality: Ruff (linting), Black (formatting), MyPy (types)
   - Comprehensive test suite with coverage reporting

2. **Frontend Testing** (`test-frontend`)
   - Environment: Ubuntu with Node.js 18
   - React + TypeScript with strict type checking
   - ESLint for code quality enforcement
   - Jest unit tests with coverage reporting
   - Production build verification

3. **Build and Deploy** (`build-and-deploy`)
   - Triggers: Only on successful tests AND push to main branch
   - Docker image building for both backend and frontend
   - Push to Amazon ECR repositories
   - Automated deployment to EC2 with SSH
   - Health checks and verification
   - Automatic cleanup of old images

### Pipeline Features
- ✅ **Parallel Testing**: Backend and frontend tests run simultaneously
- ✅ **Quality Gates**: Deployment only on successful tests
- ✅ **Zero Downtime**: Rolling updates with health checks
- ✅ **Automatic Rollback**: Failed deployments are detected
- ✅ **Resource Cleanup**: Old Docker images automatically removed

### Monitoring Pipeline
- **GitHub Actions**: View real-time pipeline status and logs
- **Health Checks**: Automated verification of deployment success
- **Notifications**: Built-in success/failure notifications

## 📚 API Documentation

### Endpoints

#### Currency Conversion
```bash
# Convert currency
POST /api/v1/conversions/
Content-Type: application/json

{
  "from_currency": "USD",
  "to_currency": "BRL", 
  "amount": 100,
  "user_id": 1
}

# Response
{
  "transaction_id": 123,
  "user_id": 1,
  "from_currency": "USD",
  "to_currency": "BRL",
  "from_value": 100.0,
  "to_value": 520.50,
  "rate": 5.205,
  "timestamp": "2025-07-15T10:30:00Z"
}
```

#### Transaction History
```bash
# Get user transactions
GET /api/v1/transactions/?userId=1

```

#### Health Check
```bash
# System health
GET /health

# Response
{
  "status": "healthy",
  "timestamp": "2025-07-15T10:30:00Z",
  "version": "1.0.0"
}
```

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

## 📁 Project Structure

```
currency-converter/
├── 📁 currency_converter/              # Backend (Python/FastAPI)
│   ├── 📁 app/                        # Application layer
│   │   ├── 📁 api/                    # API routes and controllers
│   │   │   ├── 📁 routers/            # Route definitions
│   │   │   ├── dependencies.py        # Dependency injection
│   │   │   └── middlewares.py         # Request/response middleware
│   │   ├── 📁 core/                   # Core configuration
│   │   │   ├── config.py              # Application settings
│   │   │   └── logging.py             # Logging configuration
│   │   └── main.py                    # FastAPI application entry
│   ├── 📁 domain/                     # Domain layer (business logic)
│   │   ├── 📁 models/                 # Domain entities
│   │   ├── 📁 repositories/           # Repository interfaces
│   │   └── 📁 services/               # Domain services
│   ├── 📁 infrastructure/             # Infrastructure layer
│   │   ├── 📁 db/                     # Database configuration
│   │   ├── 📁 external/               # External API clients
│   │   └── 📁 repositories/           # Repository implementations
│   ├── 📁 schemas/                    # Pydantic models
│   ├── 📁 tests/                      # Test suite
│   └── 📁 alembic/                    # Database migrations
├── 📁 frontend/                       # Frontend (React/TypeScript)
│   ├── 📁 src/
│   │   ├── 📁 application/            # Use cases
│   │   │   └── 📁 usecases/           # Application use cases
│   │   ├── 📁 domain/                 # Domain entities and services
│   │   │   ├── 📁 entities/           # Domain entities
│   │   │   └── 📁 services/           # Domain services
│   │   ├── 📁 infrastructure/         # Infrastructure layer
│   │   │   ├── 📁 api/                # HTTP client
│   │   │   └── 📁 repositories/       # API repositories
│   │   ├── 📁 presentation/           # Presentation layer
│   │   │   ├── 📁 components/         # React components
│   │   │   ├── 📁 pages/              # Page components
│   │   │   └── 📁 hooks/              # Custom React hooks
│   │   └── 📁 shared/                 # Shared utilities
│   │       ├── 📁 types/              # TypeScript type definitions
│   │       ├── 📁 utils/              # Utility functions
│   │       └── 📁 container/          # Dependency injection
│   ├── 📁 cypress/                    # E2E tests
│   └── 📁 __tests__/                  # Unit tests
├── 📁 .github/
│   └── 📁 workflows/
│       └── main.yml                   # CI/CD pipeline
├── docker-compose.yml                 # Development environment
├── docker-compose.prod.yml            # Production environment
├── Dockerfile                         # Backend container
├── pyproject.toml                     # Python dependencies
└── README.md                          # This file
```

## ⚙️ Configuration

### Environment Variables

#### Backend Configuration
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/currency_converter

# External API
CURRENCY_API_KEY=your_currency_api_key
CURRENCY_API_URL=https://api.exchangerate-api.com/v4/latest

# Application
ENVIRONMENT=development|production
LOG_LEVEL=DEBUG|INFO|WARNING|ERROR
```

#### Frontend Configuration
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Build Configuration
GENERATE_SOURCEMAP=false  # Production builds
```

### Supported Currencies
- **USD** - US Dollar
- **EUR** - Euro
- **BRL** - Brazilian Real
- **JPY** - Japanese Yen

### Configuration Files
- **Backend**: `.env` (copy from `.env.example`)
- **Frontend**: `.env.local` (copy from `.env.example`)
- **Production**: Environment variables set via CI/CD pipeline

## 📊 Monitoring & Troubleshooting

### Health Checks

#### Automatic Health Checks
- **Database**: `pg_isready` every 30 seconds
- **Backend**: HTTP GET `/health` every 30 seconds
- **Frontend**: HTTP GET to root path every 30 seconds

#### Manual Health Checks
```bash
# Check backend health
curl -f http://localhost:8000/health

# Check frontend
curl -f http://localhost:3000/

# Check all Docker services
docker-compose ps
```

### Logging

#### View Application Logs
```bash
# All services
docker-compose logs -f

# Specific services
docker-compose logs -f app      # Backend
docker-compose logs -f frontend # Frontend
docker-compose logs -f db       # Database

# Production logs
docker-compose -f docker-compose.prod.yml logs -f
```

#### Backend Logging
- **Format**: Structured JSON logging
- **Levels**: DEBUG, INFO, WARNING, ERROR
- **Request ID**: Automatic request tracking
- **Performance**: Response time logging

### Common Issues & Solutions

#### Backend Issues
```bash
# Database connection failed
# 1. Check if PostgreSQL is running
docker-compose ps db

# 2. Verify DATABASE_URL format
echo $DATABASE_URL

# 3. Test database connectivity
poetry run python -c "from currency_converter.infrastructure.db.database import engine; print(engine.url)"
```

#### Frontend Issues
```bash
# Build fails
# 1. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Check TypeScript errors
npm run type-check

# 3. Verify environment variables
echo $REACT_APP_API_URL
```

#### Deployment Issues
```bash
# Service fails to start
# 1. Check service logs
docker-compose logs [service_name]

# 2. Verify environment variables
docker-compose config

# 3. Restart services
docker-compose restart

# 4. Complete reset
docker-compose down
docker system prune -f
docker-compose up -d
```

### Performance Monitoring
- **Backend**: Built-in request timing middleware
- **Frontend**: React DevTools and Performance tab
- **Database**: Query logging and analysis
- **Infrastructure**: Docker stats and system metrics

### Security Considerations
- **Environment Variables**: Never commit secrets to repository
- **API Keys**: Rotate regularly and use least privilege
- **Database**: Strong passwords and connection encryption
- **Network**: Firewall rules limiting access to necessary ports
- **Updates**: Keep dependencies and base images updated

### Development Guidelines
- Follow Clean Architecture principles
- Write comprehensive tests for new features
- Ensure all CI/CD checks pass
- Update documentation for significant changes
- Use conventional commit messages

---
