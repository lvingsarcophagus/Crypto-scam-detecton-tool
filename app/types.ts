export interface TokenAnalysis {
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
    coinGecko?: any
    etherscan?: any
    uniswap?: any
    bitquery?: any
    tokenMetrics?: any
  }
  dataQuality?: {
    score: number
    details: string
    sources: {
      coinGecko: boolean
      etherscan: boolean
      uniswap: boolean
      bitquery: boolean
      tokenMetrics: boolean
    }
  }
}
