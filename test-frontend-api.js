// Test script to simulate frontend API call
async function testFrontendAPI() {
  console.log("Testing frontend API call...");
  
  try {
    console.log("Making request to /api/analyze-token");
    const startTime = Date.now();
    
    const response = await fetch("http://localhost:3000/api/analyze-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: "ETH" }),
    });

    const endTime = Date.now();
    console.log(`Request completed in ${endTime - startTime}ms`);
    
    if (!response.ok) {
      console.error("Response not OK:", response.status, response.statusText);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return;
    }

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    const result = await response.json();
    console.log("Success! Risk Score:", result.riskScore);
    console.log("Token Info:", result.tokenInfo);
    console.log("Data Quality:", result.dataQuality?.score);
    console.log("Has TokenMetrics:", !!result.apiData?.tokenMetrics);
    
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testFrontendAPI();
