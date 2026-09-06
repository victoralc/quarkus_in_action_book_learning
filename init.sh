#!/bin/bash

set -e

SERVICES=(
    "rental-service"
    "users-service"
    "reservation-service"
    "inventory-service"
    "billing-service"
    "inventory-cli"
)

echo "Starting Quarkus services..."

for service in "${SERVICES[@]}"; do
    if [ -d "$service" ]; then
        echo "Starting $service..."
        cd "$service"
        nohup ./mvnw quarkus:dev > "../$service.log" 2>&1 &
        cd ..
    fi
done

echo "Starting Next.js frontend..."
cd rental-car-webapp-ui
nohup npm run dev > "../nextjs.log" 2>&1 &
cd ..

echo "All services started!"
echo ""
echo "Service logs:"
echo "  rental-service: rental-service.log"
echo "  users-service: users-service.log"
echo "  reservation-service: reservation-service.log"
echo "  inventory-service: inventory-service.log"
echo "  billing-service: billing-service.log"
echo "  inventory-cli: inventory-cli.log"
echo "  Next.js: nextjs.log"
echo ""
echo "Wait for services to be ready, then access:"
echo "  Frontend: http://localhost:3000"
echo "  Quarkus Dev UI: http://localhost:8080/q/dev/"