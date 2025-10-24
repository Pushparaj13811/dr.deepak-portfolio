# GitHub Secrets Setup Guide

Follow these steps to generate all required secrets for GitHub Actions deployment.

## Prerequisites

- Google Cloud SDK installed and configured
- Access to your GCP project: `mindspace-468015`
- GitHub repository access

---

## Step 1: Create Service Account and Get `GCP_SA_KEY`

```bash
# 1. Create a service account
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions Deployer" \
  --project=mindspace-468015

# 2. Grant necessary permissions
gcloud projects add-iam-policy-binding mindspace-468015 \
  --member="serviceAccount:github-deployer@mindspace-468015.iam.gserviceaccount.com" \
  --role="roles/compute.instanceAdmin.v1"

gcloud projects add-iam-policy-binding mindspace-468015 \
  --member="serviceAccount:github-deployer@mindspace-468015.iam.gserviceaccount.com" \
  --role="roles/compute.osLogin"

gcloud projects add-iam-policy-binding mindspace-468015 \
  --member="serviceAccount:github-deployer@mindspace-468015.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# 3. Create and download the service account key
gcloud iam service-accounts keys create ~/gcp-github-key.json \
  --iam-account=github-deployer@mindspace-468015.iam.gserviceaccount.com \
  --project=mindspace-468015

# 4. View the key (copy this entire JSON content for GitHub secret)
cat ~/gcp-github-key.json
```

**Copy the entire JSON output** - this is your `GCP_SA_KEY`

---

## Step 2: Generate SSH Key and Get `GCP_SSH_PRIVATE_KEY`

```bash
# 1. Generate SSH key pair (no passphrase for automation)
ssh-keygen -t ed25519 -C "github-actions@deploy" -f ~/github-deploy-key -N ""

# 2. View the private key (copy this for GitHub secret)
cat ~/github-deploy-key
```

**Copy the entire private key including the header and footer** - this is your `GCP_SSH_PRIVATE_KEY`

Example format:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
...
-----END OPENSSH PRIVATE KEY-----
```

---

## Step 3: Add SSH Public Key to GCP Instance

```bash
# 1. View your current GCP username
gcloud compute instances describe instance-20250804-164027 \
  --zone=us-central1-c \
  --project=mindspace-468015 \
  --format='value(metadata.items.ssh-keys)' | grep -o '^[^:]*' | head -1

# If empty, use your Google account username (usually your email prefix)
echo $USER

# 2. Get the public key content
cat ~/github-deploy-key.pub

# 3. Add the public key to the instance
# Replace YOUR_USERNAME with your actual username from step 1 or use 'github-deploy'
gcloud compute instances add-metadata instance-20250804-164027 \
  --zone=us-central1-c \
  --project=mindspace-468015 \
  --metadata=ssh-keys="github-deploy:$(cat ~/github-deploy-key.pub)"

# OR if you want to append to existing keys:
EXISTING_KEYS=$(gcloud compute instances describe instance-20250804-164027 \
  --zone=us-central1-c \
  --project=mindspace-468015 \
  --format='value(metadata.items.ssh-keys)')

gcloud compute instances add-metadata instance-20250804-164027 \
  --zone=us-central1-c \
  --project=mindspace-468015 \
  --metadata=ssh-keys="${EXISTING_KEYS}
github-deploy:$(cat ~/github-deploy-key.pub)"
```

---

## Step 4: Determine `GCP_SSH_USER`

The SSH username should be `github-deploy` (as configured above).

**Your `GCP_SSH_USER` is:** `github-deploy`

If you used a different username in step 3, use that instead.

---

## Step 5: Test SSH Connection

Before adding to GitHub, test the connection:

```bash
# Get instance external IP
INSTANCE_IP=$(gcloud compute instances describe instance-20250804-164027 \
  --zone=us-central1-c \
  --project=mindspace-468015 \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "Instance IP: $INSTANCE_IP"

# Test SSH connection
ssh -i ~/github-deploy-key github-deploy@$INSTANCE_IP "echo 'SSH connection successful!'"
```

If this works, you're ready to add secrets to GitHub!

---

## Step 6: Add Secrets to GitHub Repository

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/Deepak`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Add Secret 1: `GCP_SA_KEY`
- Name: `GCP_SA_KEY`
- Value: Paste the **entire JSON content** from `~/gcp-github-key.json`

### Add Secret 2: `GCP_SSH_PRIVATE_KEY`
- Name: `GCP_SSH_PRIVATE_KEY`
- Value: Paste the **entire private key** from `~/github-deploy-key`

### Add Secret 3: `GCP_SSH_USER`
- Name: `GCP_SSH_USER`
- Value: `github-deploy`

---

## Step 7: Verify All Secrets

After adding all secrets, you should see:
- ✓ GCP_SA_KEY
- ✓ GCP_SSH_PRIVATE_KEY
- ✓ GCP_SSH_USER

---

## Quick Commands Summary

Run these commands in order:

```bash
# 1. Create service account and download key
gcloud iam service-accounts create github-deployer \
  --display-name="GitHub Actions Deployer" \
  --project=mindspace-468015 && \
gcloud projects add-iam-policy-binding mindspace-468015 \
  --member="serviceAccount:github-deployer@mindspace-468015.iam.gserviceaccount.com" \
  --role="roles/compute.instanceAdmin.v1" && \
gcloud projects add-iam-policy-binding mindspace-468015 \
  --member="serviceAccount:github-deployer@mindspace-468015.iam.gserviceaccount.com" \
  --role="roles/compute.osLogin" && \
gcloud iam service-accounts keys create ~/gcp-github-key.json \
  --iam-account=github-deployer@mindspace-468015.iam.gserviceaccount.com \
  --project=mindspace-468015

# 2. Display the service account key
echo "=== GCP_SA_KEY (copy this entire JSON) ==="
cat ~/gcp-github-key.json
echo ""

# 3. Generate SSH key
ssh-keygen -t ed25519 -C "github-actions@deploy" -f ~/github-deploy-key -N ""

# 4. Display the private key
echo "=== GCP_SSH_PRIVATE_KEY (copy this entire key) ==="
cat ~/github-deploy-key
echo ""

# 5. Add public key to instance
gcloud compute instances add-metadata instance-20250804-164027 \
  --zone=us-central1-c \
  --project=mindspace-468015 \
  --metadata=ssh-keys="github-deploy:$(cat ~/github-deploy-key.pub)"

# 6. Display SSH username
echo "=== GCP_SSH_USER ==="
echo "github-deploy"
echo ""

# 7. Get instance IP for testing
INSTANCE_IP=$(gcloud compute instances describe instance-20250804-164027 \
  --zone=us-central1-c \
  --project=mindspace-468015 \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)')

echo "=== Test SSH Connection ==="
echo "Instance IP: $INSTANCE_IP"
echo "Run this to test:"
echo "ssh -i ~/github-deploy-key github-deploy@$INSTANCE_IP"
```

---

## Cleanup (Optional)

After copying the keys to GitHub, you can optionally remove them from your local machine:

```bash
# ONLY do this after confirming deployment works!
# rm ~/gcp-github-key.json
# rm ~/github-deploy-key
# rm ~/github-deploy-key.pub
```

---

## Troubleshooting

### Service Account Already Exists
If you get an error that the service account already exists:
```bash
# List existing service accounts
gcloud iam service-accounts list --project=mindspace-468015

# If github-deployer exists, just create a new key
gcloud iam service-accounts keys create ~/gcp-github-key.json \
  --iam-account=github-deployer@mindspace-468015.iam.gserviceaccount.com \
  --project=mindspace-468015
```

### SSH Key Already Exists
If `~/github-deploy-key` already exists:
```bash
# Use a different filename or remove the old one
rm ~/github-deploy-key ~/github-deploy-key.pub
# Then run the ssh-keygen command again
```

### Permission Denied
If you get permission errors:
```bash
# Make sure you're authenticated
gcloud auth login
gcloud config set project mindspace-468015

# Check your account has necessary permissions
gcloud projects get-iam-policy mindspace-468015
```

### SSH Connection Fails
```bash
# Check if SSH key was added to instance
gcloud compute instances describe instance-20250804-164027 \
  --zone=us-central1-c \
  --project=mindspace-468015 \
  --format='value(metadata.items.ssh-keys)'

# Check instance is running
gcloud compute instances list --project=mindspace-468015

# Check firewall allows SSH (port 22)
gcloud compute firewall-rules list --project=mindspace-468015 | grep -i ssh
```

---

## Next Steps

After adding all secrets to GitHub:

1. Push your code to the `main` branch
2. Go to GitHub → Actions tab
3. Watch the deployment workflow run
4. If successful, your app will be deployed to your GCP instance!

You can also manually trigger deployment:
- Go to Actions → "Deploy to GCloud" → Run workflow

---

Need help? Check the deployment logs in GitHub Actions or run the test commands above.
