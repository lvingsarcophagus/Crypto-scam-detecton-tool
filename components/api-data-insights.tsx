"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  BarChart3, 
  Activity,
  TrendingUp,
  Database
} from "lucide-react"

interface ApiDataInsightsProps {
  apiData: {
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

export function ApiDataInsights({ apiData, dataQuality }: ApiDataInsightsProps) {
  const getStatusIcon = (available: boolean) => 
    available ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />

  const getQualityColor = (score: number) => {
    if (score >= 75) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    if (score >= 50) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
    return `$${value.toFixed(2)}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Data Quality Overview */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700 dark:text-blue-400">
            <Database className="mr-2 h-5 w-5" />
            Data Quality Score
          </CardTitle>
          <CardDescription className="text-lg">
            Real-time API data availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Quality:</span>
              <Badge className={getQualityColor(dataQuality?.score || 0)}>
                {dataQuality?.score || 0}%
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {dataQuality?.details || "No quality data available"}
            </p>            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(dataQuality?.sources?.coinGecko || false)}
                <span className="text-sm">CoinGecko</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(dataQuality?.sources?.etherscan || false)}
                <span className="text-sm">Etherscan</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(dataQuality?.sources?.uniswap || false)}
                <span className="text-sm">Uniswap</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(dataQuality?.sources?.bitquery || false)}
                <span className="text-sm">BitQuery</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(dataQuality?.sources?.tokenMetrics || false)}
                <span className="text-sm">TokenMetrics</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CoinGecko Insights */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700 dark:text-green-400">
            <TrendingUp className="mr-2 h-5 w-5" />
            Market Data (CoinGecko)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiData.coinGecko ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Market Cap:</span>
                <span className="font-semibold">
                  {apiData.coinGecko.market_data?.market_cap?.usd 
                    ? formatMarketCap(apiData.coinGecko.market_data.market_cap.usd)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">24h Volume:</span>
                <span className="font-semibold">
                  {apiData.coinGecko.market_data?.total_volume?.usd 
                    ? formatMarketCap(apiData.coinGecko.market_data.total_volume.usd)
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Price:</span>
                <span className="font-semibold">
                  ${apiData.coinGecko.market_data?.current_price?.usd?.toFixed(6) || "N/A"}
                </span>
              </div>
              {apiData.coinGecko.market_data?.market_cap_rank && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Market Rank:</span>
                  <Badge variant="outline">
                    #{apiData.coinGecko.market_data.market_cap_rank}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No CoinGecko data available</p>
          )}
        </CardContent>
      </Card>

      {/* Uniswap DEX Data */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-800/20">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
            <Activity className="mr-2 h-5 w-5" />
            DEX Liquidity (Uniswap)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiData.uniswap?.data?.token ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Total Liquidity:</span>
                <span className="font-semibold">
                  {apiData.uniswap.data.token.totalLiquidity 
                    ? `$${parseFloat(apiData.uniswap.data.token.totalLiquidity).toLocaleString()}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Transaction Count:</span>
                <span className="font-semibold">
                  {apiData.uniswap.data.token.txCount || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Pools:</span>
                <span className="font-semibold">
                  {apiData.uniswap.data.pools?.length || 0}
                </span>
              </div>
              {apiData.uniswap.data.pools && apiData.uniswap.data.pools.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Top Pool:</p>
                  <div className="text-sm">
                    {apiData.uniswap.data.pools[0].token0?.symbol || "?"} / {apiData.uniswap.data.pools[0].token1?.symbol || "?"}
                    <Badge variant="outline" className="ml-2">
                      TVL: ${parseFloat(apiData.uniswap.data.pools[0].totalValueLockedUSD || 0).toLocaleString()}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No Uniswap liquidity data available</p>
          )}
        </CardContent>
      </Card>

      {/* On-chain Activity */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-800/20">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700 dark:text-orange-400">
            <BarChart3 className="mr-2 h-5 w-5" />
            On-chain Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiData.bitquery?.data?.ethereum ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Recent Transfers:</span>
                <span className="font-semibold">
                  {apiData.bitquery.data.ethereum.transfers?.length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">DEX Trades:</span>
                <span className="font-semibold">
                  {apiData.bitquery.data.ethereum.dexTrades?.length || 0}
                </span>
              </div>
              {apiData.bitquery.data.ethereum.transfers?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Unique Addresses:</p>
                  <div className="text-sm">
                    {new Set([
                      ...apiData.bitquery.data.ethereum.transfers.map((t: any) => t.sender.address),
                      ...apiData.bitquery.data.ethereum.transfers.map((t: any) => t.receiver.address)
                    ]).size} active addresses
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No on-chain activity data available</p>
          )}
        </CardContent>      </Card>

      {/* TokenMetrics Insights */}
      <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-800/20">
        <CardHeader>
          <CardTitle className="flex items-center text-purple-700 dark:text-purple-400">
            <TrendingUp className="mr-2 h-5 w-5" />
            Advanced Analytics (TokenMetrics)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiData.tokenMetrics ? (
            <div className="space-y-3">
              {apiData.tokenMetrics.market_cap && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Market Cap:</span>
                  <span className="font-semibold">
                    {formatMarketCap(apiData.tokenMetrics.market_cap)}
                  </span>
                </div>
              )}
              {apiData.tokenMetrics.market_cap_rank && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Market Rank:</span>
                  <Badge variant="outline" className="text-xs">
                    #{apiData.tokenMetrics.market_cap_rank}
                  </Badge>
                </div>
              )}
              {apiData.tokenMetrics.analytics?.risk_score && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Risk Score:</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      apiData.tokenMetrics.analytics.risk_score > 70 
                        ? 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-400'
                        : apiData.tokenMetrics.analytics.risk_score > 40
                        ? 'border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400'
                        : 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-400'
                    }`}
                  >
                    {apiData.tokenMetrics.analytics.risk_score}/100
                  </Badge>
                </div>
              )}
              {apiData.tokenMetrics.analytics?.liquidity_score && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Liquidity Score:</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      apiData.tokenMetrics.analytics.liquidity_score < 30 
                        ? 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-400'
                        : apiData.tokenMetrics.analytics.liquidity_score < 60
                        ? 'border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400'
                        : 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-400'
                    }`}
                  >
                    {apiData.tokenMetrics.analytics.liquidity_score}/100
                  </Badge>
                </div>
              )}
              {apiData.tokenMetrics.analytics?.volatility_score && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Volatility Score:</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      apiData.tokenMetrics.analytics.volatility_score > 70 
                        ? 'border-red-300 text-red-700 dark:border-red-600 dark:text-red-400'
                        : apiData.tokenMetrics.analytics.volatility_score > 40
                        ? 'border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400'
                        : 'border-green-300 text-green-700 dark:border-green-600 dark:text-green-400'
                    }`}
                  >
                    {apiData.tokenMetrics.analytics.volatility_score}/100
                  </Badge>
                </div>
              )}
              {apiData.tokenMetrics.exchanges && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Exchange Listings:</span>
                  <span className="font-semibold">
                    {apiData.tokenMetrics.exchanges.length} exchanges
                  </span>
                </div>
              )}
              {apiData.tokenMetrics.launch_date && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Launch Date:</span>
                  <span className="font-semibold text-xs">
                    {new Date(apiData.tokenMetrics.launch_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No TokenMetrics data available</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
