#!/bin/bash

# 🚮 Limpando ByteBank Microfrontend Architecture...
# 📦 Este script irá remover:
#    - node_modules, dist e package-lock.json de todos os subprojetos e do root
#    - Limpar o cache do npm em cada projeto
#
# ℹ️  Use este script para garantir um ambiente limpo antes de instalar dependências ou resolver problemas de build.
#
# ⏹️  Para interromper, pressione Ctrl+C

folders=( "." "shared" "transactions-mfe" "dashboard-mfe" "shell" )

for folder in "${folders[@]}"; do
    nm="$folder/node_modules"
    dist="$folder/dist"
    plock="$folder/package-lock.json"
    if [ -d "$nm" ]; then
        echo "🧹 Removendo $nm"
        rm -rf "$nm"
    fi
    if [ -d "$dist" ]; then
        echo "🧹 Removendo $dist"
        rm -rf "$dist"
    fi
    if [ -f "$plock" ]; then
        echo "🧹 Removendo $plock"
        rm -f "$plock"
    fi
    echo "🧹 Limpando cache npm em $folder"
    (cd "$folder" && npm cache clean --force)
done

echo "✅ Limpeza finalizada!"
echo "💡 Dica: Execute 'npm install' novamente para reinstalar as dependências."
