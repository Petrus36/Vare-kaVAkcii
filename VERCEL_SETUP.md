# Vercel Deployment Setup

## Image Upload Configuration

### Option 1: Enable Vercel Blob Storage (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Storage**
3. Click **Create Database** and select **Blob**
4. This will automatically enable Blob Storage for your project
5. No additional environment variables needed - it works automatically!

### Option 2: Use Environment Variable (Alternative)

If you prefer to use a token:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `BLOB_READ_WRITE_TOKEN` with your token value
3. Redeploy your application

### Troubleshooting

If you're still getting upload errors:

1. **Check Vercel Logs**: Go to your project → Deployments → Click on latest deployment → View Function Logs
2. **Verify Blob is enabled**: Settings → Storage should show Blob storage
3. **Check error messages**: The improved error handling will now show specific error details

### Alternative: Use External Image URLs

If Blob Storage continues to have issues, you can:
- Use external image hosting (Imgur, Cloudinary, etc.)
- Paste image URLs directly in the admin panel
- The form accepts both uploaded files and URLs

