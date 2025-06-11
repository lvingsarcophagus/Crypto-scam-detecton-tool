"use client"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"

ChartJS.register(ArcElement, Tooltip, Legend)

interface WalletDistributionData {
  label: string
  value: number
  percentage: number
  address?: string
}

interface WalletDistributionChartProps {
  data: WalletDistributionData[]
}

export function WalletDistributionChart({ data }: WalletDistributionChartProps) {
  // Add data validation and fallback
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-lg font-medium">No distribution data available</div>
          <div className="text-sm">Wallet distribution data could not be loaded</div>
        </div>
      </div>
    )
  }

  // Ensure all data items have required properties
  const validData = data.filter(
    (item) => item && typeof item.label === "string" && typeof item.percentage === "number" && !isNaN(item.percentage),
  )

  if (validData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <div className="text-lg font-medium">Invalid distribution data</div>
          <div className="text-sm">The wallet distribution data format is invalid</div>
        </div>
      </div>
    )
  }

  const chartData = {
    labels: validData.map((item) => item.label),
    datasets: [
      {
        data: validData.map((item) => item.percentage),
        backgroundColor: [
          "#ef4444", // red-500
          "#f97316", // orange-500
          "#eab308", // yellow-500
          "#22c55e", // green-500
          "#3b82f6", // blue-500
          "#8b5cf6", // violet-500
          "#ec4899", // pink-500
          "#6b7280", // gray-500
          "#14b8a6", // teal-500
          "#f59e0b", // amber-500
        ],
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "Unknown"
            const value = context.parsed || 0
            return `${label}: ${value.toFixed(2)}%`
          },
        },
      },
    },
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("Address copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="space-y-4">
      <div className="h-64">
        <Pie data={chartData} options={options} />
      </div>

      <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-2">
        {validData.map((wallet, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor:
                    chartData.datasets[0].backgroundColor[index % chartData.datasets[0].backgroundColor.length],
                }}
              />
              <div>
                <div className="font-medium text-sm">{wallet.label}</div>
                {wallet.address && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono flex items-center">
                    {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                    <button
                      onClick={() => copyToClipboard(wallet.address || "")}
                      className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-sm font-medium">{wallet.percentage.toFixed(2)}%</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{wallet.value.toLocaleString()} tokens</div>
              </div>
              <Badge
                variant="outline"
                className={`${
                  index === 0
                    ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                    : index < 3
                      ? "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300"
                      : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                }`}
              >
                #{index + 1}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
