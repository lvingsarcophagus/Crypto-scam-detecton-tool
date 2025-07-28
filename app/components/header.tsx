"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Zap, Shield, Target } from "lucide-react"

interface HeaderProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <div className="text-center mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex-1">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-blue-500 to-indigo-600 bg-clip-text text-transparent mb-4">
            CryptoGuard
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            AI-Powered Crypto Scam Detection
          </p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleDarkMode}
          className="ml-4 rounded-full w-12 h-12"
        >
          {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
      </div>

      {/* Feature badges */}
      <div className="flex flex-wrap justify-center gap-4">
        <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
          <Zap className="h-4 w-4 mr-2" />
          Real-time Analysis
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
          <Shield className="h-4 w-4 mr-2" />
          Multi-API Integration
        </Badge>
        <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold">
          <Target className="h-4 w-4 mr-2" />
          Advanced Risk Scoring
        </Badge>
      </div>
    </div>
  )
}
