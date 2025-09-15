#!/bin/bash

echo "🚀 Starting ByteBank Microfrontend Architecture..."
echo "📦 This will start:"
echo "   - API Server (port 3034)"
echo "   - Shared Library (port 3033)"
echo "   - Dashboard MFE (port 3031)"
echo "   - Transactions MFE (port 3032)"
echo "   - Shell App (port 3030)"
echo ""
echo "🌐 Once started, visit: http://localhost:3030"
echo "⏹️  To stop all services, press Ctrl+C"
echo ""

# Run all services concurrently
npm run dev:all