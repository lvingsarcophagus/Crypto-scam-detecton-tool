// Comprehensive test to verify the crypto scam detection tool
console.log("🚀 Starting Crypto Scam Detection Tool Test Suite");

const testTokens = ["ETH", "USDC", "UNI", "SHIB", "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"];

async function testToken(token) {
  console.log(`\n📊 Testing token: ${token}`);
  
  try {
    const startTime = Date.now();
    
    const response = await fetch("http://localhost:3000/api/analyze-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });

    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (!response.ok) {
      console.error(`❌ ${token}: HTTP ${response.status}`);
      return false;
    }

    const result = await response.json();
    
    console.log(`✅ ${token}: Risk Score ${result.riskScore} (${duration}ms)`);
    console.log(`   💰 Market Cap: $${result.tokenInfo.marketCap.toLocaleString()}`);
    console.log(`   📈 Volume 24h: $${result.tokenInfo.volume24h.toLocaleString()}`);
    console.log(`   🔍 Data Quality: ${result.dataQuality?.score}%`);
    console.log(`   🏢 CoinGecko: ${result.apiData?.coinGecko ? '✅' : '❌'}`);
    console.log(`   📊 TokenMetrics: ${result.apiData?.tokenMetrics ? '✅' : '❌'}`);
    console.log(`   🚩 Red Flags: ${result.redFlags?.length || 0}`);
    
    return true;
  } catch (error) {
    console.error(`❌ ${token}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log("🔥 Testing Real API Integration with Enhanced TokenMetrics");
  
  let successCount = 0;
  const totalTests = testTokens.length;
  
  for (const token of testTokens) {
    const success = await testToken(token);
    if (success) successCount++;
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📋 Test Results: ${successCount}/${totalTests} tests passed`);
  
  if (successCount === totalTests) {
    console.log("🎉 All tests passed! API is working correctly with real data integration.");
  } else {
    console.log("⚠️  Some tests failed. Check the logs above for details.");
  }
}

runTests().catch(console.error);
