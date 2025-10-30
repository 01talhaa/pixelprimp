# Image Upload Troubleshooting Guide

## Quick Fix Applied ✅

### Changes Made:
1. **Updated `/api/upload` endpoint** to support both single (`file`) and multiple (`files`) file uploads
2. **Added better error handling** in client-form.tsx and profile page
3. **Changed Cloudinary folder** from `pqrix-projects` to `pqrix-avatars` for profile images
4. **Enhanced error messages** to show specific error details

## Common Issues & Solutions

### 1. "Failed to upload image" Error

#### Cause: Missing Cloudinary Configuration
**Solution:**
1. Create a `.env.local` file in the root directory (copy from `.env.example`)
2. Add your Cloudinary credentials:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. Get credentials from: https://cloudinary.com/console
4. Restart the development server: `pnpm dev`

**Test Configuration:**
```bash
# Visit this URL to check if Cloudinary is configured
http://localhost:3000/api/debug/cloudinary
```

### 2. File Size Too Large

**Error:** "Image size should be less than 5MB"

**Solution:**
- Compress the image before uploading
- Use tools like: TinyPNG, ImageOptim, or Squoosh
- Maximum allowed size: 5MB

### 3. Invalid File Type

**Error:** "Please select an image file"

**Solution:**
- Only image files are accepted
- Supported formats: JPG, PNG, GIF, WebP
- File must have image/* MIME type

### 4. Network/CORS Issues

**Symptoms:** Upload hangs or fails silently

**Solution:**
1. Check browser console for errors (F12)
2. Verify internet connection
3. Check if Cloudinary service is accessible
4. Disable browser extensions that might block requests

### 5. Environment Variables Not Loading

**Symptoms:** Configuration check shows "Missing"

**Solution:**
1. Ensure file is named `.env.local` (not `.env.txt`)
2. File must be in project root directory
3. Restart Next.js dev server after adding variables
4. Variables starting with `NEXT_PUBLIC_` are exposed to browser

## Testing the Upload Feature

### Step-by-Step Test:

1. **Check Configuration**
   ```bash
   # Visit debug endpoint
   http://localhost:3000/api/debug/cloudinary
   ```
   Should show: "All Cloudinary credentials are configured ✅"

2. **Test in Admin Panel**
   - Go to `/admin/clients/new`
   - Try uploading an image
   - Check browser console (F12) for detailed errors

3. **Test in Client Profile**
   - Login as a client
   - Go to `/client/profile`
   - Try uploading a profile picture
   - Check console for errors

### Expected Success Flow:
```
1. Select image file
2. Button shows spinner (uploading)
3. Console logs: "Processing file: filename.jpg..."
4. Console logs: "Cloudinary upload successful: https://..."
5. Toast notification: "Image uploaded successfully"
6. Image preview appears
```

### If Upload Fails - Check Console:
The error message will tell you exactly what went wrong:
- "Cloudinary credentials are not configured" → Add .env.local
- "File too large" → Compress image
- "Invalid file type" → Use JPG/PNG
- Other errors → Check Cloudinary API key validity

## API Endpoint Details

### `/api/upload` - File Upload Endpoint

**Accepts:**
- Single file: `FormData` with `file` field
- Multiple files: `FormData` with `files` field

**Request:**
```javascript
const formData = new FormData()
formData.append("file", fileObject)

const response = await fetch("/api/upload", {
  method: "POST",
  body: formData,
})
```

**Response (Success):**
```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "data": ["https://res.cloudinary.com/..."]
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Cloudinary credentials are not configured"
}
```

## Cloudinary Setup Guide

### 1. Create Cloudinary Account
1. Go to https://cloudinary.com
2. Sign up for free account
3. Verify email

### 2. Get API Credentials
1. Login to Cloudinary Dashboard
2. Go to Settings → API Keys
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 3. Add to Project
Create `.env.local`:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

### 4. Test Upload
1. Restart dev server: `pnpm dev`
2. Check config: http://localhost:3000/api/debug/cloudinary
3. Try uploading an image

## File Structure

```
app/
├── api/
│   ├── upload/
│   │   └── route.ts              # Main upload endpoint (UPDATED)
│   └── debug/
│       └── cloudinary/
│           └── route.ts          # Config checker (NEW)
│
components/
└── client-form.tsx               # Admin client form (UPDATED)

app/
└── client/
    └── profile/
        └── page.tsx              # Client profile page (UPDATED)

lib/
└── cloudinary.ts                 # Cloudinary helper

.env.local                        # Environment variables (CREATE THIS)
.env.example                      # Template (NEW)
```

## Advanced Troubleshooting

### Check Cloudinary Logs:
1. Login to Cloudinary Dashboard
2. Go to Reports → Usage
3. Check recent uploads
4. Look for failed requests

### Browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "upload"
4. Try uploading a file
5. Click on request to see:
   - Request payload
   - Response body
   - Status code

### Server Logs:
Check terminal where dev server is running for:
```
Uploading 1 file(s)...
Processing file: avatar.jpg, size: 245678, type: image/jpeg
Cloudinary upload successful: https://...
```

## Production Deployment

When deploying to production (Vercel, etc.):

1. **Add Environment Variables:**
   - Go to project settings
   - Add Cloudinary credentials
   - Redeploy

2. **Verify Upload Works:**
   - Test in production environment
   - Check Cloudinary dashboard for uploads

3. **Monitor Usage:**
   - Cloudinary free tier: 25 credits/month
   - Monitor usage in dashboard

## Quick Checklist ✅

Before reporting issues, verify:
- [ ] `.env.local` file exists in root
- [ ] Cloudinary credentials are correct
- [ ] Development server restarted after adding env vars
- [ ] Image file is under 5MB
- [ ] Image is valid format (JPG/PNG/GIF/WebP)
- [ ] Browser console shows no CORS errors
- [ ] Network connection is working
- [ ] Cloudinary account is active

## Need More Help?

1. Check `/api/debug/cloudinary` endpoint
2. Review browser console errors
3. Check server terminal logs
4. Verify Cloudinary dashboard shows API calls

---

**Last Updated:** October 30, 2025
