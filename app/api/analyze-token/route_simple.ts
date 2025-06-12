import { type NextRequest, NextResponse } from "next/server"

// Generate realistic token analysis data for demo purposes
function generateRealisticTokenAnalysis(token: string) {
  // Pre-defined realistic token scenarios
  const tokenScenarios = {
    // Low risk tokens
    "ETH": {
      name: "Ethereum",
      symbol: "ETH",
      riskScore: 15,
      marketCap: 276000000000,
      volume24h: 15000000000,
      price: 2300,
      scenario: "established"
    },
    "USDC": {
      name: "USD Coin",
      symbol: "USDC",
      riskScore: 8,
      marketCap: 25000000000,
      volume24h: 2500000000,
      price: 1.00,
      scenario: "stablecoin"
    },
    "UNI": {
      name: "Uniswap",
      symbol: "UNI",
      riskScore: 22,
      marketCap: 4500000000,
      volume24h: 120000000,
      price: 7.5,
      scenario: "established"
    },
    // Medium risk tokens
    "SHIB": {
      name: "Shiba Inu",
      symbol: "SHIB",
      riskScore: 58,
      marketCap: 5800000000,
      volume24h: 280000000,
      price: 0.0000098,
      scenario: "meme"
    },
    // High risk tokens
    "SCAM": {
      name: "ScamCoin",
      symbol: "SCAM",
      riskScore: 92,
      marketCap: 1200000,
      volume24h: 45000,
      price: 0.000012,
      scenario: "scam"
    }
  }

  // Check if we have a predefined scenario
  const upperToken = token.toUpperCase()
  let tokenData = tokenScenarios[upperToken as keyof typeof tokenScenarios]

  // If not predefined, generate realistic data based on token characteristics
  if (!tokenData) {
    let scenario = "unknown"
    let riskScore = 35

    // Analyze token input to determine likely scenario
    if (token.toLowerCase().includes('safe') || token.toLowerCase().includes('moon') || token.toLowerCase().includes('rocket')) {
      scenario = "suspicious"
      riskScore = Math.floor(Math.random() * 30) + 60 // 60-90
    } else if (token.toLowerCase().includes('coin') || token.toLowerCase().includes('token')) {
      scenario = "generic"
      riskScore = Math.floor(Math.random() * 40) + 30 // 30-70
    } else if (token.startsWith('0x')) {
      scenario = "contract"
      riskScore = Math.floor(Math.random() * 50) + 25 // 25-75
    } else {
      scenario = "unknown"
      riskScore = Math.floor(Math.random() * 60) + 20 // 20-80
    }

    tokenData = {
      name: `${token} Token`,
      symbol: token.toUpperCase().slice(0, 6),
      riskScore,
      marketCap: Math.floor(Math.random() * 50000000) + 1000000, // 1M - 50M
      volume24h: Math.floor(Math.random() * 5000000) + 100000, // 100K - 5M
      price: Math.random() * 10 + 0.01, // $0.01 - $10
      scenario
    }
  }

  // Generate realistic wallet distribution based on scenario
  const generateWalletDistribution = (scenario: string, supply: number) => {
    switch (scenario) {
      case "established":
        return [
          { label: "Top Holder", value: supply * 0.08, percentage: 8, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "DEX Liquidity", value: supply * 0.12, percentage: 12, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Exchange Cold Storage", value: supply * 0.15, percentage: 15, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Whale #1", value: supply * 0.06, percentage: 6, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Whale #2", value: supply * 0.05, percentage: 5, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Community Pool", value: supply * 0.10, percentage: 10, address: "Various" },
          { label: "Retail Holders", value: supply * 0.44, percentage: 44, address: "Various" }
        ]
      
      case "scam":
        return [
          { label: "Creator Wallet", value: supply * 0.45, percentage: 45, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Team Wallet", value: supply * 0.25, percentage: 25, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Marketing Wallet", value: supply * 0.15, percentage: 15, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Fake Liquidity", value: supply * 0.08, percentage: 8, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Early Buyers", value: supply * 0.05, percentage: 5, address: "Various" },
          { label: "Trapped Holders", value: supply * 0.02, percentage: 2, address: "Various" }
        ]
      
      case "meme":
        return [
          { label: "Original Deployer", value: supply * 0.20, percentage: 20, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Uniswap V2", value: supply * 0.18, percentage: 18, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Community Whale", value: supply * 0.12, percentage: 12, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Diamond Hands #1", value: supply * 0.08, percentage: 8, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Diamond Hands #2", value: supply * 0.07, percentage: 7, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Meme Army", value: supply * 0.25, percentage: 25, address: "Various" },
          { label: "Paper Hands", value: supply * 0.10, percentage: 10, address: "Various" }
        ]
      
      default:
        return [
          { label: "Largest Holder", value: supply * 0.25, percentage: 25, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Liquidity Pool", value: supply * 0.20, percentage: 20, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Early Investor", value: supply * 0.15, percentage: 15, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Team Allocation", value: supply * 0.10, percentage: 10, address: "0x" + Math.random().toString(16).substr(2, 40) },
          { label: "Public Sale", value: supply * 0.18, percentage: 18, address: "Various" },
          { label: "Community", value: supply * 0.12, percentage: 12, address: "Various" }
        ]
    }
  }

  // Calculate supply based on market cap and price
  const totalSupply = Math.floor(tokenData.marketCap / tokenData.price)
  const walletDistribution = generateWalletDistribution(tokenData.scenario, totalSupply)

  // Generate risk analysis based on scenario and data
  const calculateRisks = (scenario: string, riskScore: number, distribution: any[]) => {
    const topWalletsPercentage = distribution.slice(0, 3).reduce((sum, w) => sum + w.percentage, 0)
    
    const walletConcentration = {
      score: Math.min(100, topWalletsPercentage * 1.2),
      topWalletsPercentage,
      details: topWalletsPercentage > 50 
        ? `High concentration: Top 3 wallets hold ${topWalletsPercentage}% of supply`
        : `Moderate distribution: Top 3 wallets hold ${topWalletsPercentage}% of supply`
    }

    const liquidityRatio = (tokenData.volume24h / tokenData.marketCap) * 100
    const liquidityAnalysis = {
      score: liquidityRatio < 1 ? 80 : liquidityRatio > 10 ? 15 : 50 - (liquidityRatio * 3),
      liquidityRatio,
      details: liquidityRatio < 1 
        ? `Very low liquidity: ${liquidityRatio.toFixed(2)}% volume/market cap ratio`
        : liquidityRatio > 10 
        ? `High liquidity: ${liquidityRatio.toFixed(2)}% volume/market cap ratio`
        : `Normal liquidity: ${liquidityRatio.toFixed(2)}% volume/market cap ratio`
    }

    const mintingRisk = scenario === "scam" || scenario === "suspicious"
    const supplyDynamics = {
      score: mintingRisk ? 85 : 25,
      reservePercentage: mintingRisk ? 0 : Math.random() * 30,
      mintingRisk,
      details: mintingRisk 
        ? "Unlimited minting capability detected - high risk"
        : `${(Math.random() * 30).toFixed(1)}% of max supply in reserve`
    }

    const volumeToHolders = tokenData.volume24h / Math.sqrt(tokenData.marketCap / 1000)
    const washTradingDetected = scenario === "scam" || liquidityRatio > 15
    const tradingVolume = {
      score: washTradingDetected ? 90 : Math.min(100, volumeToHolders / 100),
      volumeToHoldersRatio: volumeToHolders,
      washTradingDetected,
      details: washTradingDetected 
        ? "Potential wash trading detected"
        : `Volume per estimated holder: $${volumeToHolders.toFixed(2)}`
    }

    return { walletConcentration, liquidityAnalysis, supplyDynamics, tradingVolume }
  }

  const breakdown = calculateRisks(tokenData.scenario, tokenData.riskScore, walletDistribution)

  // Generate red flags based on risk analysis
  const generateRedFlags = (scenario: string, breakdown: any) => {
    const flags = []
    
    if (breakdown.walletConcentration.score >= 70) {
      flags.push("High wallet concentration - few wallets control majority of tokens")
    }
    
    if (breakdown.liquidityAnalysis.score >= 70) {
      flags.push("Low liquidity relative to market cap - potential exit scam risk")
    }
    
    if (breakdown.supplyDynamics.mintingRisk) {
      flags.push("Unlimited token minting capability detected")
    }
    
    if (breakdown.tradingVolume.washTradingDetected) {
      flags.push("Suspicious trading patterns suggest wash trading")
    }
    
    if (scenario === "scam") {
      flags.push("Extreme centralization detected")
      flags.push("Unverified smart contract")
      flags.push("Suspicious tokenomics structure")
    }
    
    if (scenario === "suspicious" || token.toLowerCase().includes('safe')) {
      flags.push("Token name contains high-risk keywords")
      flags.push("Recently created contract")
    }
    
    if (breakdown.walletConcentration.topWalletsPercentage > 60) {
      flags.push("Extreme centralization - top wallets control over 60% of supply")
    }

    return flags
  }

  const redFlags = generateRedFlags(tokenData.scenario, breakdown)

  // Generate realistic API data
  const generateApiData = (tokenData: any, scenario: string) => {
    const isContract = token.startsWith('0x')
    const contractAddress = isContract ? token : "0x" + Math.random().toString(16).substr(2, 40)

    return {
      coinGecko: {
        id: tokenData.symbol.toLowerCase(),
        symbol: tokenData.symbol.toLowerCase(),
        name: tokenData.name,
        contract_address: contractAddress,
        market_data: {
          current_price: { usd: tokenData.price },
          market_cap: { usd: tokenData.marketCap },
          total_volume: { usd: tokenData.volume24h },
          total_supply: totalSupply,
          circulating_supply: totalSupply * 0.85,
          max_supply: scenario === "scam" ? null : totalSupply * 1.2
        },
        community_data: {
          twitter_followers: scenario === "established" ? 500000 : scenario === "meme" ? 50000 : 1200,
          telegram_channel_user_count: scenario === "established" ? 25000 : scenario === "meme" ? 5000 : 500
        }
      },
      etherscan: {
        status: "1",
        result: [{
          SourceCode: scenario === "scam" ? "" : "Contract source code verified",
          ContractName: tokenData.name.replace(/\s+/g, ''),
          CompilerVersion: "v0.8.19+commit.7dd6d404",
          OptimizationUsed: "1",
          Runs: "200"
        }]
      },
      uniswap: {
        data: {
          token: {
            id: contractAddress.toLowerCase(),
            symbol: tokenData.symbol,
            name: tokenData.name,
            decimals: "18",
            totalSupply: totalSupply.toString(),
            volumeUSD: tokenData.volume24h.toString(),
            totalValueLocked: (tokenData.marketCap * 0.15).toString(),
            txCount: scenario === "established" ? "50000" : scenario === "meme" ? "5000" : "500"
          },
          pools: scenario === "scam" ? [] : [
            {
              id: "0x" + Math.random().toString(16).substr(2, 40),
              token0: { symbol: tokenData.symbol },
              token1: { symbol: "WETH" },
              feeTier: "3000",
              liquidity: (tokenData.marketCap * 0.1).toString(),
              totalValueLockedUSD: (tokenData.marketCap * 0.15).toString(),
              volumeUSD: (tokenData.volume24h * 0.6).toString()
            }
          ]
        }
      },
      bitquery: {
        data: {
          ethereum: {
            address: [{
              smartContract: {
                contractType: "Token",
                currency: {
                  symbol: tokenData.symbol,
                  name: tokenData.name,
                  decimals: 18
                }
              }
            }],
            transfers: scenario === "scam" ? [] : Array.from({length: Math.min(10, Math.floor(Math.random() * 8) + 3)}, (_, i) => ({
              count: Math.floor(Math.random() * 100) + 10,
              amount: Math.random() * 1000000
            }))
          }
        }
      },
      tokenMetrics: {
        name: tokenData.name,
        symbol: tokenData.symbol,
        contract_address: contractAddress,
        market_cap: tokenData.marketCap,
        volume_24h: tokenData.volume24h,
        price: tokenData.price,
        total_supply: totalSupply,
        circulating_supply: totalSupply * 0.85,
        analytics: {
          risk_score: Math.min(100, tokenData.riskScore + Math.floor(Math.random() * 10) - 5),
          liquidity_score: scenario === "scam" ? 15 : scenario === "established" ? 85 : 50,
          volatility_score: scenario === "stablecoin" ? 5 : scenario === "meme" ? 95 : 60,
          market_cap_rank: scenario === "established" ? Math.floor(Math.random() * 50) + 1 : Math.floor(Math.random() * 2000) + 100
        },
        exchanges: scenario === "scam" ? [] : ["Uniswap V2", "PancakeSwap"]
      }
    }
  }

  const apiData = generateApiData(tokenData, tokenData.scenario)

  // Calculate data quality
  const dataQuality = {
    score: tokenData.scenario === "scam" ? 60 : 85,
    details: tokenData.scenario === "scam" 
      ? "3/5 API sources available. ✅ CoinGecko ❌ Etherscan ✅ Uniswap ❌ BitQuery ✅ TokenMetrics (60% data quality)"
      : "5/5 API sources available. ✅ CoinGecko ✅ Etherscan ✅ Uniswap ✅ BitQuery ✅ TokenMetrics (85% data quality)",
    sources: {
      coinGecko: true,
      etherscan: tokenData.scenario !== "scam",
      uniswap: true,
      bitquery: tokenData.scenario !== "scam",
      tokenMetrics: true
    }
  }

  return {
    riskScore: tokenData.riskScore,
    breakdown,
    redFlags,
    walletDistribution,
    tokenInfo: {
      name: tokenData.name,
      symbol: tokenData.symbol,
      address: token.startsWith('0x') ? token : "0x" + Math.random().toString(16).substr(2, 40),
      marketCap: tokenData.marketCap,
      volume24h: tokenData.volume24h,
      price: tokenData.price
    },
    apiData,
    dataQuality
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token address or name is required" }, { status: 400 })
    }

    // Generate realistic dummy data for demo purposes
    console.log(`Generating realistic analysis for token: ${token}`)
    const realisticData = generateRealisticTokenAnalysis(token)
    return NextResponse.json(realisticData)

  } catch (error) {
    console.error("Token analysis error:", error)
    
    if (error instanceof Error) {
      if (error.message.includes("not found") || error.message.includes("404")) {
        return NextResponse.json({ 
          error: "Token not found. Please check the contract address or token symbol and try again." 
        }, { status: 404 })
      }
      if (error.message.includes("timeout") || error.message.includes("ETIMEDOUT")) {
        return NextResponse.json({ 
          error: "Request timeout. The blockchain APIs are currently slow. Please try again." 
        }, { status: 408 })
      }
      return NextResponse.json({ 
        error: `Analysis failed: ${error.message}` 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: "An unexpected error occurred during token analysis" 
    }, { status: 500 })
  }
}
