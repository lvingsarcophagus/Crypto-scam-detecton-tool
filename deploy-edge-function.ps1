# Deploy Edge Function to Supabase
# This script deploys the enhanced crypto scam detection edge function

Write-Host "🚀 Deploying Crypto Scam Detection Edge Function..." -ForegroundColor Green
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

# Check if logged in to Supabase
Write-Host "🔐 Checking Supabase authentication..." -ForegroundColor Blue
try {
    $authStatus = supabase projects list 2>&1
    if ($authStatus -like "*You need to sign in*" -or $authStatus -like "*Not logged in*") {
        Write-Host "❌ Not logged in to Supabase. Please run:" -ForegroundColor Red
        Write-Host "   supabase login" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Authenticated with Supabase" -ForegroundColor Green
} catch {
    Write-Host "❌ Authentication check failed" -ForegroundColor Red
    exit 1
}

# Check if .env file exists for environment variables
if (Test-Path ".env.local") {
    Write-Host "📋 Loading environment variables from .env.local..." -ForegroundColor Blue
    
    # Read environment variables
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
} else {
    Write-Host "⚠️  No .env.local file found. Some API integrations may not work." -ForegroundColor Yellow
    Write-Host "   Copy .env.edge.example to .env.local and fill in your API keys" -ForegroundColor Yellow
}

# Deploy the edge function
Write-Host "📤 Deploying analyze-token edge function..." -ForegroundColor Blue
try {
    # Deploy the function
    $deployResult = supabase functions deploy analyze-token
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Edge function deployed successfully!" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to deploy edge function" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Deployment failed: $_" -ForegroundColor Red
    exit 1
}

# Set environment variables for the edge function
Write-Host "🔧 Setting edge function environment variables..." -ForegroundColor Blue

$envVars = @(
    "COINGECKO_API_KEY",
    "ETHERSCAN_API_KEY", 
    "BITQUERY_API_KEY",
    "UNISWAP_API_KEY"
)

foreach ($envVar in $envVars) {
    $value = [Environment]::GetEnvironmentVariable($envVar)
    if ($value) {
        try {
            supabase secrets set "${envVar}=${value}"
            Write-Host "✅ Set $envVar" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Failed to set $envVar" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  $envVar not found in environment" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Blue
Write-Host "   1. Update your frontend to use the edge function URL" -ForegroundColor White
Write-Host "   2. Test the function at: https://your-project.supabase.co/functions/v1/analyze-token" -ForegroundColor White
Write-Host "   3. Monitor function logs: supabase functions logs analyze-token" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful Commands:" -ForegroundColor Blue
Write-Host "   View logs:    supabase functions logs analyze-token" -ForegroundColor White
Write-Host "   Test locally: supabase functions serve analyze-token" -ForegroundColor White
Write-Host "   Update secrets: supabase secrets set KEY=value" -ForegroundColor White