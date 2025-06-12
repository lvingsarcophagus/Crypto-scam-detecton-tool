// Test script for enhanced API functionality
const testTokens = [
  "ETH",
  "USDC", 
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC contract
  "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT contract
]

async function testEnhancedAPI() {
  console.log("🚀 Testing Enhanced Crypto Scam Detection API")
  console.log("=" .repeat(50))
  
  for (const token of testTokens) {
    console.log(`\n📊 Testing token: ${token}`)
    console.log("-".repeat(30))
    
    try {
      const response = await fetch("http://localhost:3000/api/analyze-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      
      console.log(`✅ Analysis complete for ${token}`)
      console.log(`🎯 Risk Score: ${result.riskScore}/100`)
      console.log(`📈 Data Quality: ${result.dataQuality?.score || 0}%`)
      console.log(`🔍 Details: ${result.dataQuality?.details || 'No details'}`)
      
      if (result.redFlags && result.redFlags.length > 0) {
        console.log(`⚠️  Red Flags (${result.redFlags.length}):`)
        result.redFlags.slice(0, 3).forEach((flag, index) => {
          console.log(`   ${index + 1}. ${flag}`)
        })
        if (result.redFlags.length > 3) {
          console.log(`   ... and ${result.redFlags.length - 3} more`)
        }
      } else {
        console.log(`✅ No red flags detected`)
      }
      
      // Show API data availability
      if (result.apiData) {
        const apiStatus = []
        if (result.apiData.coinGecko) apiStatus.push("CoinGecko ✓")
        if (result.apiData.etherscan) apiStatus.push("Etherscan ✓") 
        if (result.apiData.uniswap) apiStatus.push("Uniswap ✓")
        if (result.apiData.bitquery) apiStatus.push("BitQuery ✓")
        console.log(`🔗 APIs: ${apiStatus.join(", ") || "None available"}`)
      }
      
    } catch (error) {
      console.log(`❌ Error testing ${token}:`, error.message)
    }
  }
  
  console.log(`\n${"=".repeat(50)}`)
  console.log("🎉 Enhanced API testing complete!")
}

// Run the test
testEnhancedAPI().catch(console.error)
