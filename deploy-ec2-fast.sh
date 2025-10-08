#!/bin/bash

# Script de Deploy Rápido - Usa imagens prontas do Docker Hub
# Este script puxa imagens pré-buildadas e sobe a aplicação em minutos

set -e

echo "🚀 Deploy rápido do ByteBank - Usando imagens Docker Hub"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Clonar/atualizar repositório
if [ ! -d "fiap-tech-challenge-2" ]; then
    echo -e "${BLUE}[1/4] Clonando repositório...${NC}"
    git clone https://github.com/karenkramek/fiap-tech-challenge-2.git
    cd fiap-tech-challenge-2
else
    echo -e "${BLUE}[1/4] Atualizando repositório...${NC}"
    cd fiap-tech-challenge-2
    git pull
fi

# 2. Configurar banco de dados
echo -e "${BLUE}[2/4] Configurando banco de dados...${NC}"
if [ ! -f "db.json" ]; then
    cp db.template.json db.json
    echo -e "${GREEN}✓ db.json criado${NC}"
else
    echo -e "${GREEN}✓ db.json já existe${NC}"
fi

# 3. Criar pasta de uploads
if [ ! -d "uploads" ]; then
    mkdir -p uploads
    echo -e "${GREEN}✓ Pasta uploads criada${NC}"
fi

# 4. Parar containers antigos (se existirem)
echo -e "${BLUE}[3/4] Parando containers antigos...${NC}"
docker compose -f docker/docker-compose.prod.yml down 2>/dev/null || true

# 5. Puxar imagens atualizadas e subir
echo -e "${BLUE}[4/4] Puxando imagens e iniciando aplicação...${NC}"
docker compose -f docker/docker-compose.prod.yml pull
docker compose -f docker/docker-compose.prod.yml up -d

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "📋 Status dos containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Obter IP público
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "SEU_IP")

echo "🌐 Acesse sua aplicação em:"
echo "   → Shell (Principal): http://${PUBLIC_IP}:3030"
echo "   → Dashboard MFE:     http://${PUBLIC_IP}:3031"
echo "   → Transactions MFE:  http://${PUBLIC_IP}:3032"
echo "   → API (JSON Server): http://${PUBLIC_IP}:3034"
echo ""
echo "💡 Comandos úteis:"
echo "   → Ver logs: docker compose -f docker/docker-compose.prod.yml logs -f"
echo "   → Parar: docker compose -f docker/docker-compose.prod.yml down"
echo "   → Atualizar: git pull && docker compose -f docker/docker-compose.prod.yml pull && docker compose -f docker/docker-compose.prod.yml up -d"
