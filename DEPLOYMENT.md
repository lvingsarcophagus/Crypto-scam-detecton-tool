# Deployment Guide

## Prerequisites

1. **Supabase CLI**: Install the Supabase CLI
   \`\`\`bash
   npm install -g supabase
   \`\`\`

2. **Login to Supabase**:
   \`\`\`bash
   supabase login
   \`\`\`

3. **Link your project**:
   \`\`\`bash
   supabase link --project-ref svksnpggavpxxwxfahcg
   \`\`\`

## Deploy Edge Function

1. **Deploy the function**:
   \`\`\`bash
   supabase functions deploy analyze-token
   \`\`\`

2. **Set environment variables**:
   \`\`\`bash
   supabase secrets set COINGECKO_API_KEY=CG-bni69NAc1Ykpye5mqA9qd7JM
   supabase secrets set BITQUERY_API_KEY=ory_at_O6mtvFk7AkZczJIJmHY6SCKZ1AM6VChXYnEN3VBbk0Q.5kLIsP3euoiS7mGwdxYtBfF-kzo-yciJZG-_79Xx0xQ
   supabase secrets set UNISWAP_API_KEY=96aa054ab6f519bb3c0a18aa84a558a5
   supabase secrets set ETHERSCAN_API_KEY=1YGS5YN6FPREFTHWRHXQM38YB7EXVUQSEU
   \`\`\`

3. **Verify deployment**:
   \`\`\`bash
   supabase functions list
   \`\`\`

## Test the Edge Function

You can test the Edge Function directly:

\`\`\`bash
curl -X POST 'https://svksnpggavpxxwxfahcg.supabase.co/functions/v1/analyze-token' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3NucGdnYXZweHh3eGZhaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIzNjksImV4cCI6MjA2NTI0ODM2OX0.GANw-ksuf4bb6V9OxpIdh6EdZ0320ml3tM5eZ4ttIeA' \
  -H 'Content-Type: application/json' \
  -d '{"token": "USDC"}'
\`\`\`

## Deploy Frontend to Vercel

1. **Push to GitHub** (if not already done)
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`
3. **Deploy**: Vercel will automatically deploy your app

## Environment Variables for Vercel

Make sure to add these environment variables in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing

1. **Local Testing**:
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Test with sample tokens**:
   - USDC (should show low risk)
   - ETH (should show very low risk)
   - Any random contract address (will use mock data)

## Troubleshooting

### Edge Function Issues
- Check logs: `supabase functions logs analyze-token`
- Verify secrets: `supabase secrets list`

### API Rate Limits
- The system includes fallback mock data for testing
- Consider upgrading API plans for production use

### CORS Issues
- Ensure CORS headers are properly set in the Edge Function
- Check browser console for CORS errors

## Production Considerations

1. **Rate Limiting**: Implement rate limiting for the Edge Function
2. **Caching**: Add caching for frequently requested tokens
3. **Monitoring**: Set up monitoring and alerting
4. **Error Handling**: Enhance error handling and user feedback
5. **Security**: Review and audit all API integrations
