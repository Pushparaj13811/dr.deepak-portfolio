#!/bin/bash

echo "================================================"
echo "Nginx Setup for Dr. Deepak Mehta Portfolio"
echo "Domain: deepak.hpm.com.np"
echo "Application Port: 3002"
echo "================================================"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root or with sudo"
    echo "   Usage: sudo bash scripts/setup-nginx.sh"
    exit 1
fi

# Install Nginx if not already installed
echo "Step 1: Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    apt update
    apt install -y nginx
    echo "✅ Nginx installed successfully"
else
    echo "✅ Nginx is already installed"
fi

# Create nginx configuration
echo ""
echo "Step 2: Creating nginx configuration..."

# Copy the nginx config to sites-available
cp nginx/deepak.hpm.com.np /etc/nginx/sites-available/deepak.hpm.com.np

echo "✅ Configuration file copied to /etc/nginx/sites-available/deepak.hpm.com.np"

# Create symbolic link to sites-enabled if it doesn't exist
if [ ! -L /etc/nginx/sites-enabled/deepak.hpm.com.np ]; then
    ln -s /etc/nginx/sites-available/deepak.hpm.com.np /etc/nginx/sites-enabled/deepak.hpm.com.np
    echo "✅ Enabled site configuration"
else
    echo "✅ Site configuration already enabled"
fi

# Remove default nginx site if it exists
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
    echo "✅ Removed default nginx site"
fi

# Test nginx configuration
echo ""
echo "Step 3: Testing nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

# Reload nginx
echo ""
echo "Step 4: Reloading nginx..."
systemctl reload nginx
systemctl enable nginx

if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
else
    echo "⚠️  Starting nginx..."
    systemctl start nginx
fi

echo ""
echo "================================================"
echo "✅ Nginx Setup Complete!"
echo "================================================"
echo ""
echo "Your application should now be accessible at:"
echo "  http://deepak.hpm.com.np"
echo ""
echo "Next Steps:"
echo "1. Make sure your domain DNS points to this server's IP address"
echo "2. Make sure your application is running on port 3002"
echo "   Run: pm2 start bun --name deepak-portfolio -- run start"
echo ""
echo "Optional: Setup SSL with Let's Encrypt"
echo "  Run: sudo bash scripts/setup-ssl.sh"
echo ""
echo "To check nginx status:"
echo "  sudo systemctl status nginx"
echo ""
echo "To view nginx logs:"
echo "  sudo tail -f /var/log/nginx/deepak-access.log"
echo "  sudo tail -f /var/log/nginx/deepak-error.log"
echo ""
