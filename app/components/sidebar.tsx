"use client"

import { TestTokens } from "@/components/test-tokens"
import { TokenInput } from "./token-input"
import { ShieldCheck } from "lucide-react"

interface SidebarProps {
  tokenInput: string
  setTokenInput: (value: string) => void
  loading: boolean
  useMockData: boolean
  setUseMockData: (value: boolean) => void
  analyzeToken: () => void
  onSelectTestToken: (token: string) => void
  analysis: any
}

export function Sidebar({
  tokenInput,
  setTokenInput,
  loading,
  useMockData,
  setUseMockData,
  analyzeToken,
  onSelectTestToken,
  analysis,
}: SidebarProps) {
  return (
    <aside className="w-full lg:w-[420px] lg:h-screen lg:overflow-y-auto p-6 lg:p-8 bg-gray-50/50 dark:bg-gray-900/50 border-r border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
          Scam Detector
        </h1>
      </div>

      <div className="space-y-8">
        <TokenInput
          tokenInput={tokenInput}
          setTokenInput={setTokenInput}
          loading={loading}
          useMockData={useMockData}
          setUseMockData={setUseMockData}
          analyzeToken={analyzeToken}
        />

        {!analysis && <TestTokens onSelectToken={onSelectTestToken} />}
      </div>
    </aside>
  )
}
