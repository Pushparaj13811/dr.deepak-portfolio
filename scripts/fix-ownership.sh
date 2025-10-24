#!/bin/bash

echo "================================================"
echo "Fix Directory Ownership for github-deploy User"
echo "================================================"
echo ""

PROJECT_ID="mindspace-468015"
INSTANCE_NAME="instance-20250804-164027"
ZONE="us-central1-c"
DEPLOY_USER="github-deploy"

echo "This script will fix the ownership of the Deepak directory."
echo ""

# SSH into instance and fix ownership
gcloud compute ssh $INSTANCE_NAME \
  --zone=$ZONE \
  --project=$PROJECT_ID \
  --command="bash -s" << 'EOF'

set -e

# Find the Deepak directory (could be in /home or /mnt/disk2/home)
if [ -d "/home/github-deploy/Deepak" ]; then
    DEEPAK_LINK="/home/github-deploy/Deepak"
    DEEPAK_DIR=$(readlink -f "$DEEPAK_LINK")
elif [ -d "/mnt/disk2/home/github-deploy/Deepak" ]; then
    DEEPAK_DIR="/mnt/disk2/home/github-deploy/Deepak"
else
    echo "❌ Could not find Deepak directory"
    exit 1
fi

echo "Found directory at: $DEEPAK_DIR"
if [ -L "/home/github-deploy/Deepak" ]; then
    echo "Note: /home/github-deploy/Deepak is a symlink to $DEEPAK_DIR"
fi
echo ""

# Check current ownership of the actual directory
echo "Current ownership of actual directory:"
ls -ld "$DEEPAK_DIR"
ls -la "$DEEPAK_DIR" | head -5
echo ""

# Fix ownership of the actual directory AND the symlink
echo "Fixing ownership to github-deploy:github-deploy..."
sudo chown -R github-deploy:github-deploy "$DEEPAK_DIR"
sudo chown -h github-deploy:github-deploy "/home/github-deploy/Deepak" 2>/dev/null || true

echo ""
echo "New ownership:"
ls -la "$DEEPAK_DIR" | head -5
echo ""

# Verify git can write
echo "Testing git permissions as github-deploy user..."
sudo -u github-deploy bash -c "
cd '$DEEPAK_DIR'

# Configure safe directory
git config --global --add safe.directory '$DEEPAK_DIR'
git config --global --add safe.directory '/home/github-deploy/Deepak'

# Test git status
if git status &>/dev/null; then
    echo '✅ Git permissions are correct!'
else
    echo '❌ Git still has permission issues'
    git status 2>&1 | head -10
    exit 1
fi
"

echo ""
echo "================================================"
echo "✅ Ownership fixed successfully!"
echo "================================================"
echo ""
echo "You can now retry the GitHub Actions deployment."

EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! The directory is now owned by github-deploy."
    echo ""
    echo "Next step: Push a small change to trigger deployment, or manually trigger from GitHub Actions."
else
    echo ""
    echo "❌ Failed to fix ownership. Please check the error messages above."
    exit 1
fi
