# PowerShell script untuk setup proyek Saung Qur'an Cilegon
Write-Host "🚀 Setup Proyek Saung Qur'an Cilegon" -ForegroundColor Green

# Cek Node.js
$nodeVersion = node --version 2>$null
if ($nodeVersion) {
    Write-Host "✅ Node.js sudah terinstal: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js belum terinstal" -ForegroundColor Red
    Write-Host "📥 Mendownload Node.js..." -ForegroundColor Yellow
    
    try {
        # Download Node.js installer
        $url = "https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi"
        $output = "$env:TEMP\node-installer.msi"
        Invoke-WebRequest -Uri $url -OutFile $output
        
        Write-Host "🔧 Menginstall Node.js..." -ForegroundColor Yellow
        Start-Process msiexec.exe -ArgumentList "/i $output /quiet" -Wait
        
        # Refresh environment variables
        $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH", "User")
        
        Write-Host "✅ Node.js berhasil diinstall" -ForegroundColor Green
        Write-Host "⚠️  Silakan restart PowerShell dan jalankan script ini kembali" -ForegroundColor Yellow
        exit 0
    } catch {
        Write-Host "❌ Gagal menginstall Node.js secara otomatis" -ForegroundColor Red
        Write-Host "📖 Silakan install manual dari https://nodejs.org/" -ForegroundColor Yellow
        exit 1
    }
}

# Install dependencies
Write-Host "📦 Menginstall dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Host "✅ Dependencies berhasil diinstall" -ForegroundColor Green
} catch {
    Write-Host "❌ Gagal menginstall dependencies" -ForegroundColor Red
    exit 1
}

# Start development server
Write-Host "🌐 Menjalankan development server..." -ForegroundColor Green
Write-Host "📍 Aplikasi akan berjalan di http://localhost:5173" -ForegroundColor Cyan
npm run dev
