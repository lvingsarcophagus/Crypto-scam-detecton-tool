"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  Download,
  AlertTriangle,
  Copy,
  ExternalLink,
  BarChart3,
  Wallet,
  LineChart,
  Info,
} from "lucide-react"
import { WalletDistributionChart } from "@/components/wallet-distribution-chart"
import { ChartErrorBoundary } from "@/components/chart-error-boundary"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getRiskColor, getRiskLevel, copyToClipboard } from "@/lib/utils"
import { TokenAnalysis } from "@/app/types"
import { APIDataDetails } from "@/components/api-data-details"
import { APIDataInsights } from "@/components/api-data-insights"
import { APIStatusNotification } from "@/components/api-status-notification"

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
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div>
          <h3 className="text-2xl font-semibold">Analyzing Token...</h3>
          <p className="text-muted-foreground">
            Please wait while we gather and analyze the data.
          </p>
        </div>
        <APIStatusNotification />
      </div>
    )
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="max-w-2xl mx-auto"
      >
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <Info className="h-12 w-12 text-gray-400" />
        <div>
          <h3 className="text-2xl font-semibold">Ready to Analyze</h3>
          <p className="text-muted-foreground">
            Enter a token address or symbol to begin your analysis.
          </p>
        </div>
      </div>
    )
  }

  const riskColor = getRiskColor(analysis.riskScore)

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {analysis.tokenInfo.name} ({analysis.tokenInfo.symbol})
          </h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-mono text-sm">
              {analysis.tokenInfo.address}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(analysis.tokenInfo.address)}
              className="h-7 w-7"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <a
              href={`https://etherscan.io/token/${analysis.tokenInfo.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
        <Button onClick={downloadReport}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Risk Score and Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className={`lg:col-span-1 ${riskColor} text-white`}>
          <CardHeader className="text-center">
            <CardDescription className="text-lg text-white/80">
              Overall Risk Score
            </CardDescription>
            <CardTitle className="text-7xl font-bold">
              {analysis.riskScore}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30 text-lg"
            >
              {getRiskLevel(analysis.riskScore)}
            </Badge>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Market Cap</p>
              <p className="text-2xl font-bold">
                ${analysis.tokenInfo.marketCap.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-2xl font-bold">
                ${analysis.tokenInfo.volume24h.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Price</p>
              <p className="text-2xl font-bold">
                ${analysis.tokenInfo.price.toPrecision(4)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Vol/MCap</p>
              <p className="text-2xl font-bold">
                {(
                  (analysis.tokenInfo.volume24h /
                    analysis.tokenInfo.marketCap) *
                  100
                ).toFixed(2)}
                %
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Red Flags */}
      {analysis.redFlags.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Security Alerts ({analysis.redFlags.length})</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside mt-2 space-y-1">
              {analysis.redFlags.map((flag, index) => (
                <li key={index}>{flag}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="wallets">
            <Wallet className="mr-2 h-4 w-4" />
            Wallets
          </TabsTrigger>
          <TabsTrigger value="details">
            <LineChart className="mr-2 h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="api">
            <Info className="mr-2 h-4 w-4" />
            API Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(analysis.breakdown).map(([key, data]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                  <CardDescription>Risk Score: {data.score}/100</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{data.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="wallets" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Holders</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.walletDistribution
                    .slice(0, 5)
                    .map((wallet, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm">
                          <span>{wallet.label}</span>
                          <span className="font-semibold">
                            {wallet.percentage.toFixed(2)}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {wallet.address}
                        </p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartErrorBoundary>
                    <div className="h-[300px]">
                      <WalletDistributionChart
                        data={analysis.walletDistribution}
                      />
                    </div>
                  </ChartErrorBoundary>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <APIDataInsights apiData={analysis.apiData} />
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <APIDataDetails apiData={analysis.apiData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
