# AWS S3 Deployment Guide for into3.ai

This guide will help you deploy your static website to AWS S3 with zero to minimal cost.

## Prerequisites

1. **AWS Account** (Free tier eligible)
   - Sign up at: https://aws.amazon.com/free/

2. **AWS CLI Installed**
   - Install: https://aws.amazon.com/cli/
   - For macOS: `brew install awscli`
   - For Windows: Download installer from AWS website

3. **AWS Credentials Configured**
   - Run: `aws configure`
   - You'll need:
     - AWS Access Key ID
     - AWS Secret Access Key
     - Default region: `ap-south-1` (Mumbai)
     - Default output format: `json`

## Cost Estimate

### Free Tier (First 12 months):
- S3: 5 GB storage, 20,000 GET requests/month
- CloudFront: 1 TB data transfer, 10M requests/month
- **Estimated cost: $0/month** for typical landing page traffic

### After Free Tier:
- **Estimated cost: $0.50-2/month** for low traffic sites

## Deployment Steps

### Option 1: Quick Deploy (Recommended)

1. **Make the script executable:**
   ```bash
   chmod +x deploy-s3.sh
   ```

2. **Run the deployment script:**
   ```bash
   ./deploy-s3.sh
   ```

   The script will:
   - Create S3 bucket (if needed)
   - Configure static website hosting
   - Set up public access
   - Upload all files
   - Display your website URL

3. **Access your website:**
   - URL format: `http://into3-landing.s3-website.ap-south-1.amazonaws.com`
   - First page: `intro.html`
   - Error page: `404.html`

### Option 2: Manual Deployment

If you prefer manual control:

1. **Create S3 bucket:**
   ```bash
   aws s3 mb s3://into3-landing --region ap-south-1 --create-bucket-configuration LocationConstraint=ap-south-1
   ```

2. **Enable static website hosting:**
   ```bash
   aws s3 website s3://into3-landing --index-document intro.html --error-document 404.html
   ```

3. **Set bucket policy for public access:**
   ```bash
   cat > bucket-policy.json <<EOF
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::into3-landing/*"
       }
     ]
   }
   EOF

   aws s3api put-bucket-policy --bucket into3-landing --policy file://bucket-policy.json
   ```

4. **Disable block public access:**
   ```bash
   aws s3api put-public-access-block \
     --bucket into3-landing \
     --public-access-block-configuration \
     "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
   ```

5. **Upload files:**
   ```bash
   aws s3 sync . s3://into3-landing --region ap-south-1 --delete \
     --exclude ".git/*" --exclude ".DS_Store" --exclude "*.sh" \
     --exclude "deploy-config.json" --exclude "DEPLOYMENT.md"
   ```

## Configuration

Edit `deploy-config.json` to customize:

```json
{
  "s3": {
    "bucketName": "into3-landing",
    "region": "ap-south-1",
    "indexDocument": "intro.html",
    "errorDocument": "404.html"
  }
}
```

## Re-deploying Updates

To update your website after making changes:

```bash
./deploy-s3.sh
```

The script will sync only changed files, making deployments fast.

## Adding HTTPS and CDN (Optional)

For production, add CloudFront for HTTPS and better performance:

1. **Create CloudFront distribution:**
   - Go to AWS Console > CloudFront
   - Click "Create Distribution"
   - Origin Domain: Your S3 website endpoint
   - Viewer Protocol Policy: Redirect HTTP to HTTPS
   - Price Class: Use Only U.S., Canada and Europe (cheapest)
   - Default Root Object: `intro.html`

2. **Cost:** Free tier includes 1TB/month for 12 months

## Custom Domain (Optional)

To use your own domain (e.g., www.into3.ai):

1. **In CloudFront:**
   - Add Alternate Domain Name (CNAME)
   - Request SSL certificate via AWS Certificate Manager (free)

2. **In your DNS provider:**
   - Add CNAME record pointing to CloudFront distribution

## Troubleshooting

### Error: "AccessDenied"
- Check bucket policy is applied correctly
- Verify public access settings are disabled

### Error: "NoSuchBucket"
- Verify bucket name is unique (S3 bucket names are global)
- Check region is correct

### Files not updating
- S3 caches may take a few minutes
- Force refresh browser with Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- If using CloudFront, create invalidation for `/*`

## Security Notes

- This setup makes your website **publicly accessible** (required for websites)
- Don't upload sensitive data or credentials
- The `.git` folder and config files are excluded from upload

## Support

For AWS support:
- Free tier FAQ: https://aws.amazon.com/free/
- S3 pricing: https://aws.amazon.com/s3/pricing/
- CloudFront pricing: https://aws.amazon.com/cloudfront/pricing/

## Files Overview

- `deploy-s3.sh` - Automated deployment script
- `deploy-config.json` - Deployment configuration
- `404.html` - Custom error page
- `intro.html` - First page (landing page)
- `index.html` - Main navigation page

---

**Ready to deploy?** Run `./deploy-s3.sh` and your site will be live in minutes!
