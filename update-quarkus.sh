#!/bin/bash

set -e

SERVICES=(
    "billing-service"
    "inventory-service"
    "inventory-cli"
    "users-service"
    "reservation-service"
    "rental-service"
)

for service in "${SERVICES[@]}"; do
    echo "Updating $service..."
    cd "$service"
    echo "y" | quarkus update
    cd ..
done

echo "All modules updated successfully!"