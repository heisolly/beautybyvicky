#!/bin/bash

# Beauty by Vicky's - Vercel Deployment Script
# This script helps you deploy your project to Vercel

echo "🌸 Beauty by Vicky's - Vercel Deployment Script"
echo "=================================================="

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_info "Vercel CLI not found. Installing..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        print_error "Failed to install Vercel CLI. Please install manually: npm install -g vercel"
        exit 1
    fi
    print_success "Vercel CLI installed successfully"
fi

# Check if user is logged in to Vercel
print_info "Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_info "Please login to Vercel:"
    vercel login
    if [ $? -ne 0 ]; then
        print_error "Failed to login to Vercel"
        exit 1
    fi
fi

# Show current user info
echo -e "${GREEN}✅ Logged in as: $(vercel whoami)${NC}"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    print_warning ".env.local file not found. Creating from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_warning "Please edit .env.local with your actual values before continuing"
        print_warning "   Required: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY"
        read -p "Press Enter after editing .env.local..."
    else
        print_error ".env.example file not found"
        exit 1
    fi
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found. Please ensure you're in the correct directory."
    exit 1
fi

# Validate vercel.json syntax
print_info "Validating vercel.json configuration..."
if ! python -m json.tool vercel.json > /dev/null 2>&1; then
    print_error "vercel.json has invalid JSON syntax"
    exit 1
fi
print_success "vercel.json is valid"

# Check if package.json exists and has build script
if [ ! -f "package.json" ]; then
    print_error "package.json not found"
    exit 1
fi

if ! npm run build --dry-run > /dev/null 2>&1; then
    print_error "Build script failed. Please check your project locally first."
    exit 1
fi

# Deploy to Vercel
print_info "Deploying to Vercel..."
print_warning "This may take a few minutes..."

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    print_success "Deployment successful!"
    echo ""
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "   1. Set up environment variables in Vercel dashboard"
    echo "   2. Configure custom domain (optional)"
    echo "   3. Test all functionality"
    echo ""
    print_info "📖 For detailed instructions, see DEPLOYMENT.md"
    echo ""
    print_success "🌐 Your site is now live!"
    
    # Ask if user wants to open the site
    read -p "Would you like to open your deployed site? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Get the deployment URL
        DEPLOY_URL=$(vercel ls --scope $(vercel whoami) | head -n 2 | tail -n 1 | awk '{print $2}')
        if [ ! -z "$DEPLOY_URL" ]; then
            print_info "Opening: https://$DEPLOY_URL"
            # Try to open in browser (works on macOS, Linux with xdg-open, Windows with start)
            if command -v open &> /dev/null; then
                open "https://$DEPLOY_URL"
            elif command -v xdg-open &> /dev/null; then
                xdg-open "https://$DEPLOY_URL"
            elif command -v start &> /dev/null; then
                start "https://$DEPLOY_URL"
            else
                print_info "Please manually visit: https://$DEPLOY_URL"
            fi
        fi
    fi
else
    print_error "Deployment failed. Please check the error messages above."
    print_info "📖 For troubleshooting, see DEPLOYMENT.md"
    exit 1
fi
