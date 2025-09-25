@echo off
REM 🚮 Limpando ByteBank Microfrontend Architecture...
REM 📦 Este script irá remover:
REM    - node_modules, dist e package-lock.json de todos os subprojetos e do root
REM    - Limpar o cache do npm em cada projeto
REM
REM ℹ️  Use este script para garantir um ambiente limpo antes de instalar dependências ou resolver problemas de build.
REM
REM ⏹️  Para interromper, pressione Ctrl+C

setlocal enabledelayedexpansion
set folders=. shared transactions-mfe dashboard-mfe shell

for %%f in (%folders%) do (
    if exist "%%f\node_modules" (
        echo 🧹 Removendo %%f\node_modules
        rmdir /s /q "%%f\node_modules"
    )
    if exist "%%f\dist" (
        echo 🧹 Removendo %%f\dist
        rmdir /s /q "%%f\dist"
    )
    if exist "%%f\package-lock.json" (
        echo 🧹 Removendo %%f\package-lock.json
        del /f /q "%%f\package-lock.json"
    )
    echo 🧹 Limpando cache npm em %%f
    pushd %%f
    call npm cache clean --force
    popd
)

echo ✅ Limpeza finalizada!
echo 💡 Dica: Execute 'npm install' novamente para reinstalar as dependências.
