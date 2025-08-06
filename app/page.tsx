"use client"

import React from "react"
import { useReducer, useEffect } from "react"
import { Header } from "./components/header"
import { AnalysisResults } from "./components/analysis-results"
import { Sidebar } from "./components/sidebar"
import { TokenAnalysis } from "./types"
import { generatePDFReport } from "@/lib/pdf-generator"
import { generateMockAnalysis } from "@/lib/mock-data"
import { API_URL } from "./constants"

type State = {
  tokenInput: string
  analysis: TokenAnalysis | null
  loading: boolean
  error: string
  useMockData: boolean
  darkMode: boolean
  activeTab: string
}

type Action =
  | { type: "SET_TOKEN_INPUT"; payload: string }
  | { type: "SET_ANALYSIS"; payload: TokenAnalysis | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_USE_MOCK_DATA"; payload: boolean }
  | { type: "TOGGLE_DARK_MODE" }
  | { type: "SET_ACTIVE_TAB"; payload: string }
  | { type: "RESET" }

const initialState: State = {
  tokenInput: "",
  analysis: null,
  loading: false,
  error: "",
  useMockData: false,
  darkMode: false,
  activeTab: "overview",
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_TOKEN_INPUT":
      return { ...state, tokenInput: action.payload }
    case "SET_ANALYSIS":
      return { ...state, analysis: action.payload }
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_USE_MOCK_DATA":
      return { ...state, useMockData: action.payload }
    case "TOGGLE_DARK_MODE":
      return { ...state, darkMode: !state.darkMode }
    case "SET_ACTIVE_TAB":
      return { ...state, activeTab: action.payload }
    case "RESET":
      return {
        ...state,
        tokenInput: "",
        analysis: null,
        loading: false,
        error: "",
      }
    default:
      return state
  }
}

export default function CryptoScamDetector() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    tokenInput,
    analysis,
    loading,
    error,
    useMockData,
    darkMode,
    activeTab,
  } = state

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    if (prefersDark) {
      dispatch({ type: "TOGGLE_DARK_MODE" })
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const analyzeToken = async () => {
    if (!tokenInput.trim()) {
      dispatch({
        type: "SET_ERROR",
        payload: "Please enter a valid token address or symbol",
      })
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    dispatch({ type: "SET_ERROR", payload: "" })
    dispatch({ type: "SET_ANALYSIS", payload: null })

    try {
      if (useMockData) {
        const mockAnalysis = generateMockAnalysis(tokenInput)
        setTimeout(() => {
          dispatch({ type: "SET_ANALYSIS", payload: mockAnalysis })
          dispatch({ type: "SET_LOADING", payload: false })
        }, 1500)
        return
      }

      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        throw new Error(
          errorData.error || `HTTP ${response.status}: An error occurred`
        )
      }

      const result = await response.json()
      dispatch({ type: "SET_ANALYSIS", payload: result })
    } catch (err) {
      console.error("Analysis error:", err)
      dispatch({
        type: "SET_ERROR",
        payload:
          err instanceof Error ? err.message : "An unexpected error occurred",
      })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const downloadReport = () => {
    if (!analysis) return
    try {
      generatePDFReport(analysis)
    } catch (err) {
      console.error("PDF generation error:", err)
      dispatch({ type: "SET_ERROR", payload: "Failed to generate PDF report" })
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50">
      <Sidebar
        tokenInput={tokenInput}
        setTokenInput={(value) =>
          dispatch({ type: "SET_TOKEN_INPUT", payload: value })
        }
        loading={loading}
        useMockData={useMockData}
        setUseMockData={(value) =>
          dispatch({ type: "SET_USE_MOCK_DATA", payload: value })
        }
        analyzeToken={analyzeToken}
        onSelectTestToken={(token) =>
          dispatch({ type: "SET_TOKEN_INPUT", payload: token })
        }
        analysis={analysis}
      />
      <main className="flex-1 flex flex-col">
        <Header
          darkMode={darkMode}
          toggleDarkMode={() => dispatch({ type: "TOGGLE_DARK_MODE" })}
        />
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnalysisResults
            analysis={analysis}
            loading={loading}
            error={error}
            activeTab={activeTab}
            setActiveTab={(value) =>
              dispatch({ type: "SET_ACTIVE_TAB", payload: value })
            }
            downloadReport={downloadReport}
          />
        </div>
      </main>
    </div>
  )
}
