#!/bin/bash

# Script para FORÇAR reset do banco de dados no EC2
# Use este script APENAS quando quiser limpar todos os dados e voltar ao template

set -e

echo "⚠️  ATENÇÃO: Este script vai RESETAR o banco de dados!"
echo "   Todos os dados atuais serão perdidos."
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Confirmar ação
read -p "Tem certeza que deseja continuar? (digite 'SIM' para confirmar): " -r
echo
if [[ ! $REPLY =~ ^SIM$ ]]; then
    echo -e "${YELLOW}❌ Operação cancelada.${NC}"
    exit 0
fi

echo -e "${BLUE}[1/4] Parando container da API...${NC}"
cd ~/fiap-tech-challenge-2
docker compose -f docker/docker-compose.backend.yml stop api

echo -e "${BLUE}[2/4] Removendo db.json antigo...${NC}"
rm -f db.json

echo -e "${BLUE}[3/4] Criando novo db.json a partir do template...${NC}"
if [ ! -f "db.template.json" ]; then
    echo -e "${RED}❌ Erro: db.template.json não encontrado!${NC}"
    exit 1
fi
cp db.template.json db.json

echo -e "${BLUE}[4/4] Reiniciando container da API...${NC}"
docker compose -f docker/docker-compose.backend.yml start api

echo ""
echo -e "${GREEN}✅ Banco de dados resetado com sucesso!${NC}"
echo ""
echo "🌐 Aguarde alguns segundos e teste:"
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")
echo "   curl http://${PUBLIC_IP}:3034/accounts"
echo ""
