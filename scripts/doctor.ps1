Write-Host "Market Intelligence Hub Environment Check"
Write-Host "---------------------------------------"

python --version
git --version

Write-Host ""
Write-Host "Project files:"
Test-Path app\main.py
Test-Path requirements.txt
Test-Path app\core
Test-Path app\engines
Test-Path tests

Write-Host ""
Write-Host "Git status:"
git status --short