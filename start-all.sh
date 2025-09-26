#!/bin/bash

echo "🚀 Starting ByteBank Microfrontend Architecture..."
echo "📦 This will start:"
echo "   - API Server (port 3034)"
echo "   - Upload Server (port 3035)"
echo "   - Shared Library (port 3033)"
echo "   - Dashboard MFE (port 3031)"
echo "   - Transactions MFE (port 3032)"
echo "   - Shell App (port 3030)"
echo ""
echo "🌐 Once started, visit: http://localhost:3030"
echo "⏹️  To stop all services, press Ctrl+C"
echo ""

# Start upload server first
echo "📁 Starting upload server..."
cd upload-server && npm start &

# Wait a moment for upload server to start
sleep 2

# Return to root and run all other services
cd ..
npm run dev:all
