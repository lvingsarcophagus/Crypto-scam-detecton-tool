# Test Edge Function Locally
# This script serves and tests the edge function locally before deployment

Write-Host "🧪 Testing Edge Function Locally..." -ForegroundColor Green
Write-Host ""

# Check if Supabase CLI is installed
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI found: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "   npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Load environment variables
if (Test-Path ".env.local") {
    Write-Host "📋 Loading environment variables..." -ForegroundColor Blue
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match "^([^=]+)=(.*)$") {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($name -ne "" -and !$name.StartsWith("#")) {
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }
    Write-Host "✅ Environment variables loaded" -ForegroundColor Green
}

# Start local development server
Write-Host "🚀 Starting local edge function server..." -ForegroundColor Blue
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

try {
    # Start the function server
    supabase functions serve analyze-token --env-file .env.local
} catch {
    Write-Host "❌ Failed to start local server: $_" -ForegroundColor Red
    exit 1
}
