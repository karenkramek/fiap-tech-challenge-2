#!/bin/bash

# Script de Deploy Backend (API + Upload) - AWS EC2

set -e

echo "🚀 Deploy Backend - API e Upload Server"
echo ""

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# 1. Parar containers front-end se estiverem rodando
echo -e "${BLUE}[1/5] Parando containers front-end (não necessários)...${NC}"
docker stop bytebank-shell bytebank-dashboard bytebank-transactions bytebank-shared 2>/dev/null || true
docker rm bytebank-shell bytebank-dashboard bytebank-transactions bytebank-shared 2>/dev/null || true

# 2. Atualizar repositório
echo -e "${BLUE}[2/5] Atualizando repositório...${NC}"
cd ~/fiap-tech-challenge-2
git pull

# 3. Configurar banco de dados
echo -e "${BLUE}[3/5] Configurando banco de dados...${NC}"
if [ ! -f "db.json" ]; then
    cp db.template.json db.json
    echo -e "${GREEN}✓ db.json criado${NC}"
fi

# 4. Criar pasta de uploads
mkdir -p uploads

# 5. Subir apenas API + Upload
echo -e "${BLUE}[4/5] Iniciando API e Upload Server...${NC}"
docker compose -f docker/docker-compose.backend.yml pull
docker compose -f docker/docker-compose.backend.yml up -d

# 6. Verificar
echo -e "${BLUE}[5/5] Verificando containers...${NC}"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo -e "${GREEN}✅ Deploy Backend concluído!${NC}"
echo ""

PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "SEU_IP")

echo "🌐 Endpoints disponíveis:"
echo "   → API (JSON Server): http://${PUBLIC_IP}:3034"
echo "   → Upload Server:     http://${PUBLIC_IP}:3035"
echo ""
echo "💡 Use essas URLs nas variáveis de ambiente do Vercel!"
