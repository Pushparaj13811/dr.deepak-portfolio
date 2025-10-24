#!/bin/bash

echo "================================================"
echo "First-Time Server Setup for Dr. Deepak Portfolio"
echo "================================================"
echo ""

# Configuration
PROJECT_ID="mindspace-468015"
INSTANCE_NAME="instance-20250804-164027"
ZONE="us-central1-c"
DEPLOY_USER="github-deploy"
APP_DIR="/home/$DEPLOY_USER/Deepak"
GITHUB_REPO="https://github.com/Pushparaj13811/dr.deepak-portfolio.git"

echo "This script will set up your GCP instance for deployment."
echo ""
echo "Configuration:"
echo "  Project: $PROJECT_ID"
echo "  Instance: $INSTANCE_NAME"
echo "  Zone: $ZONE"
echo "  Deploy User: $DEPLOY_USER"
echo "  App Directory: $APP_DIR"
echo ""

# Get instance IP
echo "Getting instance IP..."
INSTANCE_IP=$(gcloud compute instances describe $INSTANCE_NAME \
  --zone=$ZONE \
  --project=$PROJECT_ID \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

if [ -z "$INSTANCE_IP" ]; then
    echo "❌ Failed to get instance IP. Make sure the instance is running."
    exit 1
fi

echo "✅ Instance IP: $INSTANCE_IP"
echo ""

# Get required information from user
echo "================================================"
echo "Environment Configuration"
echo "================================================"
echo ""

read -p "Enter your Neon PostgreSQL DATABASE_URL: " DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is required"
    exit 1
fi

read -p "Enter SESSION_SECRET (or press Enter to generate): " SESSION_SECRET
if [ -z "$SESSION_SECRET" ]; then
    SESSION_SECRET=$(openssl rand -base64 32)
    echo "✅ Generated SESSION_SECRET: $SESSION_SECRET"
fi

echo ""
echo "================================================"
echo "Setting up server..."
echo "================================================"
echo ""

# SSH into instance and run setup commands
gcloud compute ssh $INSTANCE_NAME \
  --zone=$ZONE \
  --project=$PROJECT_ID \
  --command="bash -s" << EOF

set -e

echo "Step 1: Checking if github-deploy user exists..."

if ! id $DEPLOY_USER &>/dev/null; then
    echo "❌ User $DEPLOY_USER does not exist!"
    echo "Please run the GitHub secrets setup first to create the SSH user:"
    echo "  bash /tmp/setup_github_secrets.sh"
    exit 1
fi

echo "✅ User $DEPLOY_USER exists"
echo ""

echo "Step 2: Installing required software for $DEPLOY_USER user..."

# Switch to github-deploy user for all setup
sudo -u $DEPLOY_USER bash << 'USEREOF'

set -e

# Install Bun if not installed
if ! command -v bun &> /dev/null; then
    echo "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="\$HOME/.bun"
    export PATH="\$BUN_INSTALL/bin:\$PATH"
    echo 'export BUN_INSTALL="\$HOME/.bun"' >> ~/.bashrc
    echo 'export PATH="\$BUN_INSTALL/bin:\$PATH"' >> ~/.bashrc
else
    echo "✅ Bun is already installed"
fi

# Source bashrc to get bun in PATH
source ~/.bashrc 2>/dev/null || true
export BUN_INSTALL="\$HOME/.bun"
export PATH="\$BUN_INSTALL/bin:\$PATH"

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    bun install -g pm2
else
    echo "✅ PM2 is already installed"
fi

echo ""
echo "Step 3: Setting up application directory..."

# Create application directory if it doesn't exist
if [ ! -d "\$HOME/Deepak" ]; then
    echo "Cloning repository..."
    git clone $GITHUB_REPO \$HOME/Deepak
else
    echo "✅ Directory already exists, pulling latest changes..."
    cd \$HOME/Deepak
    git pull
fi

cd \$HOME/Deepak

# Fix Git ownership issue
git config --global --add safe.directory "\$HOME/Deepak"

echo ""
echo "Step 4: Creating environment file..."

# Create .env file
cat > .env << 'ENVEOF'
NODE_ENV=production
PORT=3002
DATABASE_URL=$DATABASE_URL
SESSION_SECRET=$SESSION_SECRET
DOMAIN=deepak.hpm.com.np
ENVEOF

# Replace placeholders with actual values
sed -i "s|\\\$DATABASE_URL|$DATABASE_URL|g" .env
sed -i "s|\\\$SESSION_SECRET|$SESSION_SECRET|g" .env

echo "✅ Environment file created"

echo ""
echo "Step 5: Installing dependencies..."
bun install

echo ""
echo "Step 6: Setting up database..."
bun run setup

echo ""
echo "Step 7: Building application..."
bun run build || echo "⚠️ Build step optional"

echo ""
echo "Step 8: Starting application with PM2..."

# Stop existing PM2 process if running
pm2 stop deepak-portfolio 2>/dev/null || true
pm2 delete deepak-portfolio 2>/dev/null || true

# Start application
pm2 start bun --name deepak-portfolio -- run start

# Save PM2 process list
pm2 save

echo ""
echo "✅ Application started successfully!"

USEREOF

# Set up PM2 to start on system boot (needs sudo, so run outside of user context)
echo ""
echo "Step 9: Setting up PM2 startup (requires sudo)..."
sudo -u $DEPLOY_USER bash << 'PMEOF'
pm2 startup | tail -n 1
PMEOF

echo ""
echo "Step 10: Installing Nginx (if needed)..."

# Check if nginx setup script exists in the app directory
if sudo test -f /home/$DEPLOY_USER/Deepak/scripts/setup-nginx.sh; then
    echo "Running Nginx setup..."
    sudo bash /home/$DEPLOY_USER/Deepak/scripts/setup-nginx.sh || echo "⚠️ Nginx setup requires manual intervention"
else
    echo "⚠️ Nginx setup script not found. You'll need to set up Nginx manually."
fi

echo ""
echo "================================================"
echo "✅ First-time setup completed!"
echo "================================================"
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "================================================"
    echo "Setup Summary"
    echo "================================================"
    echo "✅ Application deployed to: $INSTANCE_IP"
    echo "✅ Application running on port: 3002"
    echo "✅ Deploy user: $DEPLOY_USER"
    echo "✅ App directory: $APP_DIR"
    echo "✅ PM2 process name: deepak-portfolio"
    echo ""
    echo "Access your application:"
    echo "  Direct: http://$INSTANCE_IP:3002"
    echo "  Domain: http://deepak.hpm.com.np (after DNS setup)"
    echo ""
    echo "Next steps:"
    echo "1. Configure DNS to point deepak.hpm.com.np to $INSTANCE_IP"
    echo "2. Set up SSL certificate (SSH to server and run: sudo bash $APP_DIR/scripts/setup-ssl.sh)"
    echo "3. Make sure GitHub secrets are configured (GCP_SA_KEY, GCP_SSH_PRIVATE_KEY, GCP_SSH_USER)"
    echo "4. Push to main branch to trigger automated deployments"
    echo ""
    echo "Useful commands (run via SSH as $DEPLOY_USER):"
    echo "  pm2 status           - Check application status"
    echo "  pm2 logs deepak-portfolio - View application logs"
    echo "  pm2 restart deepak-portfolio - Restart application"
    echo ""
else
    echo ""
    echo "❌ Setup failed. Please check the error messages above."
    echo ""
    echo "You can SSH into the server manually to investigate:"
    echo "  gcloud compute ssh $INSTANCE_NAME --zone=$ZONE --project=$PROJECT_ID"
    echo ""
    exit 1
fi
