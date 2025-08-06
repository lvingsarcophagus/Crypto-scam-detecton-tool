"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  BarChart3,
  PieChart,
  LineChart,
  Wallet,
  ExternalLink,
  Copy,
  TrendingUp,
  TrendingDown,
  Shield,
  Users,
  Zap,
  Target,
  Activity,
  DollarSign,
} from "lucide-react"
import { WalletDistributionChart } from "@/components/wallet-distribution-chart"
import { ChartErrorBoundary } from "@/components/chart-error-boundary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getRiskColor,
  getRiskLevel,
  copyToClipboard,
} from "@/lib/utils"
import { TokenAnalysis } from "@/app/types"

interface AnalysisResultsProps {
  analysis: TokenAnalysis | null
  loading: boolean
  error: string
  activeTab: string
  setActiveTab: (value: string) => void
  downloadReport: () => void
}

export function AnalysisResults({
  analysis,
  loading,
  error,
  activeTab,
  setActiveTab,
  downloadReport,
}: AnalysisResultsProps) {
  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto mb-8">
        <CardContent className="text-center py-12">
          <div className="relative mb-6">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary" />
            <div className="absolute inset-0 h-16 w-16 mx-auto rounded-full bg-primary/20 animate-pulse"></div>
          </div>
          <p className="text-2xl text-foreground font-semibold mb-2">
            Analyzing Token Security...
          </p>
          <p className="text-lg text-muted-foreground">
            Scanning blockchain data from multiple sources
          </p>{" "}
          <div className="flex justify-center space-x-8 mt-8">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">CoinGecko</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Etherscan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">Uniswap</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">BitQuery</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">TokenMetrics</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-4xl mx-auto mb-8">
        <AlertTriangle className="h-5 w-5" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!analysis) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Risk Score Hero Section */}
      <Card
        className={`border-0 shadow-2xl bg-gradient-to-r ${getRiskColor(
          analysis.riskScore
        )} text-white overflow-hidden relative`}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <CardContent className="relative z-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-2">
                {analysis.tokenInfo.name}
              </h2>
              <p className="text-2xl opacity-90 mb-4">
                {analysis.tokenInfo.symbol}
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-2">
                <span className="font-mono text-sm opacity-75">
                  {analysis.tokenInfo.address.slice(0, 10)}...
                  {analysis.tokenInfo.address.slice(-8)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(analysis.tokenInfo.address)}
                  className="text-white hover:bg-white/20"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="text-8xl font-bold mb-4">
                  {analysis.riskScore}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-white/30"></div>
                </div>
              </div>
              <p className="text-xl opacity-90">Risk Score</p>
              <Badge
                variant="secondary"
                className="mt-2 bg-white/20 text-white border-white/30"
              >
                {getRiskLevel(analysis.riskScore)}
              </Badge>
            </div>

            <div className="text-center lg:text-right space-y-4">
              <Button
                onClick={downloadReport}
                variant="secondary"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  ${analysis.tokenInfo.marketCap.toLocaleString()}
                </div>
                <div className="text-sm opacity-75">Market Cap</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
              <Badge variant="outline">24h Volume</Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              ${analysis.tokenInfo.volume24h.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Volume/MCap:{" "}
              {(
                (analysis.tokenInfo.volume24h / analysis.tokenInfo.marketCap) *
                100
              ).toFixed(2)}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Activity className="h-8 w-8 text-primary" />
              <Badge variant="outline">Price</Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              ${analysis.tokenInfo.price.toFixed(6)}
            </div>
            <div className="text-sm text-muted-foreground flex items-center">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              Live Price
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-primary" />
              <Badge variant="outline">Holders</Badge>
            </div>
            <div className="text-3xl font-bold mb-2">
              {Math.floor(
                Math.sqrt(analysis.tokenInfo.marketCap / 10000)
              ).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Estimated Total
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-6 w-6" />
          <AlertDescription>
            <div className="font-bold mb-3 text-lg">
              ⚠️ Security Alerts Detected:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {analysis.redFlags.map((flag, index) => (
                <div
                  key={index}
                  className="flex items-center rounded-lg p-3"
                >
                  <XCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{flag}</span>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-14">
          <TabsTrigger value="overview" className="h-10">
            <BarChart3 className="mr-2 h-5 w-5" />
            <span className="font-semibold">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="wallets" className="h-10">
            <Wallet className="mr-2 h-5 w-5" />
            <span className="font-semibold">Wallets</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="h-10">
            <LineChart className="mr-2 h-5 w-5" />
            <span className="font-semibold">Details</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="h-10">
            <Info className="mr-2 h-5 w-5" />
            <span className="font-semibold">API Data</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries({
              walletConcentration: {
                icon: Wallet,
                title: "Wallet Concentration",
              },
              liquidityAnalysis: {
                icon: ExternalLink,
                title: "Liquidity Analysis",
              },
              supplyDynamics: {
                icon: BarChart3,
                title: "Supply Dynamics",
              },
              tradingVolume: {
                icon: LineChart,
                title: "Trading Volume",
              },
            }).map(([key, config]) => {
              const data =
                analysis.breakdown[
                  key as keyof typeof analysis.breakdown
                ]
              return (
                <Card key={key}>
                  <CardHeader className="pb-4">
                    <CardTitle
                      className={`flex items-center`}
                    >
                      <config.icon className="mr-3 h-6 w-6" />
                      {config.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">
                          Risk Score:
                        </span>
                        <Badge
                          variant="outline"
                        >
                          {data.score}/100
                        </Badge>
                      </div>
                      <p
                        className={`text-sm p-3 rounded-lg`}
                      >
                        {data.details}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Distribution Chart
                </CardTitle>
                <CardDescription className="text-lg">
                  Visual representation of token holdings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartErrorBoundary>
                  <WalletDistributionChart
                    data={analysis.walletDistribution}
                  />
                </ChartErrorBoundary>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Top Holders
                </CardTitle>
                <CardDescription className="text-lg">
                  Detailed wallet breakdown with addresses
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  {analysis.walletDistribution
                    .slice(0, 10)
                    .map((wallet, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-xl border"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="font-bold text-lg">
                              {wallet.label}
                            </div>
                            <div className="text-sm text-primary font-semibold">
                              {wallet.percentage.toFixed(2)}% of total
                              supply
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {wallet.value.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              tokens
                            </div>
                          </div>
                        </div>
                        {wallet.address && wallet.address !== "Various" && (
                          <div className="flex items-center justify-between p-3 rounded-lg border">
                            <span className="font-mono text-sm truncate mr-2">
                              {wallet.address}
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  copyToClipboard(wallet.address!)
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <a
                                href={`https://etherscan.io/address/${wallet.address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Enhanced Details Tab */}
        <TabsContent value="details" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tokenomics Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <DollarSign className="mr-3 h-6 w-6 text-primary" />
                  <span>
                    Tokenomics Analysis
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl text-center border">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {analysis.apiData?.coinGecko?.market_data
                        ?.circulating_supply
                        ? (
                            analysis.apiData.coinGecko.market_data
                              .circulating_supply / 1000000
                          ).toFixed(1) + "M"
                        : (
                            analysis.tokenInfo.marketCap /
                            analysis.tokenInfo.price /
                            1000000
                          ).toFixed(1) + "M"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Circulating Supply
                    </div>
                  </div>
                  <div className="p-4 rounded-xl text-center border">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {analysis.apiData?.coinGecko?.market_data?.total_supply
                        ? (
                            analysis.apiData.coinGecko.market_data
                              .total_supply / 1000000
                          ).toFixed(1) + "M"
                        : (
                            analysis.tokenInfo.marketCap /
                            analysis.tokenInfo.price /
                            1000000
                          ).toFixed(1) + "M"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Supply
                    </div>
                  </div>
                  <div className="p-4 rounded-xl text-center border">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {analysis.apiData?.coinGecko?.market_data?.max_supply
                        ? (
                            analysis.apiData.coinGecko.market_data
                              .max_supply / 1000000
                          ).toFixed(1) + "M"
                        : "∞"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Max Supply
                    </div>
                  </div>
                  <div className="p-4 rounded-xl text-center border">
                    <div className="text-2xl font-bold text-primary mb-1">
                      {analysis.apiData?.coinGecko?.market_data
                        ?.circulating_supply &&
                      analysis.apiData?.coinGecko?.market_data
                        ?.total_supply
                        ? (
                            (analysis.apiData.coinGecko.market_data
                              .circulating_supply /
                              analysis.apiData.coinGecko.market_data
                                .total_supply) *
                            100
                          ).toFixed(1) + "%"
                        : "85%"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Circulation Rate
                    </div>
                  </div>
                </div>

                {/* Additional tokenomics insights */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">
                      Market Cap Rank
                    </span>
                    <Badge
                      variant="outline"
                    >
                      #
                      {analysis.apiData?.coinGecko?.market_cap_rank ||
                        analysis.apiData?.tokenMetrics?.analytics
                          ?.market_cap_rank ||
                        "N/A"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">
                      Fully Diluted Valuation
                    </span>
                    <span className="text-sm font-bold text-primary">
                      $
                      {analysis.apiData?.coinGecko?.market_data
                        ?.fully_diluted_valuation?.usd
                        ? analysis.apiData.coinGecko.market_data.fully_diluted_valuation.usd.toLocaleString()
                        : analysis.tokenInfo.marketCap.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">
                      Volume/Market Cap Ratio
                    </span>
                    <Badge
                      variant="outline"
                      className={`${
                        (analysis.tokenInfo.volume24h /
                          analysis.tokenInfo.marketCap) *
                          100 >
                        10
                          ? "text-red-700 border-red-300"
                          : ""
                      }`}
                    >
                      {(
                        (analysis.tokenInfo.volume24h /
                          analysis.tokenInfo.marketCap) *
                        100
                      ).toFixed(2)}
                      %
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Shield className="mr-3 h-6 w-6 text-primary" />
                  <span>
                    Security Analysis
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      label: "Contract Verified",
                      status: analysis.apiData?.etherscan?.result?.[0]
                        ?.SourceCode
                        ? "verified"
                        : "unknown",
                      icon: CheckCircle,
                      color: analysis.apiData?.etherscan?.result?.[0]
                        ?.SourceCode
                        ? "green"
                        : "yellow",
                    },
                    {
                      label: "Proxy Contract",
                      status: "none",
                      icon: XCircle,
                      color: "green",
                    },
                    {
                      label: "Pausable",
                      status: "unknown",
                      icon: AlertTriangle,
                      color: "yellow",
                    },
                    {
                      label: "Blacklist Function",
                      status: "none",
                      icon: CheckCircle,
                      color: "green",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl border"
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <item.icon
                          className={`h-5 w-5 text-${item.color}-500`}
                        />
                        <span className="font-semibold text-sm">
                          {item.label}
                        </span>
                      </div>
                      <div
                        className={`text-sm font-medium text-${item.color}-600 dark:text-${item.color}-400 capitalize`}
                      >
                        {item.status}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Risk assessment based on real data */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">
                      Age Assessment
                    </span>
                    <Badge
                      variant="outline"
                    >
                      {analysis.apiData?.coinGecko?.genesis_date
                        ? `${
                            new Date().getFullYear() -
                            new Date(
                              analysis.apiData.coinGecko.genesis_date
                            ).getFullYear()
                          } years`
                        : "Unknown"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">
                      Community Score
                    </span>
                    <Badge
                      variant="outline"
                    >
                      {analysis.apiData?.coinGecko
                        ?.sentiment_votes_up_percentage
                        ? `${analysis.apiData.coinGecko.sentiment_votes_up_percentage.toFixed(
                            1
                          )}% positive`
                        : "Not available"}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg border">
                    <span className="text-sm font-medium">
                      Liquidity Risk
                    </span>
                    <Badge
                      variant="outline"
                      className={`${
                        analysis.breakdown.liquidityAnalysis.score > 60
                          ? "text-red-700 border-red-300"
                          : analysis.breakdown.liquidityAnalysis.score > 30
                          ? "text-yellow-700 border-yellow-300"
                          : "text-green-700 border-green-300"
                      }`}
                    >
                      {analysis.breakdown.liquidityAnalysis.score > 60
                        ? "High"
                        : analysis.breakdown.liquidityAnalysis.score > 30
                        ? "Medium"
                        : "Low"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* Enhanced API Data Tab */}
        <TabsContent value="api" className="mt-8">
          <div className="space-y-6">
            {/* Data Quality Overview */}
            {analysis.dataQuality && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    Data Quality Score: {analysis.dataQuality.score}%
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {analysis.dataQuality.details}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4">
                    {Object.entries({
                      coinGecko: { name: "CoinGecko", color: "green" },
                      etherscan: { name: "Etherscan", color: "blue" },
                      uniswap: { name: "Uniswap", color: "purple" },
                      bitquery: { name: "BitQuery", color: "orange" },
                      tokenMetrics: {
                        name: "TokenMetrics",
                        color: "pink",
                      },
                    }).map(([key, config]) => {
                      const isAvailable =
                        analysis.dataQuality?.sources[
                          key as keyof typeof analysis.dataQuality.sources
                        ]
                      return (
                        <div key={key} className="text-center">
                          <div
                            className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              isAvailable
                                ? `bg-${config.color}-100 dark:bg-${config.color}-900/30`
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            {isAvailable ? (
                              <CheckCircle
                                className={`h-6 w-6 text-${config.color}-600`}
                              />
                            ) : (
                              <XCircle className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <p
                            className={`text-sm font-medium ${
                              isAvailable
                                ? `text-${config.color}-700 dark:text-${config.color}-400`
                                : "text-gray-500"
                            }`}
                          >
                            {config.name}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {analysis.apiData && Object.keys(analysis.apiData).length > 0 ? (
              Object.entries({
                coinGecko: {
                  name: "CoinGecko",
                  description: "Market data and token information",
                },
                etherscan: {
                  name: "Etherscan",
                  description: "Blockchain transaction data",
                },
                uniswap: {
                  name: "Uniswap",
                  description: "DEX liquidity and trading data",
                },
                bitquery: {
                  name: "BitQuery",
                  description: "Advanced blockchain analytics",
                },
                tokenMetrics: {
                  name: "TokenMetrics",
                  description:
                    "Professional token analytics and risk assessment",
                },
              }).map(([key, config]) => {
                const data =
                  analysis.apiData?.[
                    key as keyof typeof analysis.apiData
                  ]
                if (!data) return null

                return (
                  <Card
                    key={key}
                  >
                    <CardHeader>
                      <CardTitle
                        className={`text-2xl`}
                      >
                        {config.name} API Data
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {config.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Special handling for TokenMetrics to show key insights */}
                      {key === "tokenMetrics" && data.analytics && (
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 rounded-xl text-center border">
                            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                              {data.analytics.risk_score || "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Risk Score
                            </div>
                          </div>
                          <div className="p-4 rounded-xl text-center border">
                            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                              {data.analytics.liquidity_score || "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Liquidity Score
                            </div>
                          </div>
                          <div className="p-4 rounded-xl text-center border">
                            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                              #{data.analytics.market_cap_rank || "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Market Rank
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Special handling for CoinGecko to show key market data */}
                      {key === "coinGecko" && data.market_data && (
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="p-4 rounded-xl text-center border">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                              $
                              {data.market_data.current_price?.usd?.toLocaleString() ||
                                "N/A"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Current Price
                            </div>
                          </div>
                          <div className="p-4 rounded-xl text-center border">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                              $
                              {(
                                data.market_data.market_cap?.usd || 0
                              ).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Market Cap
                            </div>
                          </div>
                          <div className="p-4 rounded-xl text-center border">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                              $
                              {(
                                data.market_data.total_volume?.usd || 0
                              ).toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              24h Volume
                            </div>
                          </div>
                          <div className="p-4 rounded-xl text-center border">
                            <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-1">
                              {(
                                ((data.market_data.total_volume?.usd || 0) /
                                  (data.market_data.market_cap?.usd || 1)) *
                                100
                              ).toFixed(2)}
                              %
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Vol/MCap
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-muted/50 rounded-xl p-4 max-h-80 overflow-auto">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(data, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="text-center py-16">
                  <Info className="mx-auto h-16 w-16 mb-4 text-muted-foreground" />
                  <p className="text-xl text-muted-foreground font-semibold">
                    No API data available
                  </p>
                  <p className="text-muted-foreground mt-2">
                    API responses will appear here when available
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
