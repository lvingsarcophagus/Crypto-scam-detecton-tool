interface TokenAnalysis {
  riskScore: number
  breakdown: {
    walletConcentration: {
      score: number
      topWalletsPercentage: number
      details: string
    }
    liquidityAnalysis: {
      score: number
      liquidityRatio: number
      details: string
    }
    supplyDynamics: {
      score: number
      reservePercentage: number
      mintingRisk: boolean
      details: string
    }
    tradingVolume: {
      score: number
      volumeToHoldersRatio: number
      washTradingDetected: boolean
      details: string
    }
  }
  redFlags: string[]
  walletDistribution: {
    label: string
    value: number
    percentage: number
    address?: string
  }[]
  tokenInfo: {
    name: string
    symbol: string
    address: string
    marketCap: number
    volume24h: number
    price: number
  }
  apiData?: {
    coinGecko: any
    etherscan: any
  }
}

// Mock data for known tokens
const knownTokens: Record<string, Partial<TokenAnalysis>> = {
  USDC: {
    riskScore: 15,
    tokenInfo: {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      marketCap: 25000000000,
      volume24h: 2500000000,
      price: 1.0,
    },
    breakdown: {
      walletConcentration: {
        score: 20,
        topWalletsPercentage: 25.5,
        details: "Top 5 wallets hold 25.5% of total supply",
      },
      liquidityAnalysis: {
        score: 10,
        liquidityRatio: 22.5,
        details: "Liquidity ratio: 22.50% (Volume/Market Cap)",
      },
      supplyDynamics: {
        score: 15,
        reservePercentage: 25.0,
        mintingRisk: false,
        details: "25.0% of max supply in reserve",
      },
      tradingVolume: {
        score: 15,
        volumeToHoldersRatio: 150.0,
        washTradingDetected: false,
        details: "Volume per holder: $150.00",
      },
    },
    redFlags: [],
  },
  ETH: {
    riskScore: 10,
    tokenInfo: {
      name: "Ethereum",
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      marketCap: 276000000000,
      volume24h: 15000000000,
      price: 2300.0,
    },
    breakdown: {
      walletConcentration: {
        score: 15,
        topWalletsPercentage: 18.2,
        details: "Top 5 wallets hold 18.2% of total supply",
      },
      liquidityAnalysis: {
        score: 5,
        liquidityRatio: 25.0,
        details: "Liquidity ratio: 25.00% (Volume/Market Cap)",
      },
      supplyDynamics: {
        score: 10,
        reservePercentage: 0.0,
        mintingRisk: false,
        details: "0.0% of max supply in reserve",
      },
      tradingVolume: {
        score: 10,
        volumeToHoldersRatio: 100.0,
        washTradingDetected: false,
        details: "Volume per holder: $100.00",
      },
    },
    redFlags: [],
  },
  WBTC: {
    riskScore: 25,
    tokenInfo: {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      marketCap: 150000000000,
      volume24h: 5000000000,
      price: 42000.0,
    },
    breakdown: {
      walletConcentration: {
        score: 40,
        topWalletsPercentage: 42.5,
        details: "Top 5 wallets hold 42.5% of total supply",
      },
      liquidityAnalysis: {
        score: 15,
        liquidityRatio: 15.0,
        details: "Liquidity ratio: 15.00% (Volume/Market Cap)",
      },
      supplyDynamics: {
        score: 20,
        reservePercentage: 0.0,
        mintingRisk: false,
        details: "0.0% of max supply in reserve",
      },
      tradingVolume: {
        score: 15,
        volumeToHoldersRatio: 150.0,
        washTradingDetected: false,
        details: "Volume per holder: $150.00",
      },
    },
    redFlags: [],
  },
  SCAM: {
    riskScore: 85,
    tokenInfo: {
      name: "Test High Risk Token",
      symbol: "SCAM",
      address: "0x1234567890123456789012345678901234567890",
      marketCap: 5000000,
      volume24h: 2000000,
      price: 0.00001,
    },
    breakdown: {
      walletConcentration: {
        score: 95,
        topWalletsPercentage: 85.5,
        details: "Top 5 wallets hold 85.5% of total supply",
      },
      liquidityAnalysis: {
        score: 90,
        liquidityRatio: 1.5,
        details: "Liquidity ratio: 1.50% (Volume/Market Cap)",
      },
      supplyDynamics: {
        score: 80,
        reservePercentage: 10.0,
        mintingRisk: true,
        details: "Unlimited minting detected - high risk",
      },
      tradingVolume: {
        score: 65,
        volumeToHoldersRatio: 150.0,
        washTradingDetected: true,
        details: "Potential wash trading detected",
      },
    },
    redFlags: [
      "High wallet concentration - few wallets control majority of tokens",
      "Low liquidity relative to market cap - potential exit scam risk",
      "Unlimited token minting capability detected",
      "Suspicious trading patterns suggest wash trading",
      "Extreme centralization - top wallets control over 70% of supply",
    ],
  },
}

// Update the generateMockWalletDistribution function in mock-data.ts

function generateMockWalletDistribution(symbol: string, isHighRisk = false) {
  // Generate different distribution patterns based on token type
  const isStablecoin = ["USDC", "USDT", "DAI", "BUSD"].includes(symbol.toUpperCase())
  const isMainToken = ["ETH", "BTC", "WBTC"].includes(symbol.toUpperCase())

  // Generate random wallet addresses
  const generateAddress = () => {
    return "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
  }

  if (isStablecoin) {
    // Stablecoins typically have more distributed holdings
    return [
      { label: "Top Wallet", value: 2000000, percentage: 15.5, address: generateAddress() },
      { label: "Wallet 2", value: 1500000, percentage: 12.8, address: generateAddress() },
      { label: "Wallet 3", value: 1200000, percentage: 10.7, address: generateAddress() },
      { label: "Wallet 4", value: 1000000, percentage: 9.1, address: generateAddress() },
      { label: "Wallet 5", value: 800000, percentage: 7.3, address: generateAddress() },
      { label: "Wallets 6-10", value: 2000000, percentage: 18.1, address: generateAddress() },
      { label: "Other Holders", value: 3500000, percentage: 26.5, address: generateAddress() },
    ]
  } else if (isMainToken) {
    // Main tokens have moderate concentration
    return [
      { label: "Top Wallet", value: 3000000, percentage: 22.5, address: generateAddress() },
      { label: "Wallet 2", value: 2000000, percentage: 15.8, address: generateAddress() },
      { label: "Wallet 3", value: 1500000, percentage: 12.7, address: generateAddress() },
      { label: "Wallet 4", value: 1000000, percentage: 8.1, address: generateAddress() },
      { label: "Wallet 5", value: 800000, percentage: 6.3, address: generateAddress() },
      { label: "Wallets 6-10", value: 1700000, percentage: 13.1, address: generateAddress() },
      { label: "Other Holders", value: 2800000, percentage: 21.5, address: generateAddress() },
    ]
  } else {
    // Unknown tokens - potentially higher risk distribution
    if (isHighRisk) {
      return [
        { label: "Top Wallet", value: 5000000, percentage: 45.5, address: generateAddress() },
        { label: "Wallet 2", value: 2000000, percentage: 18.8, address: generateAddress() },
        { label: "Wallet 3", value: 1000000, percentage: 9.7, address: generateAddress() },
        { label: "Wallet 4", value: 800000, percentage: 7.1, address: generateAddress() },
        { label: "Wallet 5", value: 600000, percentage: 5.3, address: generateAddress() },
        { label: "Wallets 6-10", value: 800000, percentage: 7.1, address: generateAddress() },
        { label: "Other Holders", value: 700000, percentage: 6.5, address: generateAddress() },
      ]
    } else {
      return [
        { label: "Top Wallet", value: 2500000, percentage: 25.5, address: generateAddress() },
        { label: "Wallet 2", value: 1800000, percentage: 17.8, address: generateAddress() },
        { label: "Wallet 3", value: 1200000, percentage: 11.7, address: generateAddress() },
        { label: "Wallet 4", value: 900000, percentage: 8.1, address: generateAddress() },
        { label: "Wallet 5", value: 700000, percentage: 6.3, address: generateAddress() },
        { label: "Wallets 6-10", value: 1300000, percentage: 12.1, address: generateAddress() },
        { label: "Other Holders", value: 1900000, percentage: 18.5, address: generateAddress() },
      ]
    }
  }
}

// Update the generateMockAnalysis function to include API data
export function generateMockAnalysis(token: string): TokenAnalysis {
  // Check if we have predefined data for this token
  const upperToken = token.toUpperCase()

  // Handle special cases for test tokens
  if (upperToken === "0x1234567890123456789012345678901234567890") {
    const result = knownTokens["SCAM"] as TokenAnalysis

    // Add mock API data
    result.apiData = {
      coinGecko: mockCoinGeckoData("SCAM"),
      etherscan: mockEtherscanData("0x1234567890123456789012345678901234567890", "SCAM"),
    }

    return result
  }

  // Check for known tokens
  for (const [key, value] of Object.entries(knownTokens)) {
    if (upperToken === key || token === value.tokenInfo?.address) {
      const result = value as TokenAnalysis

      // Add mock API data
      result.apiData = {
        coinGecko: mockCoinGeckoData(key),
        etherscan: mockEtherscanData(value.tokenInfo?.address || "", key),
      }

      return result
    }
  }

  // Generate random data for unknown tokens
  const isHighRisk = Math.random() > 0.7
  const riskScore = isHighRisk ? 70 + Math.floor(Math.random() * 30) : 20 + Math.floor(Math.random() * 50)

  const walletConcentration = isHighRisk ? 70 + Math.random() * 25 : 20 + Math.random() * 40
  const liquidityRatio = isHighRisk ? 1 + Math.random() * 3 : 5 + Math.random() * 20
  const mintingRisk = isHighRisk ? true : Math.random() > 0.7

  // Generate wallet distribution with addresses
  const walletDistribution = generateMockWalletDistribution(upperToken, isHighRisk)

  // Generate red flags
  const redFlags: string[] = []
  if (walletConcentration > 60) {
    redFlags.push("High wallet concentration - few wallets control majority of tokens")
  }
  if (liquidityRatio < 5) {
    redFlags.push("Low liquidity relative to market cap - potential exit scam risk")
  }
  if (mintingRisk) {
    redFlags.push("Unlimited token minting capability detected")
  }
  if (isHighRisk) {
    redFlags.push("Suspicious trading patterns suggest wash trading")
  }
  if (walletConcentration > 70) {
    redFlags.push("Extreme centralization - top wallets control over 70% of supply")
  }

  const tokenAddress = token.startsWith("0x")
    ? token
    : `0x${Math.random().toString(16).substring(2, 42).padStart(40, "0")}`
  const tokenSymbol = token.startsWith("0x") ? token.substring(2, 6).toUpperCase() : token.toUpperCase()
  const tokenName = token.startsWith("0x")
    ? `Token ${token.substring(0, 6)}...${token.substring(token.length - 4)}`
    : `${token.toUpperCase()} Token`

  return {
    riskScore,
    breakdown: {
      walletConcentration: {
        score: Math.round(
          walletConcentration > 80
            ? 100
            : walletConcentration > 60
              ? 75
              : walletConcentration > 40
                ? 50
                : walletConcentration > 20
                  ? 25
                  : 0,
        ),
        topWalletsPercentage: walletConcentration,
        details: `Top 5 wallets hold ${walletConcentration.toFixed(1)}% of total supply`,
      },
      liquidityAnalysis: {
        score: Math.round(
          liquidityRatio < 2 ? 100 : liquidityRatio < 5 ? 75 : liquidityRatio < 10 ? 50 : liquidityRatio < 20 ? 25 : 0,
        ),
        liquidityRatio,
        details: `Liquidity ratio: ${liquidityRatio.toFixed(2)}% (Volume/Market Cap)`,
      },
      supplyDynamics: {
        score: Math.round(mintingRisk ? 80 : 20 + Math.random() * 40),
        reservePercentage: mintingRisk ? 0 : 10 + Math.random() * 50,
        mintingRisk,
        details: mintingRisk
          ? "Unlimited minting detected - high risk"
          : `${(10 + Math.random() * 50).toFixed(1)}% of max supply in reserve`,
      },
      tradingVolume: {
        score: Math.round(isHighRisk ? 60 + Math.random() * 40 : 10 + Math.random() * 40),
        volumeToHoldersRatio: 50 + Math.random() * 200,
        washTradingDetected: isHighRisk,
        details: isHighRisk
          ? "Potential wash trading detected"
          : `Volume per holder: $${(50 + Math.random() * 200).toFixed(2)}`,
      },
    },
    redFlags,
    walletDistribution,
    tokenInfo: {
      name: tokenName,
      symbol: tokenSymbol,
      address: tokenAddress,
      marketCap: isHighRisk ? 1000000 + Math.random() * 10000000 : 10000000 + Math.random() * 1000000000,
      volume24h: isHighRisk ? 100000 + Math.random() * 1000000 : 1000000 + Math.random() * 100000000,
      price: isHighRisk ? 0.00001 + Math.random() * 0.01 : 0.1 + Math.random() * 100,
    },
    apiData: {
      coinGecko: mockCoinGeckoData(tokenSymbol),
      etherscan: mockEtherscanData(tokenAddress, tokenSymbol),
    },
  }
}

// Add mock API data generators
function mockCoinGeckoData(symbol: string) {
  const isStablecoin = ["USDC", "USDT", "DAI", "BUSD"].includes(symbol.toUpperCase())
  const isMainToken = ["ETH", "BTC", "WBTC"].includes(symbol.toUpperCase())

  const price = isStablecoin ? 1 : isMainToken ? 1000 + Math.random() * 40000 : Math.random() * 100
  const marketCap =
    price * (isMainToken ? 1000000000 : isStablecoin ? 50000000000 : 10000000 + Math.random() * 1000000000)
  const volume = marketCap * (0.05 + Math.random() * 0.2)

  return {
    id: symbol.toLowerCase(),
    symbol: symbol.toLowerCase(),
    name: isStablecoin ? `${symbol} Stablecoin` : isMainToken ? symbol : `${symbol} Token`,
    market_cap_rank: isMainToken
      ? Math.floor(Math.random() * 10) + 1
      : isStablecoin
        ? Math.floor(Math.random() * 20) + 1
        : Math.floor(Math.random() * 1000) + 100,
    market_data: {
      current_price: { usd: price },
      market_cap: { usd: marketCap },
      total_volume: { usd: volume },
      high_24h: { usd: price * (1 + Math.random() * 0.1) },
      low_24h: { usd: price * (1 - Math.random() * 0.1) },
      price_change_percentage_24h: Math.random() * 20 - 10,
      circulating_supply: isMainToken
        ? 18000000 + Math.random() * 3000000
        : isStablecoin
          ? 50000000000
          : 100000000 + Math.random() * 900000000,
      total_supply: isMainToken ? 21000000 : isStablecoin ? 50000000000 : 100000000 + Math.random() * 900000000,
      max_supply: isMainToken
        ? 21000000
        : isStablecoin
          ? null
          : Math.random() > 0.5
            ? null
            : 1000000000 + Math.random() * 1000000000,
    },
    genesis_date: isMainToken
      ? "2009-01-03"
      : isStablecoin
        ? "2018-09-10"
        : `202${Math.floor(Math.random() * 3)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
    hashing_algorithm: isMainToken ? "SHA-256" : null,
    block_time_in_minutes: isMainToken ? 10 : null,
    categories: [
      isStablecoin ? "Stablecoins" : isMainToken ? "Layer 1" : Math.random() > 0.5 ? "DeFi" : "Meme",
      Math.random() > 0.7 ? "NFT" : Math.random() > 0.5 ? "Gaming" : "Web3",
    ],
    links: {
      homepage: [`https://${symbol.toLowerCase()}.org`],
      blockchain_site: [`https://etherscan.io/token/${Math.random().toString(16).substring(2, 42)}`],
      official_forum_url: [Math.random() > 0.5 ? `https://forum.${symbol.toLowerCase()}.org` : null],
    },
  }
}

function mockEtherscanData(address: string, symbol: string) {
  return {
    status: "1",
    message: "OK",
    result: [
      {
        contractAddress: address,
        tokenName: `${symbol} Token`,
        symbol: symbol,
        divisor: "1000000000000000000",
        tokenType: "ERC20",
        totalSupply: (100000000 + Math.random() * 900000000).toString(),
        blueCheckmark: Math.random() > 0.7 ? "true" : "false",
        description: `${symbol} is a decentralized cryptocurrency token.`,
        website: `https://${symbol.toLowerCase()}.org`,
        email: `info@${symbol.toLowerCase()}.org`,
        blog: `https://blog.${symbol.toLowerCase()}.org`,
        reddit: `https://reddit.com/r/${symbol}`,
        slack: "",
        facebook: "",
        twitter: `https://twitter.com/${symbol.toLowerCase()}`,
        bitcointalk: "",
        github: `https://github.com/${symbol.toLowerCase()}`,
        telegram: `https://t.me/${symbol.toLowerCase()}`,
        wechat: "",
        linkedin: "",
        discord: `https://discord.gg/${symbol.toLowerCase()}`,
        whitepaper: `https://${symbol.toLowerCase()}.org/whitepaper.pdf`,
        tokenPriceUSD: (Math.random() * 100).toString(),
        holders: Math.floor(1000 + Math.random() * 100000),
        transfers: Math.floor(10000 + Math.random() * 1000000),
      },
    ],
  }
}
