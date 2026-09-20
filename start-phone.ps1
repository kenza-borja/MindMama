# Start Expo for testing on a physical phone.
#
# Expo's auto-detection picks the wrong adapter on this machine (there are
# several: VirtualBox host-only, Bluetooth, Norton VPN) and falls back to
# 127.0.0.1, which a phone can never reach. This pins it to the current WiFi
# address, looked up fresh each run so a new DHCP lease can't break it.

$ErrorActionPreference = "Stop"

$wifiIp = (Get-NetIPAddress -InterfaceAlias WiFi -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike '169.254.*' } |
    Select-Object -First 1).IPAddress

if (-not $wifiIp) {
    Write-Host "No WiFi IPv4 address found. Is WiFi connected?" -ForegroundColor Red
    exit 1
}

$env:REACT_NATIVE_PACKAGER_HOSTNAME = $wifiIp

Write-Host ""
Write-Host "  Phone should scan:  exp://${wifiIp}:8081" -ForegroundColor Green
Write-Host "  Backend must be up: http://${wifiIp}:4000" -ForegroundColor Green
Write-Host "  Phone must be on the same WiFi, not cellular." -ForegroundColor DarkGray
Write-Host ""

Set-Location "$PSScriptRoot\frontend"
npx expo start --clear
