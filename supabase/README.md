# Supabase Setup for Crypto Scam Detector

This directory contains all the Supabase Edge Function code and configuration needed for the Crypto Scam Detector.

## 📁 Directory Structure

\`\`\`
supabase/
├── functions/
│   ├── analyze-token/
│   │   └── index.ts          # Main Edge Function code
│   └── _shared/
│       └── cors.ts           # CORS configuration
├── config.toml               # Supabase configuration
├── deploy.sh                 # Deployment script
├── test-function.sh          # Testing script
└── README.md                 # This file
\`\`\`

## 🚀 Quick Deployment

### Prerequisites

1. **Install Supabase CLI:**
   \`\`\`bash
   npm install -g supabase
   \`\`\`

2. **Login to Supabase:**
   \`\`\`bash
   supabase login
   \`\`\`

3. **Link your project:**
   \`\`\`bash
   supabase link --project-ref svksnpggavpxxwxfahcg
   \`\`\`

### Deploy Everything

Run the deployment script:
\`\`\`bash
chmod +x supabase/deploy.sh
./supabase/deploy.sh
\`\`\`

Or deploy manually:

1. **Deploy the Edge Function:**
   \`\`\`bash
   supabase functions deploy analyze-token
   \`\`\`

2. **Set environment variables:**
   \`\`\`bash
   supabase secrets set COINGECKO_API_KEY=CG-bni69NAc1Ykpye5mqA9qd7JM
   supabase secrets set BITQUERY_API_KEY=ory_at_O6mtvFk7AkZczJIJmHY6SCKZ1AM6VChXYnEN3VBbk0Q.5kLIsP3euoiS7mGwdxYtBfF-kzo-yciJZG-_79Xx0xQ
   supabase secrets set UNISWAP_API_KEY=96aa054ab6f519bb3c0a18aa84a558a5
   supabase secrets set ETHERSCAN_API_KEY=1YGS5YN6FPREFTHWRHXQM38YB7EXVUQSEU
   \`\`\`

## 🧪 Testing

### Test the Edge Function

Run the test script:
\`\`\`bash
chmod +x supabase/test-function.sh
./supabase/test-function.sh
\`\`\`

Or test manually:
\`\`\`bash
curl -X POST 'https://svksnpggavpxxwxfahcg.supabase.co/functions/v1/analyze-token' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3NucGdnYXZweHh3eGZhaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIzNjksImV4cCI6MjA2NTI0ODM2OX0.GANw-ksuf4bb6V9OxpIdh6EdZ0320ml3tM5eZ4ttIeA' \
  -H 'Content-Type: application/json' \
  -d '{"token": "USDC"}'
\`\`\`

### Expected Response

\`\`\`json
{
  "riskScore": 15,
  "breakdown": {
    "walletConcentration": {
      "score": 20,
      "topWalletsPercentage": 25.5,
      "details": "Top 5 wallets hold 25.5% of total supply"
    },
    "liquidityAnalysis": {
      "score": 10,
      "liquidityRatio": 22.5,
      "details": "Liquidity ratio: 22.50% (Volume/Market Cap)"
    },
    "supplyDynamics": {
      "score": 15,
      "reservePercentage": 25.0,
      "mintingRisk": false,
      "details": "25.0% of max supply in reserve"
    },
    "tradingVolume": {
      "score": 15,
      "volumeToHoldersRatio": 150.0,
      "washTradingDetected": false,
      "details": "Volume per holder: $150.00"
    }
  },
  "redFlags": [],
  "walletDistribution": [...],
  "tokenInfo": {
    "name": "USD Coin",
    "symbol": "USDC",
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "marketCap": 25000000000,
    "volume24h": 2500000000,
    "price": 1.0
  }
}
\`\`\`

## 🔧 Configuration

### Edge Function Settings

The Edge Function is configured with:
- **JWT Verification**: Disabled (set to `false` for public access)
- **CORS**: Enabled for all origins
- **Timeout**: 10 seconds per API call
- **Fallback**: Mock data when APIs fail

### API Integration

The function integrates with:
- **CoinGecko API**: Market data, price, volume
- **Etherscan API**: Contract information, token details
- **Uniswap API**: Liquidity data (placeholder)
- **BitQuery API**: Blockchain data (placeholder)

## 📊 Risk Scoring Algorithm

The Edge Function implements a weighted scoring system:

1. **Wallet Concentration (40%)**:
   - Analyzes top 5 wallet holdings
   - Penalties for single wallet >30%
   - Score: 0-100 based on concentration levels

2. **Liquidity Analysis (25%)**:
   - Volume-to-market-cap ratio
   - Lower liquidity = higher risk
   - Score: 0-100 based on liquidity thresholds

3. **Supply Dynamics (20%)**:
   - Checks for unlimited minting
   - Analyzes reserve percentages
   - Score: 0-100 based on supply risks

4. **Trading Volume (15%)**:
   - Volume-to-holders ratio
   - Wash trading detection
   - Score: 0-100 based on trading patterns

## 🐛 Debugging

### View Logs
\`\`\`bash
supabase functions logs analyze-token
\`\`\`

### Common Issues

1. **Function Not Found**: Ensure function is deployed
2. **API Rate Limits**: Function includes fallback mock data
3. **CORS Errors**: Check CORS headers in _shared/cors.ts
4. **Timeout Errors**: Function has 10-second timeout per API call

## 🔒 Security

- API keys are stored as Supabase secrets
- No persistent data storage
- CORS properly configured
- Input validation and sanitization
- Error handling with fallbacks

## 📈 Monitoring

Monitor your Edge Function:
- Check logs regularly: `supabase functions logs analyze-token`
- Monitor API usage and rate limits
- Track function invocation metrics in Supabase dashboard

## 🚀 Production Considerations

1. **Rate Limiting**: Consider implementing rate limiting
2. **Caching**: Add caching for frequently requested tokens
3. **Monitoring**: Set up alerts for function failures
4. **API Upgrades**: Consider upgrading to paid API tiers
5. **Error Handling**: Enhance error reporting and user feedback
\`\`\`

Finally, create a simple migration file (though we're not using persistent storage):
