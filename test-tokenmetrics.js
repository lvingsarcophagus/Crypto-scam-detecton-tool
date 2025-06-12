// Test TokenMetrics API integration with Supabase Edge Function
const supabaseUrl = "https://svksnpggavpxxwxfahcg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3NucGdnYXZweHh3eGZhaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIzNjksImV4cCI6MjA2NTI0ODM2OX0.GANw-ksuf4bb6V9OxpIdh6EdZ0320ml3tM5eZ4ttIeA";

async function testSupabaseFunction() {
  console.log("🧪 Testing Supabase Edge Function...");
  
  try {
    const testToken = "ETH"; // Use a simple token for testing
    console.log(`Testing with token: ${testToken}`);
    
    const response = await fetch(`${supabaseUrl}/functions/v1/analyze-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ token: testToken }),
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Function failed:");
      console.error("Status:", response.status);
      console.error("Response:", errorText);
      return;
    }

    const result = await response.json();
    console.log("✅ Function successful!");
    console.log("Response:", JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error("❌ Network error:", error.message);
  }
}

testSupabaseFunction();
