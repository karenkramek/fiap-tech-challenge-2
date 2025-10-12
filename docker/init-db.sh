#!/bin/bash

# Script de inicialização do banco de dados
# Executado UMA VEZ quando o container inicia
# Cria db.json a partir do template se não existir ou estiver desatualizado

set -e

DB_FILE="/data/db.json"
TEMPLATE_FILE="/data/db.template.json"
LOCK_FILE="/data/.db-initialized"

echo "🔄 Verificando inicialização do banco de dados..."

# Verifica se o template existe
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "❌ Erro: Template $TEMPLATE_FILE não encontrado!"
    exit 1
fi

# Se o db.json não existe OU se foi solicitado reset, cria a partir do template
if [ ! -f "$DB_FILE" ]; then
    echo "📋 Criando db.json a partir do template..."
    cp "$TEMPLATE_FILE" "$DB_FILE"
    echo "✅ Banco de dados criado com sucesso!"
else
    echo "ℹ️  db.json já existe, mantendo dados atuais"
    echo "💡 Para resetar, delete o arquivo db.json e reinicie o container"
fi

echo "✅ Inicialização concluída!"
