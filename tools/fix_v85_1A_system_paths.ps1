# Version 85.1A — System Path Correction

New-Item -ItemType Directory -Force app\static\js\system | Out-Null

$files = @(
    "platform_module_inventory_v85_1.js",
    "loader_path_validator_v85_1.js",
    "panel_id_validator_v85_1.js"
)

foreach ($file in $files) {
    $source = "app\static\js\market\$file"
    $target = "app\static\js\system\$file"

    if (Test-Path $source) {
        Move-Item $source $target -Force
        Write-Host "Moved $file to app\static\js\system"
    } elseif (Test-Path $target) {
        Write-Host "Already correct: $target"
    } else {
        Write-Warning "Missing file: $file"
    }
}

Write-Host "Validation:"
foreach ($file in $files) {
    Write-Host "$file in system:" (Test-Path "app\static\js\system\$file")
}
