-- This script helps you deploy the Edge Function to Supabase
-- Run this after setting up your Supabase CLI

-- First, make sure you have the Supabase CLI installed:
-- npm install -g supabase

-- Then login to Supabase:
-- supabase login

-- Link your project (replace with your project reference):
-- supabase link --project-ref svksnpggavpxxwxfahcg

-- Deploy the Edge Function:
-- supabase functions deploy analyze-token

-- Set the environment variables for the Edge Function:
-- supabase secrets set COINGECKO_API_KEY=CG-bni69NAc1Ykpye5mqA9qd7JM
-- supabase secrets set BITQUERY_API_KEY=ory_at_O6mtvFk7AkZczJIJmHY6SCKZ1AM6VChXYnEN3VBbk0Q.5kLIsP3euoiS7mGwdxYtBfF-kzo-yciJZG-_79Xx0xQ
-- supabase secrets set UNISWAP_API_KEY=96aa054ab6f519bb3c0a18aa84a558a5
-- supabase secrets set ETHERSCAN_API_KEY=1YGS5YN6FPREFTHWRHXQM38YB7EXVUQSEU

SELECT 'Edge Function deployment commands ready!' as status;
