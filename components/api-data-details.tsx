"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Info, AlertTriangle } from "lucide-react"

interface ApiDataDetailsProps {
  tokenInfo: any
  apiData: {
    coinGecko?: any
    etherscan?: any
    uniswap?: any
    bitquery?: any
  }
}

export function ApiDataDetails({ tokenInfo, apiData }: ApiDataDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const formatDate = (timestamp: number | string) => {
    if (!timestamp) return "N/A"
    const date = new Date(timestamp)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const renderCoinGeckoData = () => {
    const data = apiData.coinGecko

    if (!data) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No CoinGecko data available</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* Market Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Market Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap Rank</div>
                <div className="text-sm font-medium">{data.market_cap_rank || "N/A"}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap</div>
                <div className="text-sm font-medium">
                  ${data.market_data?.market_cap?.usd?.toLocaleString() || "N/A"}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">24h Volume</div>
                <div className="text-sm font-medium">
                  ${data.market_data?.total_volume?.usd?.toLocaleString() || "N/A"}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">24h High</div>
                <div className="text-sm font-medium">${data.market_data?.high_24h?.usd?.toLocaleString() || "N/A"}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">24h Low</div>
                <div className="text-sm font-medium">${data.market_data?.low_24h?.usd?.toLocaleString() || "N/A"}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Price Change (24h)</div>
                <div
                  className={`text-sm font-medium ${
                    data.market_data?.price_change_percentage_24h > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {data.market_data?.price_change_percentage_24h?.toFixed(2) || "0"}%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Supply Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Circulating Supply</div>
                <div className="text-sm font-medium">
                  {data.market_data?.circulating_supply?.toLocaleString() || "N/A"}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Total Supply</div>
                <div className="text-sm font-medium">{data.market_data?.total_supply?.toLocaleString() || "N/A"}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Max Supply</div>
                <div className="text-sm font-medium">
                  {data.market_data?.max_supply ? data.market_data.max_supply.toLocaleString() : "Unlimited"}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Genesis Date</div>
                <div className="text-sm font-medium">{data.genesis_date || "N/A"}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Hashing Algorithm</div>
                <div className="text-sm font-medium">{data.hashing_algorithm || "N/A"}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Block Time (minutes)</div>
                <div className="text-sm font-medium">{data.block_time_in_minutes || "N/A"}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Categories</div>
                <div className="flex flex-wrap gap-1">
                  {data.categories && data.categories.length > 0 ? (
                    data.categories.map((category: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm">N/A</span>
                  )}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Links</div>
                <div className="flex flex-wrap gap-2">
                  {data.links?.homepage?.[0] && (
                    <a
                      href={data.links.homepage[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Website <ExternalLink size={12} />
                    </a>
                  )}

                  {data.links?.blockchain_site?.[0] && (
                    <a
                      href={data.links.blockchain_site[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Explorer <ExternalLink size={12} />
                    </a>
                  )}

                  {data.links?.official_forum_url?.[0] && (
                    <a
                      href={data.links.official_forum_url[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forum <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderEtherscanData = () => {
    const data = apiData.etherscan

    if (!data || !data.result || data.result.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No Etherscan data available</p>
        </div>
      )
    }

    const tokenInfo = data.result[0]

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contract Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Contract Address</div>
                <div className="text-sm font-medium font-mono break-all">{tokenInfo.contractAddress}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Token Name</div>
                <div className="text-sm font-medium">{tokenInfo.tokenName}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Symbol</div>
                <div className="text-sm font-medium">{tokenInfo.symbol}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Decimals</div>
                <div className="text-sm font-medium">{tokenInfo.divisor || tokenInfo.decimals || "N/A"}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Supply</div>
                <div className="text-sm font-medium">
                  {Number.parseFloat(tokenInfo.totalSupply || "0").toLocaleString()} {tokenInfo.symbol}
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Holders</div>
                <div className="text-sm font-medium">{tokenInfo.holders?.toLocaleString() || "N/A"}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Transfers</div>
                <div className="text-sm font-medium">{tokenInfo.transfers?.toLocaleString() || "N/A"}</div>

                <div className="text-sm text-gray-500 dark:text-gray-400">Links</div>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://etherscan.io/token/${tokenInfo.contractAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View on Etherscan <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {tokenInfo.tokenPriceUSD && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Price Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">Price (USD)</div>
                <div className="text-sm font-medium">${Number.parseFloat(tokenInfo.tokenPriceUSD).toFixed(6)}</div>

                {tokenInfo.tokenPriceETH && (
                  <>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Price (ETH)</div>
                    <div className="text-sm font-medium">
                      {Number.parseFloat(tokenInfo.tokenPriceETH).toFixed(8)} ETH
                    </div>
                  </>
                )}

                {tokenInfo.marketCapUSD && (
                  <>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Market Cap (USD)</div>
                    <div className="text-sm font-medium">
                      ${Number.parseFloat(tokenInfo.marketCapUSD).toLocaleString()}
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderUniswapData = () => {
    const data = apiData.uniswap

    if (!data) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No Uniswap data available</p>
        </div>
      )
    }

    // Placeholder for Uniswap data
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Liquidity Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <Info className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>Uniswap data integration coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderBitqueryData = () => {
    const data = apiData.bitquery

    if (!data) {
      return (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="mx-auto h-8 w-8 mb-2 opacity-50" />
          <p>No BitQuery data available</p>
        </div>
      )
    }

    // Placeholder for BitQuery data
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transaction Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <Info className="mx-auto h-8 w-8 mb-2 opacity-50" />
              <p>BitQuery data integration coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed API Data</CardTitle>
        <CardDescription>Raw data from various blockchain APIs</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">CoinGecko</TabsTrigger>
            <TabsTrigger value="etherscan">Etherscan</TabsTrigger>
            <TabsTrigger value="uniswap">Uniswap</TabsTrigger>
            <TabsTrigger value="bitquery">BitQuery</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {renderCoinGeckoData()}
          </TabsContent>
          <TabsContent value="etherscan" className="space-y-4">
            {renderEtherscanData()}
          </TabsContent>
          <TabsContent value="uniswap" className="space-y-4">
            {renderUniswapData()}
          </TabsContent>
          <TabsContent value="bitquery" className="space-y-4">
            {renderBitqueryData()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
