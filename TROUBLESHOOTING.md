# Troubleshooting Guide

## Common Issues and Solutions

### Edge Function Not Found Error

**Error Message:**
\`\`\`
Token analysis error: Edge function failed: {"code":"NOT_FOUND","message":"Requested function was not found"}
\`\`\`

**Solutions:**

1. **Use Demo Mode:**
   - Check the "Use demo data (bypass Edge Function)" option on the analysis page
   - This will use local mock data instead of calling the Edge Function

2. **Deploy the Edge Function:**
   - Make sure you've deployed the Edge Function to Supabase:
   \`\`\`bash
   supabase functions deploy analyze-token
   \`\`\`

3. **Check Function Name:**
   - Ensure the function name in your code matches the deployed function name
   - The function should be named "analyze-token" (kebab-case)

4. **Verify Supabase Configuration:**
   - Check that your environment variables are correctly set:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=https://svksnpggavpxxwxfahcg.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3NucGdnYXZweHh3eGZhaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIzNjksImV4cCI6MjA2NTI0ODM2OX0.GANw-ksuf4bb6V9OxpIdh6EdZ0320ml3tM5eZ4ttIeA
   \`\`\`

### API Rate Limit Errors

**Error Message:**
\`\`\`
CoinGecko API error: 429
\`\`\`

**Solutions:**

1. **Use Demo Mode:**
   - Check the "Use demo data (bypass Edge Function)" option
   - This will use local mock data instead of calling external APIs

2. **Wait and Retry:**
   - API rate limits are often time-based
   - Wait a few minutes and try again

3. **Upgrade API Plans:**
   - Consider upgrading to paid API plans for production use

### CORS Errors

**Error Message:**
\`\`\`
Access to fetch at 'https://svksnpggavpxxwxfahcg.supabase.co/functions/v1/analyze-token' from origin 'http://localhost:3000' has been blocked by CORS policy
\`\`\`

**Solutions:**

1. **Check CORS Headers:**
   - Ensure the Edge Function has proper CORS headers
   - Verify the _shared/cors.ts file is correctly set up

2. **Use Demo Mode:**
   - Check the "Use demo data (bypass Edge Function)" option
   - This will use local mock data and avoid CORS issues

### Chart Rendering Issues

**Error Message:**
\`\`\`
Cannot read properties of undefined (reading 'percentage')
\`\`\`

**Solutions:**

1. **Check Data Format:**
   - Ensure the wallet distribution data has the correct format
   - Each item should have label, value, and percentage properties

2. **Add Fallback Data:**
   - Add default values or empty arrays as fallbacks

## Debugging Tips

### Check Edge Function Logs

\`\`\`bash
supabase functions logs analyze-token
\`\`\`

### Test Edge Function Directly

\`\`\`bash
curl -X POST 'https://svksnpggavpxxwxfahcg.supabase.co/functions/v1/analyze-token' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3NucGdnYXZweHh3eGZhaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIzNjksImV4cCI6MjA2NTI0ODM2OX0.GANw-ksuf4bb6V9OxpIdh6EdZ0320ml3tM5eZ4ttIeA' \
  -H 'Content-Type: application/json' \
  -d '{"token": "USDC"}'
\`\`\`

### Check Browser Console

Open your browser's developer tools (F12) and check the console for errors.

### Enable Verbose Logging

Add console.log statements to your code to track the flow of execution.

## Still Having Issues?

If you're still experiencing problems after trying these solutions:

1. **Create a New Edge Function:**
   - Try creating a simple test function to verify your Supabase setup
   \`\`\`bash
   supabase functions new test-function
   \`\`\`

2. **Check Supabase Status:**
   - Visit [Supabase Status](https://status.supabase.com) to check for any service outages

3. **Contact Support:**
   - Reach out to Supabase support if you continue to experience issues
