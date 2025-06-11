#!/bin/bash

# Test script for the analyze-token Edge Function

SUPABASE_URL="https://svksnpggavpxxwxfahcg.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3NucGdnYXZweHh3eGZhaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIzNjksImV4cCI6MjA2NTI0ODM2OX0.GANw-ksuf4bb6V9OxpIdh6EdZ0320ml3tM5eZ4ttIeA"

echo "🧪 Testing Crypto Scam Detector Edge Function..."
echo ""

# Test 1: USDC (should be low risk)
echo "Test 1: Analyzing USDC..."
curl -X POST "${SUPABASE_URL}/functions/v1/analyze-token" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"token": "USDC"}' \
  | jq '.riskScore, .tokenInfo.name'

echo ""

# Test 2: ETH (should be very low risk)
echo "Test 2: Analyzing ETH..."
curl -X POST "${SUPABASE_URL}/functions/v1/analyze-token" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"token": "ETH"}' \
  | jq '.riskScore, .tokenInfo.name'

echo ""

# Test 3: Contract address
echo "Test 3: Analyzing contract address..."
curl -X POST "${SUPABASE_URL}/functions/v1/analyze-token" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"token": "0x1234567890123456789012345678901234567890"}' \
  | jq '.riskScore, .tokenInfo.name'

echo ""
echo "✅ Tests completed!"
