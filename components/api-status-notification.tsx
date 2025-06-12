"use client"

import React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Wifi,
  WifiOff,
  Clock
} from "lucide-react"

interface ApiStatusNotificationProps {
  dataQuality?: {
    score: number
    details: string
    sources: {
      coinGecko: boolean
      etherscan: boolean
      uniswap: boolean
      bitquery: boolean
    }
  }
  isLoading?: boolean
}

export function ApiStatusNotification({ dataQuality, isLoading }: ApiStatusNotificationProps) {
  if (isLoading) {
    return (
      <Alert className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg">
        <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          <div className="flex items-center justify-between">
            <span className="font-medium">Connecting to blockchain APIs...</span>
            <div className="flex space-x-2">
              {["CoinGecko", "Etherscan", "Uniswap", "BitQuery"].map((api, index) => (
                <div key={api} className="flex items-center space-x-1">
                  <div 
                    className={`w-2 h-2 rounded-full animate-pulse`}
                    style={{ 
                      backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'][index],
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                  <span className="text-xs">{api}</span>
                </div>
              ))}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (!dataQuality) {
    return null
  }

  const getAlertStyle = (score: number) => {
    if (score >= 75) return {
      className: "border-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      textColor: "text-green-800 dark:text-green-300"
    }
    if (score >= 50) return {
      className: "border-0 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-lg",
      icon: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
      textColor: "text-yellow-800 dark:text-yellow-300"
    }
    return {
      className: "border-0 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 shadow-lg",
      icon: <XCircle className="h-4 w-4 text-red-600" />,
      textColor: "text-red-800 dark:text-red-300"
    }
  }

  const alertStyle = getAlertStyle(dataQuality.score)
  const connectedApis = Object.values(dataQuality.sources).filter(Boolean).length
  const totalApis = Object.keys(dataQuality.sources).length

  const getQualityMessage = (score: number) => {
    if (score >= 75) return "Excellent data quality - all major APIs connected"
    if (score >= 50) return "Good data quality - some APIs may be unavailable"
    return "Limited data quality - analysis may be incomplete"
  }

  return (
    <Alert className={alertStyle.className}>
      {alertStyle.icon}
      <AlertDescription className={alertStyle.textColor}>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">{getQualityMessage(dataQuality.score)}</span>
            <div className="text-sm mt-1 opacity-90">
              {connectedApis}/{totalApis} APIs connected • Quality Score: {dataQuality.score}%
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {Object.entries(dataQuality.sources).map(([api, connected]) => (
              <Badge 
                key={api}
                variant={connected ? "default" : "outline"}
                className={`text-xs ${connected 
                  ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400" 
                  : "bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-800/30 dark:text-gray-400"
                }`}
              >
                {connected ? <Wifi className="w-3 h-3 mr-1" /> : <WifiOff className="w-3 h-3 mr-1" />}
                {api}
              </Badge>
            ))}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
