// Test script to check if the Supabase edge function is working
const supabaseUrl = "https://svksnpggavpxxwxfahcg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3NucGdnYXZweHh3eGZhaGNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NzIzNjksImV4cCI6MjA2NTI0ODM2OX0.GANw-ksuf4bb6V9OxpIdh6EdZ0320ml3tM5eZ4ttIeA"

// Test with a well-known token address (USDC)
const testToken = "0xA0b86a33E6441039e0A5E0BF77Af6C12c8b35F3D" // Sample ETH address

async function testSupabaseFunction() {
  console.log("Testing Supabase Edge Function...")
  console.log("URL:", `${supabaseUrl}/functions/v1/analyze-token`)
  console.log("Token:", testToken)
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/analyze-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ token: testToken }),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Error response:", errorText)
      return
    }

    const result = await response.json()
    console.log("Success! Result:", JSON.stringify(result, null, 2))
    
  } catch (error) {
    console.error("Request failed:", error)
  }
}

testSupabaseFunction()
