#!/bin/bash

# Deploy script for Currency Converter
set -e

# Function to detect correct docker compose command
get_docker_compose_cmd() {
    if command -v docker-compose &> /dev/null; then
        echo "docker-compose"
    elif docker compose version &> /dev/null; then
        echo "docker compose"
    else
        echo "❌ Neither 'docker-compose' nor 'docker compose' are available!"
        exit 1
    fi
}

# Detect docker compose command
DOCKER_COMPOSE_CMD=$(get_docker_compose_cmd)
echo "📦 Using command: $DOCKER_COMPOSE_CMD"

echo "🚀 Starting Currency Converter deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying .env.example..."
    cp .env.example .env
    echo "📝 Please edit the .env file with your configurations before continuing."
    echo "   Press Enter to continue when ready..."
    read
fi

# Build images
echo "🔨 Building Docker images..."
docker build -t currency-converter-backend:latest .
docker build -t currency-converter-frontend:latest ./frontend

# Stop existing containers
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE_CMD down || true

# Start services
echo "🚀 Starting services..."
$DOCKER_COMPOSE_CMD up -d

# Wait for services to become healthy
echo "⏳ Waiting for services to become healthy..."
sleep 30

# Check service health
echo "🔍 Checking service health..."

# Check backend
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend is not responding"
    echo "📋 Backend logs:"
    $DOCKER_COMPOSE_CMD logs app
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend is not responding"
    echo "📋 Frontend logs:"
    $DOCKER_COMPOSE_CMD logs frontend
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📱 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Documentation: http://localhost:8000/docs"
echo "   Health Check: http://localhost:8000/health"
echo ""
echo "📋 To view logs:"
echo "   $DOCKER_COMPOSE_CMD logs -f"
echo ""
echo "🛑 To stop services:"
echo "   $DOCKER_COMPOSE_CMD down"
