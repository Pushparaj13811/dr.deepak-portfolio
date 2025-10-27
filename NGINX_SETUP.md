# Nginx Setup Guide

This guide explains how to set up Nginx as a reverse proxy for the Dr. Deepak Mehta Portfolio application.

## Configuration Details

- **Domain**: drdeepakmehta.com.np
- **Application Port**: 3002
- **Web Server**: Nginx (reverse proxy)
- **SSL**: Optional (Let's Encrypt)

---

## Prerequisites

- Ubuntu/Debian-based Linux server
- Root or sudo access
- Domain DNS configured to point to your server's IP address
- Application running on port 3002

---

## Quick Setup (Automated)

### Step 1: Run the Nginx Setup Script

SSH into your GCP instance and navigate to the project directory:

```bash
# SSH into your instance
gcloud compute ssh instance-20250804-164027 \
  --zone us-central1-c \
  --project mindspace-468015

# Navigate to project directory
cd ~/Deepak

# Make the script executable
chmod +x scripts/setup-nginx.sh

# Run the setup script with sudo
sudo bash scripts/setup-nginx.sh
```

This script will:
- Install Nginx if not already installed
- Copy the nginx configuration to `/etc/nginx/sites-available/`
- Enable the site configuration
- Test and reload Nginx

### Step 2: Configure Your Application

Make sure your application is configured to run on port 3002:

```bash
# Create or update .env file
cat > .env << 'EOF'
NODE_ENV=production
PORT=3002
DATABASE_URL=your_neon_postgres_url
SESSION_SECRET=your_session_secret_here
DOMAIN=drdeepakmehta.com.np
EOF

# Restart the application
pm2 restart deepak-portfolio
```

### Step 3: Verify Setup

Test that everything is working:

```bash
# Check nginx status
sudo systemctl status nginx

# Test local application
curl http://localhost:3002

# Test through nginx
curl http://localhost
```

Your site should now be accessible at: **http://drdeepakmehta.com.np**

---

## Optional: Setup SSL with Let's Encrypt

To enable HTTPS on your domain:

```bash
# Make the SSL script executable
chmod +x scripts/setup-ssl.sh

# Run the SSL setup script
sudo bash scripts/setup-ssl.sh
```

The script will:
- Install Certbot
- Obtain SSL certificate from Let's Encrypt
- Configure Nginx for HTTPS
- Set up automatic certificate renewal

After SSL setup, your site will be accessible at: **https://drdeepakmehta.com.np**

---

## Manual Setup

If you prefer to set up manually:

### 1. Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### 2. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/drdeepakmehta.com.np
```

Copy the contents from `nginx/drdeepakmehta.com.np` in this repository.

### 3. Enable the Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/drdeepakmehta.com.np /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. Configure Firewall

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Check firewall status
sudo ufw status
```

For GCP, also configure firewall rules:

```bash
# Allow HTTP traffic
gcloud compute firewall-rules create allow-http \
  --project=mindspace-468015 \
  --allow=tcp:80 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=http-server

# Allow HTTPS traffic
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

---

## Configuration Details

### Nginx Configuration Features

The nginx configuration includes:

- ✅ **Reverse Proxy** to application on port 3002
- ✅ **WebSocket Support** for hot module replacement during development
- ✅ **Security Headers** (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ **Gzip Compression** for faster page loads
- ✅ **Request Size Limit** of 10MB for image uploads
- ✅ **Access and Error Logging**
- ✅ **SSL Support** (commented out, enabled after running setup-ssl.sh)

### Application Port

The application now runs on port 3002 (changed from 3000):
- Configured in `src/index.tsx`
- Falls back to 3002 if PORT env variable is not set
- Can be overridden by setting `PORT=3002` in `.env`

---

## Troubleshooting

### Nginx Won't Start

```bash
# Check nginx status
sudo systemctl status nginx

# Check configuration for errors
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/deepak-error.log
```

### Site Not Accessible

```bash
# Check if nginx is running
sudo systemctl status nginx

# Check if application is running
pm2 status

# Test application directly
curl http://localhost:3002

# Test through nginx
curl http://localhost

# Check nginx access logs
sudo tail -f /var/log/nginx/deepak-access.log
```

### Application Not Responding

```bash
# Check if app is running on port 3002
sudo lsof -i :3002

# Restart application
pm2 restart deepak-portfolio

# View application logs
pm2 logs deepak-portfolio
```

### DNS Issues

```bash
# Check DNS resolution
nslookup drdeepakmehta.com.np

# Check if domain points to your server
dig drdeepakmehta.com.np +short

# Compare with your server's IP
curl ifconfig.me
```

### Firewall Issues

```bash
# Check GCP firewall rules
gcloud compute firewall-rules list --project=mindspace-468015

# Check local firewall (UFW)
sudo ufw status

# Allow nginx through firewall
sudo ufw allow 'Nginx Full'
```

### SSL Certificate Issues

```bash
# Test certificate renewal
sudo certbot renew --dry-run

# Check certificate status
sudo certbot certificates

# Renew certificate manually
sudo certbot renew
```

---

## Useful Commands

### Nginx Commands

```bash
# Start nginx
sudo systemctl start nginx

# Stop nginx
sudo systemctl stop nginx

# Restart nginx
sudo systemctl restart nginx

# Reload nginx (without dropping connections)
sudo systemctl reload nginx

# Test configuration
sudo nginx -t

# View status
sudo systemctl status nginx
```

### Log Files

```bash
# Access logs
sudo tail -f /var/log/nginx/deepak-access.log

# Error logs
sudo tail -f /var/log/nginx/deepak-error.log

# Both logs
sudo tail -f /var/log/nginx/deepak-*.log
```

### Application Commands

```bash
# Start application
pm2 start bun --name deepak-portfolio -- run start

# Restart application
pm2 restart deepak-portfolio

# Stop application
pm2 stop deepak-portfolio

# View logs
pm2 logs deepak-portfolio

# View status
pm2 status
```

---

## Performance Optimization

### Enable HTTP/2 (Requires SSL)

Already configured in the SSL section of nginx config:
```nginx
listen 443 ssl http2;
```

### Increase Worker Connections

Edit `/etc/nginx/nginx.conf`:
```nginx
events {
    worker_connections 4096;
}
```

### Enable Caching

Add to nginx configuration:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m max_size=1g inactive=60m;

location / {
    proxy_cache app_cache;
    proxy_cache_valid 200 60m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
}
```

---

## Security Best Practices

1. **Keep Nginx Updated**
   ```bash
   sudo apt update && sudo apt upgrade nginx
   ```

2. **Use SSL/TLS** (Run `sudo bash scripts/setup-ssl.sh`)

3. **Hide Nginx Version**
   Add to `/etc/nginx/nginx.conf`:
   ```nginx
   http {
       server_tokens off;
   }
   ```

4. **Rate Limiting**
   Add to nginx configuration:
   ```nginx
   limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

   location / {
       limit_req zone=one burst=20;
   }
   ```

5. **Monitor Logs**
   ```bash
   sudo tail -f /var/log/nginx/deepak-access.log
   ```

---

## Next Steps

After completing nginx setup:

1. ✅ Verify site is accessible at http://drdeepakmehta.com.np
2. ✅ Set up SSL certificate (run `sudo bash scripts/setup-ssl.sh`)
3. ✅ Configure automatic backups
4. ✅ Set up monitoring (Google Cloud Monitoring)
5. ✅ Configure CDN if needed (Cloudflare, etc.)

---

## Support

For issues or questions:
- Check nginx error logs: `sudo tail -f /var/log/nginx/deepak-error.log`
- Check application logs: `pm2 logs deepak-portfolio`
- Review nginx configuration: `sudo nginx -t`
- Consult DEPLOYMENT.md for application-specific issues

---

**Domain**: drdeepakmehta.com.np
**Application Port**: 3002
**Configuration**: `nginx/drdeepakmehta.com.np`
