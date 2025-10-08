#!/bin/bash

# Script para limpar completamente a instância EC2
# Remove todos os containers, imagens, volumes e libera recursos

echo "🧹 Limpando instância EC2..."

# Parar TODOS os containers
echo "⏹️  Parando todos os containers..."
docker stop $(docker ps -aq) 2>/dev/null || echo "Nenhum container rodando"

# Remover TODOS os containers
echo "🗑️  Removendo todos os containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "Nenhum container para remover"

# Remover TODAS as imagens
echo "🖼️  Removendo todas as imagens Docker..."
docker rmi $(docker images -q) -f 2>/dev/null || echo "Nenhuma imagem para remover"

# Limpar volumes não utilizados
echo "📦 Limpando volumes..."
docker volume prune -f

# Limpar networks não utilizados
echo "🌐 Limpando networks..."
docker network prune -f

# Limpar build cache
echo "💾 Limpando build cache..."
docker builder prune -af

# Limpar tudo de uma vez (system prune)
echo "🧽 Limpeza profunda..."
docker system prune -af --volumes

# Verificar espaço em disco
echo ""
echo "💽 Espaço em disco após limpeza:"
df -h /

# Verificar memória disponível
echo ""
echo "🧠 Memória disponível:"
free -h

# Verificar o que restou
echo ""
echo "📊 Status final:"
echo "Containers: $(docker ps -a | wc -l)"
echo "Imagens: $(docker images | wc -l)"
echo "Volumes: $(docker volume ls | wc -l)"

echo ""
echo "✅ Limpeza concluída!"
echo "💡 Agora você pode fazer o deploy apenas do backend."
