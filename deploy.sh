#!/bin/bash

# Beauty by Vicky's - Vercel Deployment Script
# This script helps you deploy your project to Vercel

echo "🌸 Beauty by Vicky's - Vercel Deployment Script"
echo "=================================================="

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel"
        exit 1
    fi
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "📝 Please login to Vercel:"
    vercel login
    if [ $? -ne 0 ]; then
        echo "❌ Failed to login to Vercel"
        exit 1
    fi
fi

# Show current user info
echo "✅ Logged in as: $(vercel whoami)"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "📝 Please edit .env.local with your actual values before continuing"
        echo "   Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY"
        read -p "Press Enter after editing .env.local..."
    else
        echo "❌ .env.example file not found"
        exit 1
    fi
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "   This may take a few minutes..."

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Set up environment variables in Vercel dashboard"
    echo "   2. Configure custom domain (optional)"
    echo "   3. Test all functionality"
    echo ""
    echo "📖 For detailed instructions, see DEPLOYMENT.md"
    echo ""
    echo "🌐 Your site is now live!"
else
    echo "❌ Deployment failed. Please check the error messages above."
    echo "📖 For troubleshooting, see DEPLOYMENT.md"
    exit 1
fi
