# Limpa node_modules, dist e package-lock.json de todos os subprojetos e do root
$folders = @(
    ".",
    "shared",
    "transactions-mfe",
    "dashboard-mfe",
    "shell"
)

foreach ($folder in $folders) {
    $nm = Join-Path $folder "node_modules"
    $dist = Join-Path $folder "dist"
    $plock = Join-Path $folder "package-lock.json"
    if (Test-Path $nm) {
        Write-Host "Removendo $nm"
        Remove-Item -Recurse -Force $nm
    }
    if (Test-Path $dist) {
        Write-Host "Removendo $dist"
        Remove-Item -Recurse -Force $dist
    }
    if (Test-Path $plock) {
        Write-Host "Removendo $plock"
        Remove-Item -Force $plock
    }
    Write-Host "Limpando cache npm em $folder"
    Push-Location $folder
    npm cache clean --force
    Pop-Location
}
Write-Host "Limpeza finalizada."
