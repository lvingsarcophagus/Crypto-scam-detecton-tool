"use client"

import React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface ChartErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ChartErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ChartErrorBoundary extends React.Component<ChartErrorBoundaryProps, ChartErrorBoundaryState> {
  constructor(props: ChartErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ChartErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chart Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="h-80 flex items-center justify-center">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-1">Chart Error</div>
              <div className="text-sm">Unable to render the wallet distribution chart. Please try again.</div>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return this.props.children
  }
}
