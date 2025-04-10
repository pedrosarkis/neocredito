#!/bin/bash

# Clean up any existing containers
echo "Removing any existing containers..."
docker-compose down --remove-orphans

# Build and start services
echo "Building and starting services..."
docker-compose build
docker-compose up -d

echo "Services started! Access the application at:"
echo "- Frontend: http://localhost"
echo "- API: http://localhost:3001/api/health"
echo "- RabbitMQ Management: http://localhost:15672 (guest/guest)"

echo ""
echo "To view logs:"
echo "docker-compose logs -f"

echo ""
echo "To stop all services:"
echo "docker-compose down" 