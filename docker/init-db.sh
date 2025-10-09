#!/bin/bash

# Script de inicialização do banco de dados
# Este script é executado SEMPRE que o container sobe
# Garante que o db.json seja resetado a partir do template

set -e

DB_FILE="/data/db.json"
TEMPLATE_FILE="/data/db.template.json"

echo "🔄 Inicializando banco de dados..."

# Verifica se o template existe
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ Erro: Template $TEMPLATE_FILE não encontrado!"
    exit 1
fi

# SEMPRE sobrescreve o db.json com o template
echo "📋 Resetando db.json a partir do template..."
cp -f "$TEMPLATE_FILE" "$DB_FILE"

echo "✅ Banco de dados resetado com sucesso!"
echo "ℹ️  Base limpa iniciada a partir do template"
