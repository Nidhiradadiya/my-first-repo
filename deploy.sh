#!/bin/bash

# Deployment script for ERP Billing System
# Usage: ./deploy.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   ERP Billing System - Deployment     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) found${NC}"
echo -e "${GREEN}✅ npm $(npm -v) found${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dependency installation failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 3: Build applications
echo -e "${BLUE}🔨 Building applications...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Step 4: Start applications
echo -e "${BLUE}🚀 Starting applications...${NC}"

if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}Using PM2 process manager${NC}"
    
    # Stop existing processes
    pm2 delete all 2>/dev/null || true
    
    # Start with PM2
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    
    echo ""
    echo -e "${GREEN}✅ Deployment complete!${NC}"
    echo ""
    echo -e "${BLUE}📊 Process Status:${NC}"
    pm2 status
    echo ""
    echo -e "${YELLOW}💡 Useful commands:${NC}"
    echo -e "   pm2 logs         - View logs"
    echo -e "   pm2 monit        - Monitor processes"
    echo -e "   pm2 restart all  - Restart all processes"
    echo -e "   pm2 stop all     - Stop all processes"
else
    echo -e "${YELLOW}PM2 not found. Starting without process manager...${NC}"
    echo -e "${YELLOW}💡 Install PM2 globally: npm install -g pm2${NC}"
    echo ""
    npm run start
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🎉 Deployment Successful! 🎉        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Access your application:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:5000${NC}"
echo ""
