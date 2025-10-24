# Deployment Guide - Google Cloud Compute Engine

This guide explains how to deploy the Dr. Deepak Mehta Portfolio application to Google Cloud Compute Engine using GitHub Actions.

## Prerequisites

- Google Cloud Project: `mindspace-468015`
- Compute Engine Instance: `instance-20250804-164027`
- Zone: `us-central1-c`
- GitHub repository with Actions enabled
- Domain: `deepak.hpm.com.np`

## Setup Instructions

### 1. Create a Google Cloud Service Account

```bash
# Create service account
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions Deployer" \
  --project=mindspace-468015

# Grant necessary permissions
gcloud projects add-iam-policy-binding mindspace-468015 \
  --member="serviceAccount:github-deployer@mindspace-468015.iam.gserviceaccount.com" \
  --role="roles/compute.instanceAdmin.v1"

gcloud projects add-iam-policy-binding mindspace-468015 \
  --member="serviceAccount:github-deployer@mindspace-468015.iam.gserviceaccount.com" \
  --role="roles/compute.osLogin"

# Create and download service account key
gcloud iam service-accounts keys create ~/gcp-key.json \
  --iam-account=github-deployer@mindspace-468015.iam.gserviceaccount.com
```

### 2. Generate SSH Key for Deployment

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-deploy-key -N ""

# Add public key to GCP instance
gcloud compute instances add-metadata instance-20250804-164027 \
  --zone=us-central1-c \
  --metadata-from-file ssh-keys=<(echo "github-deploy:$(cat ~/.ssh/github-deploy-key.pub)")
```

### 3. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

#### `GCP_SA_KEY`
Contents of `~/gcp-key.json`:
```bash
cat ~/gcp-key.json
```

#### `GCP_SSH_PRIVATE_KEY`
Contents of `~/.ssh/github-deploy-key`:
```bash
cat ~/.ssh/github-deploy-key
```

#### `GCP_SSH_USER`
The SSH username (usually your GCP username or "github-deploy"):
```
github-deploy
```

### 4. Prepare the GCP Instance

SSH into your instance and set up the application:

```bash
# SSH into instance
gcloud compute ssh instance-20250804-164027 \
  --zone us-central1-c \
  --project mindspace-468015

# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PM2 for process management (recommended)
bun install -g pm2

# Create application directory
mkdir -p ~/Deepak
cd ~/Deepak

# Clone repository (first time)
git clone https://github.com/YOUR_USERNAME/Deepak.git .

# Set up environment variables
cat > .env << 'EOF'
NODE_ENV=production
DATABASE_URL=your_database_url_here
SESSION_SECRET=your_session_secret_here
PORT=3002
DOMAIN=deepak.hpm.com.np
EOF

# Install dependencies
bun install

# Run database setup
bun run setup

# Start with PM2
pm2 start bun --name deepak-portfolio -- run start
pm2 startup
pm2 save
```

### 5. Configure Firewall Rules

```bash
# Allow HTTP traffic (port 80 for nginx)
gcloud compute firewall-rules create allow-http \
  --project=mindspace-468015 \
  --allow=tcp:80 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=http-server

# Allow HTTPS traffic (if using SSL)
gcloud compute firewall-rules create allow-https \
  --project=mindspace-468015 \
  --allow=tcp:443 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=https-server

# Add tags to instance
gcloud compute instances add-tags instance-20250804-164027 \
  --zone=us-central1-c \
  --tags=http-server,https-server
```

### 6. Set up Nginx as Reverse Proxy (Recommended)

The application is configured to run on port 3002 behind an Nginx reverse proxy at `deepak.hpm.com.np`.

**Quick Setup (Automated):**

```bash
# SSH into instance
gcloud compute ssh instance-20250804-164027 \
  --zone us-central1-c \
  --project mindspace-468015

# Navigate to project directory
cd ~/Deepak

# Run nginx setup script
chmod +x scripts/setup-nginx.sh
sudo bash scripts/setup-nginx.sh

# Optional: Setup SSL with Let's Encrypt
chmod +x scripts/setup-ssl.sh
sudo bash scripts/setup-ssl.sh
```

For detailed nginx configuration and troubleshooting, see **[NGINX_SETUP.md](NGINX_SETUP.md)**.

## Deployment Process

### Automatic Deployment

Every push to the `main` branch will trigger an automatic deployment:

1. GitHub Actions checks out the code
2. Authenticates with Google Cloud
3. Connects to the instance via SSH
4. Pulls latest changes
5. Installs dependencies
6. Runs migrations
7. Restarts the application

### Manual Deployment

You can also trigger a deployment manually:

1. Go to GitHub repository → Actions
2. Select "Deploy to GCloud" workflow
3. Click "Run workflow"
4. Select branch (usually `main`)
5. Click "Run workflow"

## Monitoring Deployment

### Check Workflow Status
- Go to GitHub → Actions tab
- View the running/completed workflows
- Check logs for any errors

### Check Application Status on Server

```bash
# SSH into instance
gcloud compute ssh instance-20250804-164027 \
  --zone us-central1-c \
  --project mindspace-468015

# Check PM2 status
pm2 status
pm2 logs deepak-portfolio

# Check application logs
tail -f /tmp/deepak.log

# Check if app is running
curl http://localhost:3000
```

## Troubleshooting

### Deployment Fails

**Check GitHub Actions logs:**
- Go to Actions tab and view the failed workflow
- Look for error messages in the deploy step

**Common issues:**

1. **SSH Connection Failed**
   - Verify SSH key is added to GCP instance
   - Check firewall rules allow SSH (port 22)
   - Ensure service account has proper permissions

2. **Git Pull Failed**
   - SSH into server and manually pull: `git pull origin main`
   - Check git configuration on server

3. **Dependencies Installation Failed**
   - Check Bun is installed: `bun --version`
   - Clear cache: `rm -rf node_modules && bun install`

4. **Application Won't Start**
   - Check environment variables in `.env`
   - Verify database connection
   - Check port is not already in use: `sudo lsof -i :3000`

### Application Not Accessible

1. **Check if app is running:**
   ```bash
   pm2 status
   curl http://localhost:3000
   ```

2. **Check firewall rules:**
   ```bash
   gcloud compute firewall-rules list --project=mindspace-468015
   ```

3. **Check Nginx (if using):**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

### View Application Logs

```bash
# PM2 logs
pm2 logs deepak-portfolio

# System logs
journalctl -u deepak -f

# Nginx logs (if using)
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Rollback

If a deployment causes issues:

```bash
# SSH into instance
gcloud compute ssh instance-20250804-164027 \
  --zone us-central1-c \
  --project mindspace-468015

# Navigate to app directory
cd ~/Deepak

# Check git log
git log --oneline -5

# Rollback to previous commit
git reset --hard HEAD~1
# or specific commit: git reset --hard COMMIT_HASH

# Reinstall dependencies
bun install

# Restart application
pm2 restart deepak-portfolio
```

## Security Best Practices

1. **Use Environment Variables**
   - Never commit sensitive data
   - Store secrets in `.env` file on server
   - Use GitHub Secrets for deployment credentials

2. **Keep Dependencies Updated**
   ```bash
   bun update
   ```

3. **Regular Backups**
   - Backup database regularly
   - Keep snapshots of GCP instance

4. **Monitor Access**
   - Review GitHub Actions logs
   - Monitor server access logs
   - Use GCP Cloud Logging

## Get External IP

```bash
gcloud compute instances describe instance-20250804-164027 \
  --zone=us-central1-c \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

Your application will be accessible at:
- `http://deepak.hpm.com.np` (via Nginx)
- `https://deepak.hpm.com.np` (via Nginx with SSL)
- `http://INSTANCE_IP:3002` (direct, for testing)

## Environment Variables

Create a `.env` file on the server with:

```bash
NODE_ENV=production
PORT=3002

# Database
DATABASE_URL=your_neon_postgres_url

# Session
SESSION_SECRET=your_long_random_secret_here

# Domain
DOMAIN=deepak.hpm.com.np
```

## Next Steps

1. ✅ Set up custom domain (deepak.hpm.com.np configured)
2. Configure SSL certificate - Run `sudo bash scripts/setup-ssl.sh`
3. Set up monitoring (Google Cloud Monitoring)
4. Configure automatic backups
5. Set up staging environment
6. Configure DNS to point to server IP

---

For questions or issues, check the GitHub Issues or contact the development team.
