@echo off
REM Script para setup do banco de dados local no Windows
REM Copia o template para db.json se não existir

set DB_FILE=db.json
set TEMPLATE_FILE=db.template.json

REM Verifica se o arquivo template existe
if not exist "%TEMPLATE_FILE%" (
    echo ❌ Erro: Arquivo %TEMPLATE_FILE% não encontrado!
    exit /b 1
)

REM Se db.json não existe, cria a partir do template
if not exist "%DB_FILE%" (
    echo 📋 Criando %DB_FILE% a partir do template...
    copy "%TEMPLATE_FILE%" "%DB_FILE%" >nul
    echo ✅ Arquivo %DB_FILE% criado com sucesso!
) else (
    echo ℹ️  Arquivo %DB_FILE% já existe. Mantendo dados locais.
)

echo 🚀 Setup do banco de dados concluído!
