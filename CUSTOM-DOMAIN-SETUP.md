# Custom Domain Setup for into3.ai

Your S3 website is deployed and ready. Now let's connect your custom domain `www.into3.ai`.

## Current Status

✅ S3 Bucket: `into3-landing`
✅ S3 Website URL: `http://into3-landing.s3-website.ap-south-1.amazonaws.com`
✅ CloudFront Distribution: `d121fyjcr31val.cloudfront.net`
✅ Distribution ID: `E2UIKXFMYTZG85`

---

## Setup Steps

### Step 1: Request SSL Certificate (Required for HTTPS)

1. Go to [AWS Certificate Manager](https://console.aws.amazon.com/acm/home?region=us-east-1) (**MUST be us-east-1 region for CloudFront**)

2. Click **"Request a certificate"**

3. Choose **"Request a public certificate"**

4. Add domain names:
   - `www.into3.ai`
   - `into3.ai` (optional, for apex domain)

5. Validation method: Choose **DNS validation**

6. AWS will provide DNS records like:
   ```
   Type: CNAME
   Name: _abc123.into3.ai
   Value: _xyz456.acm-validations.aws
   ```

7. Add these validation CNAME records to your domain DNS

8. Wait for validation (usually 5-30 minutes)

---

### Step 2: Update CloudFront Distribution

Once your SSL certificate is validated:

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/v3/home)

2. Find distribution: `E2UIKXFMYTZG85`

3. Click **Edit**

4. Configure:
   - **Alternate domain names (CNAMEs)**: Add `www.into3.ai`
   - **Custom SSL certificate**: Select your validated certificate
   - **Default root object**: `intro.html`
   - **Viewer protocol policy**: Redirect HTTP to HTTPS

5. Click **Save changes**

6. Wait for deployment (15-20 minutes)

---

### Step 3: Add CNAME Record to Your DNS

After CloudFront is configured, add this to your domain DNS:

```
Type: CNAME
Name: www
Value: d121fyjcr31val.cloudfront.net
TTL: 300 (or 3600)
```

**Where to add this:**
- Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
- Find DNS settings for `into3.ai`
- Add the CNAME record above

---

## Quick DNS Setup Guide by Provider

### GoDaddy:
1. My Products → DNS → Manage Zones
2. Click on `into3.ai`
3. Add Record → CNAME
4. Name: `www`
5. Value: `d121fyjcr31val.cloudfront.net`

### Namecheap:
1. Domain List → Manage → Advanced DNS
2. Add New Record → CNAME
3. Host: `www`
4. Value: `d121fyjcr31val.cloudfront.net`

### Cloudflare:
1. Select domain → DNS
2. Add record → CNAME
3. Name: `www`
4. Target: `d121fyjcr31val.cloudfront.net`
5. ⚠️ **Important**: Set Proxy status to "DNS only" (grey cloud)

---

## Alternative: Simple Setup (HTTP only, not recommended)

If you want a quick test without HTTPS:

**CNAME Record:**
```
Type: CNAME
Name: www
Value: into3-landing.s3-website.ap-south-1.amazonaws.com
TTL: 300
```

⚠️ This will work but:
- No HTTPS (browsers will show "Not Secure")
- No CDN (slower loading)
- Not suitable for production

---

## Verification

After DNS propagation (5-60 minutes):

1. Visit: `https://www.into3.ai` (should work!)
2. Check: `http://www.into3.ai` (should redirect to HTTPS)

Test DNS propagation: [https://dnschecker.org](https://dnschecker.org)

---

## Apex Domain Setup (Optional)

To make `into3.ai` (without www) work:

### Option A: DNS Redirect (Recommended)
Most DNS providers offer URL redirect:
- Redirect `into3.ai` → `https://www.into3.ai`

### Option B: CloudFront Alternate Domain
1. Add `into3.ai` to CloudFront alternate domains
2. Add SSL certificate for `into3.ai`
3. Create ALIAS record (or A record if using Cloudflare/Route53)

---

## Cost Breakdown

### Free Tier (12 months):
- S3: Free for typical usage
- CloudFront: 1 TB transfer, 10M requests/month
- Certificate Manager: FREE forever
- Route53 (optional): $0.50/month per hosted zone

### After Free Tier:
- S3: ~$0.50/month
- CloudFront: ~$1-2/month for low traffic
- **Total: $1.50-3/month**

---

## Troubleshooting

### "Certificate not showing in CloudFront"
- Certificate MUST be in **us-east-1** region
- Certificate must be validated (status: Issued)

### "CNAME already exists"
- Remove any existing CNAME records for `www`
- Can only have one CNAME per subdomain

### "Distribution taking too long"
- CloudFront deployment takes 15-20 minutes
- Check status in CloudFront console

### "DNS not resolving"
- Wait 5-60 minutes for DNS propagation
- Clear browser cache
- Try incognito mode

---

## Summary: Your CNAME Details

**For HTTPS setup (Recommended):**
```
Type: CNAME
Name: www
Value: d121fyjcr31val.cloudfront.net
TTL: 300
```

**CloudFront Distribution:** `d121fyjcr31val.cloudfront.net`
**Distribution ID:** `E2UIKXFMYTZG85`

---

## Need Help?

1. AWS Certificate Manager: [Console Link](https://console.aws.amazon.com/acm/home?region=us-east-1)
2. CloudFront Console: [Console Link](https://console.aws.amazon.com/cloudfront/v3/home)
3. Check DNS: [dnschecker.org](https://dnschecker.org)

**Current S3 URL (still works):**
`http://into3-landing.s3-website.ap-south-1.amazonaws.com`
