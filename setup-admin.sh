#!/bin/bash

# Admin Setup Script for Beauty by Vicky's
# This script sets up the admin user in the database

echo "🌸 Setting up Beauty by Vicky's Admin Panel..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it with your Supabase credentials."
    exit 1
fi

# Load environment variables
source .env

echo "📊 Creating admin user in database..."

# Run the admin creation script
psql $DATABASE_URL -f database/create_admin.sql

if [ $? -eq 0 ]; then
    echo "✅ Admin user created successfully!"
    echo ""
    echo "🔐 Login Credentials:"
    echo "   Email: admin@beautybyvicky.com"
    echo "   Password: 242424"
    echo ""
    echo "🌐 Access your admin panel at: http://localhost:5173/admin"
else
    echo "❌ Failed to create admin user. Please check your database connection."
    exit 1
fi

echo "🎉 Setup complete! You can now access the admin panel."
