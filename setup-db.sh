#!/bin/bash

# Script para setup do banco de dados local
# Copia o template para db.json se não existir

DB_FILE="db.json"
TEMPLATE_FILE="db.template.json"

# Verifica se o arquivo template existe
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ Erro: Arquivo $TEMPLATE_FILE não encontrado!"
    exit 1
fi

# Se db.json não existe, cria a partir do template
if [ ! -f "$DB_FILE" ]; then
    echo "📋 Criando $DB_FILE a partir do template..."
    cp "$TEMPLATE_FILE" "$DB_FILE"
    echo "✅ Arquivo $DB_FILE criado com sucesso!"
else
    echo "ℹ️  Arquivo $DB_FILE já existe. Mantendo dados locais."
fi

echo "🚀 Setup do banco de dados concluído!"
