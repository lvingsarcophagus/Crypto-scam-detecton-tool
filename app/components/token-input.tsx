"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Search } from "lucide-react"

interface TokenInputProps {
  tokenInput: string
  setTokenInput: (value: string) => void
  loading: boolean
  useMockData: boolean
  setUseMockData: (value: boolean) => void
  analyzeToken: () => void
}

export function TokenInput({
  tokenInput,
  setTokenInput,
  loading,
  useMockData,
  setUseMockData,
  analyzeToken,
}: TokenInputProps) {
  return (
    <Card className="max-w-4xl mx-auto mb-12">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-bold">
          Token Analysis
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Enter any token address or symbol to perform comprehensive security analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <Input
            placeholder="0x... or Token Symbol (ETH, BTC, USDC)"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && analyzeToken()}
            className="flex-1 h-14 text-lg rounded-xl"
          />
          <Button
            onClick={analyzeToken}
            disabled={loading || !tokenInput.trim()}
            className="h-14 px-8 font-semibold rounded-xl text-lg"
          >
            {loading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Search className="mr-2 h-5 w-5" />
            )}
            {loading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mockData"
              checked={useMockData}
              onChange={(e) => setUseMockData(e.target.checked)}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <label
              htmlFor="mockData"
              className="text-sm text-muted-foreground font-medium"
            >
              Use demo data for testing
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
