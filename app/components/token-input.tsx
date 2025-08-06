"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
    <div className="space-y-4">
      <div>
        <Label htmlFor="token-input" className="text-lg font-semibold">
          Analyze Token
        </Label>
        <p className="text-sm text-muted-foreground">
          Enter a token contract address or symbol to get started.
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          id="token-input"
          placeholder="e.g., 0x... or USDC"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && !loading && analyzeToken()}
          className="h-12 text-base"
        />
        <Button
          onClick={analyzeToken}
          disabled={loading || !tokenInput.trim()}
          className="h-12 px-6 font-semibold"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="mockData"
          checked={useMockData}
          onCheckedChange={(checked) => setUseMockData(!!checked)}
        />
        <Label
          htmlFor="mockData"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Use demo data for analysis
        </Label>
      </div>
    </div>
  )
}
