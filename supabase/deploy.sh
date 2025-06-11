#!/bin/bash

# Crypto Scam Detector - Supabase Deployment Script

echo "🚀 Deploying Crypto Scam Detector to Supabase..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Please login to Supabase first:"
    echo "supabase login"
    exit 1
fi

# Deploy the Edge Function
echo "📦 Deploying analyze-token Edge Function..."
supabase functions deploy analyze-token

if [ $? -eq 0 ]; then
    echo "✅ Edge Function deployed successfully!"
else
    echo "❌ Edge Function deployment failed!"
    exit 1
fi

# Set environment variables (secrets)
echo "🔐 Setting up environment variables..."

echo "Setting COINGECKO_API_KEY..."
supabase secrets set COINGECKO_API_KEY=CG-bni69NAc1Ykpye5mqA9qd7JM

echo "Setting BITQUERY_API_KEY..."
supabase secrets set BITQUERY_API_KEY=ory_at_O6mtvFk7AkZczJIJmHY6SCKZ1AM6VChXYnEN3VBbk0Q.5kLIsP3euoiS7mGwdxYtBfF-kzo-yciJZG-_79Xx0xQ

echo "Setting UNISWAP_API_KEY..."
supabase secrets set UNISWAP_API_KEY=96aa054ab6f519bb3c0a18aa84a558a5

echo "Setting ETHERSCAN_API_KEY..."
supabase secrets set ETHERSCAN_API_KEY=1YGS5YN6FPREFTHWRHXQM38YB7EXVUQSEU

echo "✅ Environment variables set successfully!"

# List functions to verify deployment
echo "📋 Listing deployed functions..."
supabase functions list

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Test your Edge Function:"
echo "   curl -X POST 'https://svksnpggavpxxwxfahcg.supabase.co/functions/v1/analyze-token' \\"
echo "     -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3NucGdnYXZweHh3eGZhaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIzNjksImV4cCI6MjA2NTI0ODM2OX0.GANw-ksuf4bb6V9OxpIdh6EdZ0320ml3tM5eZ4ttIeA' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"token\": \"USDC\"}'"
echo ""
echo "2. Update your frontend to use the deployed Edge Function"
echo "3. Test the complete application"
