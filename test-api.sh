#!/bin/bash

# Test script for Master Data Importer API
# Make sure the services are running: docker compose up -d

BASE_URL="http://localhost:8080/api/windturbines"
API_UI="http://localhost:8080/scalar/v1"

echo "====================================================================="
echo "Master Data Importer - API Test Script"
echo "====================================================================="
echo ""
echo "API Documentation UI: $API_UI"
echo ""

# Test 1: Check statistics
echo "1. Getting database statistics..."
curl -s "$BASE_URL/stats" | jq
echo ""

# Test 2: Get single GSRN
echo "2. Getting turbine by GSRN: 570715000000032516..."
curl -s "$BASE_URL/gsrn/570715000000032516" | jq
echo ""

# Test 3: Get multiple GSRNs
echo "3. Getting multiple turbines by GSRN list..."
curl -s -X POST "$BASE_URL/gsrn/batch" \
  -H 'Content-Type: application/json' \
  -d '["570715000000032516", "570714700000011283"]' | jq
echo ""

# Test 4: Filter by manufacturer
echo "4. Getting turbines by manufacturer (BONUS)..."
curl -s "$BASE_URL/manufacturer/BONUS?pageSize=3" | jq '.[0:2]'
echo ""

# Test 5: Filter by model type
echo "5. Getting turbines by model type (M 102)..."
curl -s "$BASE_URL/model/M%20102?pageSize=2" | jq
echo ""

# Test 6: Get paginated list
echo "6. Getting first 5 turbines..."
curl -s "$BASE_URL?page=1&pageSize=5" | jq '.[0:3]'
echo ""

echo "====================================================================="
echo "All tests completed!"
echo "====================================================================="
