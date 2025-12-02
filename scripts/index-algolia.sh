#!/bin/bash

# Script to index all data into Algolia
# Make sure your Next.js dev server is running before executing this script

BASE_URL="${1:-http://localhost:3000}"

echo "🚀 Starting Algolia indexing process..."
echo "Using base URL: $BASE_URL"
echo ""

# Check status first
echo "📊 Checking current index status..."
curl -s "$BASE_URL/api/algolia/check-status" | jq '.' || echo "Status check failed"
echo ""

# Index products
echo "📦 Indexing products..."
PRODUCTS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/algolia/index-products")
echo "$PRODUCTS_RESPONSE" | jq '.' || echo "$PRODUCTS_RESPONSE"
echo ""

# Index events
echo "📅 Indexing events..."
EVENTS_RESPONSE=$(curl -s -X POST "$BASE_URL/api/algolia/index-events")
echo "$EVENTS_RESPONSE" | jq '.' || echo "$EVENTS_RESPONSE"
echo ""

# Index articles
echo "📝 Indexing articles..."
ARTICLES_RESPONSE=$(curl -s -X POST "$BASE_URL/api/algolia/index-articles")
echo "$ARTICLES_RESPONSE" | jq '.' || echo "$ARTICLES_RESPONSE"
echo ""

# Index locations
echo "📍 Indexing locations..."
LOCATIONS_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "$BASE_URL/api/algolia/index-locations")
HTTP_STATUS=$(echo "$LOCATIONS_RESPONSE" | grep "HTTP_STATUS:" | cut -d: -f2)
RESPONSE_BODY=$(echo "$LOCATIONS_RESPONSE" | sed '/HTTP_STATUS:/d')
if [ -n "$HTTP_STATUS" ]; then
  echo "HTTP Status: $HTTP_STATUS"
fi
if [ -n "$RESPONSE_BODY" ]; then
  if command -v jq &> /dev/null; then
    echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
  else
    echo "$RESPONSE_BODY"
  fi
else
  echo "No response received"
fi
echo ""

# Check status after indexing
echo "📊 Checking index status after indexing..."
curl -s "$BASE_URL/api/algolia/check-status" | jq '.' || echo "Status check failed"
echo ""

echo "✅ Indexing complete!"
