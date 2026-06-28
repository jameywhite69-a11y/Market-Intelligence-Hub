Write-Host "Cleaning Python cache files..."

Get-ChildItem -Path app,tests -Directory -Recurse -Filter __pycache__ -ErrorAction SilentlyContinue |
    Remove-Item -Recurse -Force

Get-ChildItem -Path . -Directory -Recurse -Filter .pytest_cache -ErrorAction SilentlyContinue |
    Remove-Item -Recurse -Force

Write-Host "Clean complete."