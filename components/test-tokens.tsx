"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TestTokensProps {
  onSelectToken: (token: string) => void
}

export function TestTokens({ onSelectToken }: TestTokensProps) {
  const testTokens = [
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0xA0b86a33E6441b8e8C7C7b0b8e8e8e8e8e8e8e8e",
      expectedRisk: "Very Low",
      description: "Stable, well-distributed token",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      address: "ETH",
      expectedRisk: "Very Low",
      description: "Decentralized, established cryptocurrency",
    },
    {
      name: "Wrapped Bitcoin",
      symbol: "WBTC",
      address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      expectedRisk: "Low",
      description: "Bitcoin on Ethereum, centralized custody",
    },
    {
      name: "Test High Risk",
      symbol: "SCAM",
      address: "0x1234567890123456789012345678901234567890",
      expectedRisk: "Very High",
      description: "Mock token for testing high-risk detection",
    },
  ]

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Test Tokens</CardTitle>
        <CardDescription>Try these sample tokens to test the scam detection system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testTokens.map((token, index) => (
            <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{token.name}</h3>
                  <p className="text-sm text-gray-600">{token.symbol}</p>
                </div>
                <Button size="sm" onClick={() => onSelectToken(token.address)} variant="outline">
                  Test
                </Button>
              </div>
              <p className="text-xs text-gray-500 mb-2">{token.description}</p>
              <div className="text-xs">
                <span className="text-gray-500">Expected Risk: </span>
                <span
                  className={`font-medium ${
                    token.expectedRisk === "Very Low"
                      ? "text-green-600"
                      : token.expectedRisk === "Low"
                        ? "text-yellow-600"
                        : token.expectedRisk === "Very High"
                          ? "text-red-600"
                          : "text-gray-600"
                  }`}
                >
                  {token.expectedRisk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
