#!/bin/bash

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║      MindConnect - Social Counselling         ║"
echo "║         Setting up your platform...           ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org"
  exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
  echo "⚠️  MongoDB not found locally."
  echo "   Option 1: Install MongoDB Community: https://www.mongodb.com/try/download/community"
  echo "   Option 2: Use MongoDB Atlas (free): https://www.mongodb.com/atlas"
  echo "   Then update MONGODB_URI in .env"
  echo ""
fi

echo "📦 Installing root dependencies..."
npm install

echo ""
echo "📦 Installing API Gateway..."
cd services/api-gateway && npm install && cd ../..

echo "📦 Installing Auth Service..."
cd services/auth-service && npm install && cd ../..

echo "📦 Installing User Service..."
cd services/user-service && npm install && cd ../..

echo "📦 Installing Social Service..."
cd services/social-service && npm install && cd ../..

echo "📦 Installing Payment Service..."
cd services/payment-service && npm install && cd ../..

echo "📦 Installing React Client..."
cd client && npm install && cd ..

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║           ✅ Setup Complete!                  ║"
echo "╠══════════════════════════════════════════════╣"
echo "║  Start the platform:  npm run dev             ║"
echo "║  Open browser:        http://localhost:3000   ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
