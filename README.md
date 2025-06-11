# Crypto Scam Detector

A comprehensive web-based cryptocurrency scam detection system that analyzes tokenomics metrics to provide real-time risk assessments.

## Features

- **Real-time Token Analysis**: Enter any token contract address or name for instant risk assessment
- **Comprehensive Risk Scoring**: 0-100 risk score based on multiple tokenomics factors
- **Visual Analytics**: Interactive pie charts showing wallet distribution
- **PDF Reports**: Generate downloadable analysis reports
- **Multi-API Integration**: Leverages CoinGecko, BitQuery, Uniswap, and Etherscan APIs
- **Serverless Architecture**: Uses Supabase Edge Functions for scalable processing

## Risk Assessment Factors

### Wallet Concentration (40% weight)
- Analyzes top wallet holdings
- Flags extreme centralization
- Detects single-wallet dominance

### Liquidity Analysis (25% weight)
- Evaluates liquidity-to-market-cap ratio
- Identifies potential exit scam risks
- Assesses trading depth

### Supply Dynamics (20% weight)
- Checks for unlimited minting capabilities
- Analyzes token reserve percentages
- Identifies supply manipulation risks

### Trading Volume (15% weight)
- Detects wash trading patterns
- Analyzes volume-to-holder ratios
- Identifies suspicious trading activity

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- API keys for external services

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd crypto-scam-detector
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.local.example .env.local
\`\`\`

4. Configure your API keys in `.env.local`

5. Deploy Supabase Edge Functions:
\`\`\`bash
supabase functions deploy analyze-token
\`\`\`

6. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter a token contract address (e.g., `0x...`) or token name (e.g., `USDC`)
2. Click "Analyze" to start the risk assessment
3. Review the comprehensive risk breakdown
4. Download a PDF report for your records

## Example Tokens to Test

- **USDC**: `0xA0b86a33E6441b8e8C7C7b0b8e8e8e8e8e8e8e8e` (Low Risk)
- **Ethereum**: `ETH` (Very Low Risk)
- **Bitcoin**: `BTC` (Very Low Risk)

## API Integration

The system integrates with multiple APIs:

- **CoinGecko**: Market data, price, volume, market cap
- **BitQuery**: Transaction history, wallet balances, DEX data
- **Uniswap**: Liquidity and trading pair information
- **Etherscan**: On-chain data, wallet balances, contract analysis

## Architecture

- **Frontend**: Next.js 15 with Tailwind CSS
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Charts**: Chart.js with React integration
- **PDF Generation**: jsPDF for client-side report generation
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Security Considerations

- All API keys are stored as environment variables
- No persistent data storage (privacy-focused)
- CORS headers properly configured
- Input validation and sanitization
- Rate limiting through API providers

## Limitations

- Analysis is based on available public data
- Some metrics use estimated calculations
- Real-time data depends on API availability
- Not financial advice - for educational purposes only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for educational and informational purposes only. It should not be considered as financial advice. Always conduct your own research and consult with financial professionals before making investment decisions.
