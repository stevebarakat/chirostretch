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

# Check status after indexing
echo "📊 Checking index status after indexing..."
curl -s "$BASE_URL/api/algolia/check-status" | jq '.' || echo "Status check failed"
echo ""

echo "✅ Indexing complete!"
