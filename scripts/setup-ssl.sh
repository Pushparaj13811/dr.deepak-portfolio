#!/bin/bash

echo "================================================"
echo "SSL Setup with Let's Encrypt"
echo "Domain: deepak.hpm.com.np"
echo "================================================"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then
    echo "❌ This script must be run as root or with sudo"
    echo "   Usage: sudo bash scripts/setup-ssl.sh"
    exit 1
fi

# Check if certbot is installed
echo "Step 1: Installing Certbot..."
if ! command -v certbot &> /dev/null; then
    apt update
    apt install -y certbot python3-certbot-nginx
    echo "✅ Certbot installed successfully"
else
    echo "✅ Certbot is already installed"
fi

# Obtain SSL certificate
echo ""
echo "Step 2: Obtaining SSL certificate..."
echo "⚠️  Make sure your domain deepak.hpm.com.np points to this server's IP"
echo ""

read -p "Enter your email address for Let's Encrypt notifications: " EMAIL

if [ -z "$EMAIL" ]; then
    echo "❌ Email address is required"
    exit 1
fi

echo ""
echo "Obtaining certificate for deepak.hpm.com.np..."
echo ""

certbot --nginx \
    -d deepak.hpm.com.np \
    --non-interactive \
    --agree-tos \
    --email "$EMAIL" \
    --redirect

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "✅ SSL Certificate Installed Successfully!"
    echo "================================================"
    echo ""
    echo "Your site is now secured with HTTPS:"
    echo "  https://deepak.hpm.com.np"
    echo ""
    echo "Certificate auto-renewal is configured."
    echo "Certbot will automatically renew your certificate before it expires."
    echo ""
    echo "To test auto-renewal:"
    echo "  sudo certbot renew --dry-run"
    echo ""
else
    echo ""
    echo "❌ SSL certificate installation failed"
    echo ""
    echo "Common issues:"
    echo "1. Domain doesn't point to this server's IP address"
    echo "2. Port 80 and 443 are not accessible from the internet"
    echo "3. Firewall blocking incoming connections"
    echo ""
    echo "To check your firewall:"
    echo "  sudo ufw status"
    echo "  sudo ufw allow 'Nginx Full'"
    echo ""
    exit 1
fi
