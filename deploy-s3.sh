#!/bin/bash

# AWS S3 Deployment Script for into3.ai Landing Page
# This script deploys your static website to AWS S3

set -e

echo "=========================================="
echo "  into3.ai - AWS S3 Deployment Script"
echo "=========================================="
echo ""

# Load configuration
BUCKET_NAME="into3-landing"
REGION="ap-south-1"
INDEX_DOCUMENT="intro.html"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed.${NC}"
    echo "Please install AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured.${NC}"
    echo "Please run: aws configure"
    exit 1
fi

echo -e "${GREEN}✓ AWS CLI configured${NC}"
echo ""

# Step 1: Check if bucket exists, if not create it
echo "Step 1: Checking S3 bucket..."
if aws s3 ls "s3://${BUCKET_NAME}" 2>&1 | grep -q 'NoSuchBucket'; then
    echo -e "${YELLOW}Bucket doesn't exist. Creating bucket: ${BUCKET_NAME}${NC}"

    if [ "$REGION" == "us-east-1" ]; then
        aws s3 mb "s3://${BUCKET_NAME}" --region ${REGION}
    else
        aws s3api create-bucket --bucket ${BUCKET_NAME} --region ${REGION} --create-bucket-configuration LocationConstraint=${REGION}
    fi

    echo -e "${GREEN}✓ Bucket created${NC}"
else
    echo -e "${GREEN}✓ Bucket already exists${NC}"
fi
echo ""

# Step 2: Disable block public access first
echo "Step 2: Configuring public access settings..."
aws s3api put-public-access-block \
    --bucket ${BUCKET_NAME} \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"
echo -e "${GREEN}✓ Public access configured${NC}"
echo ""

# Step 3: Enable static website hosting
echo "Step 3: Configuring static website hosting..."
aws s3 website "s3://${BUCKET_NAME}" \
    --index-document ${INDEX_DOCUMENT} \
    --error-document 404.html
echo -e "${GREEN}✓ Static website hosting enabled${NC}"
echo ""

# Step 4: Update bucket policy for public access
echo "Step 4: Setting bucket policy for public access..."
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket ${BUCKET_NAME} --policy file:///tmp/bucket-policy.json
rm /tmp/bucket-policy.json
echo -e "${GREEN}✓ Bucket policy updated${NC}"
echo ""

# Step 5: Sync files to S3
echo "Step 5: Uploading files to S3..."
aws s3 sync . "s3://${BUCKET_NAME}" \
    --region ${REGION} \
    --delete \
    --exclude ".git/*" \
    --exclude ".DS_Store" \
    --exclude "node_modules/*" \
    --exclude "*.sh" \
    --exclude "deploy-config.json" \
    --exclude "DEPLOYMENT.md" \
    --cache-control "public, max-age=31536000" \
    --exclude "${INDEX_DOCUMENT}" \
    --exclude "index.html"

# Upload HTML files with no cache
aws s3 sync . "s3://${BUCKET_NAME}" \
    --region ${REGION} \
    --exclude "*" \
    --include "*.html" \
    --cache-control "no-cache, no-store, must-revalidate"

echo -e "${GREEN}✓ Files uploaded successfully${NC}"
echo ""

# Get website URL
WEBSITE_URL="http://${BUCKET_NAME}.s3-website.${REGION}.amazonaws.com"

echo "=========================================="
echo -e "${GREEN}  Deployment Successful!${NC}"
echo "=========================================="
echo ""
echo "Your website is now live at:"
echo -e "${GREEN}${WEBSITE_URL}${NC}"
echo ""
echo "Next steps:"
echo "1. Visit your website to verify deployment"
echo "2. (Optional) Set up CloudFront for HTTPS and CDN"
echo "3. (Optional) Configure custom domain"
echo ""
