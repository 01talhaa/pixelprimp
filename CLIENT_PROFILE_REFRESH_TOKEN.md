# Client Profile & Refresh Token Implementation

## Overview
Enhanced client management system with profile editing, image upload, and secure refresh token authentication.

## ✅ New Features Implemented

### 1. **Client Profile Page** (`/client/profile`)

#### Features:
- **Profile Information Section**
  - Edit name, email, phone, company
  - Profile picture upload with Cloudinary
  - Image preview (circular avatar)
  - 5MB file size limit validation
  - Real-time form updates

- **Change Password Section**
  - Current password verification
  - New password (minimum 6 characters)
  - Confirm new password validation
  - Separate form submission

- **UI/UX**
  - Beautiful light theme design
  - Loading states for uploads and saves
  - Toast notifications for success/errors
  - Back button to dashboard
  - Responsive layout

#### Access:
- URL: `/client/profile`
- Protected route (requires authentication)
- Accessible from dashboard via "Profile" button

### 2. **Refresh Token Authentication**

#### Token System:
- **Access Token**
  - Lifetime: 15 minutes
  - Stored in `client_token` cookie
  - Used for API requests
  - JWT with client ID, email, type

- **Refresh Token**
  - Lifetime: 7 days
  - Stored in `client_refresh_token` cookie
  - Stored in database (Client model)
  - Used to get new access tokens
  - JWT with client ID, email, type: 'client_refresh'

#### Security Benefits:
1. **Short-lived access tokens** - Reduced window for token theft
2. **Long-lived refresh tokens** - Better UX (don't need to login frequently)
3. **Database validation** - Refresh tokens verified against stored value
4. **Automatic rotation** - New access token every 15 minutes
5. **HttpOnly cookies** - Protected from XSS attacks

### 3. **Automatic Token Refresh**

#### Client-side Utility (`lib/client-auth.ts`):

**Functions:**
- `fetchWithAuth(url, options)` - Fetch wrapper with auto-refresh
  - Automatically refreshes token on 401 errors
  - Retries original request with new token
  - Redirects to login if refresh fails

- `setupAutoRefresh()` - Proactive token refresh
  - Refreshes token every 14 minutes (before expiration)
  - Returns cleanup function
  - Prevents token expiration during active sessions

- `checkAuth()` - Verify authentication status

- `getCurrentClient()` - Get current client data

#### How It Works:
```typescript
// Before (manual fetch)
const response = await fetch('/api/auth/client/me')

// After (with auto-refresh)
const response = await fetchWithAuth('/api/auth/client/me')
// Automatically handles token refresh if needed!
```

### 4. **API Endpoints**

#### New Endpoints:

**POST `/api/auth/client/refresh`**
- Validates refresh token from cookie
- Verifies token matches database
- Issues new access token
- Returns new token in cookie + response

**POST `/api/auth/client/change-password`**
- Validates current password
- Updates to new password (auto-hashed)
- Requires authentication

#### Updated Endpoints:

**POST `/api/auth/client/signup`**
- Now creates both access & refresh tokens
- Stores refresh token in database
- Sets both cookies

**POST `/api/auth/client/login`**
- Creates both access & refresh tokens
- Updates refresh token in database
- Sets both cookies

**POST `/api/auth/client/logout`**
- Clears both access & refresh token cookies
- Could also invalidate refresh token in DB (optional enhancement)

### 5. **Database Changes**

#### Client Model Updates:
```typescript
{
  // ... existing fields
  refreshToken: {
    type: String,
    select: false, // Don't return by default
  }
}
```

## 🔐 Authentication Flow

### Initial Login/Signup:
```
1. Client submits credentials
2. Server validates credentials
3. Server generates:
   - Access token (15min)
   - Refresh token (7 days)
4. Server stores refresh token in DB
5. Server sets both cookies
6. Client redirected to dashboard
```

### Making Authenticated Requests:
```
1. Client makes request with fetchWithAuth()
2. Access token automatically included (cookie)
3. If access token valid → Response returned
4. If access token expired (401) →
   a. fetchWithAuth detects 401
   b. Automatically calls refresh endpoint
   c. Gets new access token
   d. Retries original request
   e. Returns response
```

### Automatic Refresh (Background):
```
1. Dashboard mounts
2. setupAutoRefresh() called
3. Timer set for 14 minutes
4. Timer fires:
   a. Calls refresh endpoint
   b. Gets new access token
   c. Old token replaced seamlessly
5. Repeat every 14 minutes
6. User never experiences interruption
```

### Logout:
```
1. Client clicks logout
2. Server clears both cookies
3. Client redirected to home
```

## 📁 File Structure

```
app/
├── client/
│   ├── profile/
│   │   └── page.tsx                    # NEW: Profile edit page
│   └── dashboard/
│       └── page.tsx                    # UPDATED: Added profile link
│
└── api/
    └── auth/
        └── client/
            ├── refresh/
            │   └── route.ts            # NEW: Token refresh endpoint
            ├── change-password/
            │   └── route.ts            # NEW: Password change endpoint
            ├── signup/
            │   └── route.ts            # UPDATED: Refresh token support
            ├── login/
            │   └── route.ts            # UPDATED: Refresh token support
            └── logout/
                └── route.ts            # UPDATED: Clear both tokens

lib/
├── client-auth.ts                      # NEW: Auth utilities
└── models/
    └── Client.ts                       # UPDATED: Added refreshToken field
```

## 🎨 UI Components

### Profile Page Features:
- Circular avatar display (w-32 h-32)
- File input for image upload
- Upload button with loading spinner
- Form fields with validation
- Separate password change card
- Save/Cancel buttons
- Sky-blue theme throughout

### Dashboard Updates:
- "Profile" button in header (next to Logout)
- Both buttons outlined style
- Responsive button layout

## 🚀 Usage Examples

### For Developers:

**1. Making Authenticated API Calls:**
```typescript
import { fetchWithAuth } from '@/lib/client-auth'

// Automatically handles token refresh
const response = await fetchWithAuth('/api/clients/123', {
  method: 'PUT',
  body: JSON.stringify(data)
})
```

**2. Setting up Auto-Refresh in Components:**
```typescript
useEffect(() => {
  const cleanup = setupAutoRefresh()
  return cleanup // Clean up on unmount
}, [])
```

**3. Checking Authentication:**
```typescript
import { checkAuth, getCurrentClient } from '@/lib/client-auth'

const isAuth = await checkAuth()
const client = await getCurrentClient()
```

### For Clients:

**1. Editing Profile:**
- Go to dashboard
- Click "Profile" button
- Update information
- Upload new profile picture
- Click "Save Changes"

**2. Changing Password:**
- Go to profile page
- Scroll to "Change Password" section
- Enter current password
- Enter new password (min 6 chars)
- Confirm new password
- Click "Change Password"

## ⚙️ Configuration

### Environment Variables:
```env
JWT_SECRET=your-secret-key-here  # Use strong secret in production
MONGO_URI=your-mongodb-uri       # MongoDB connection
```

### Token Lifetimes (Configurable):
```typescript
// In auth routes
.setExpirationTime('15m')  // Access token: 15 minutes
.setExpirationTime('7d')   // Refresh token: 7 days

// In client-auth.ts
const refreshInterval = 14 * 60 * 1000  // Refresh every 14 minutes
```

## 🔒 Security Considerations

### Implemented:
✅ HttpOnly cookies (XSS protection)
✅ Secure flag in production (HTTPS only)
✅ SameSite: lax (CSRF protection)
✅ Short-lived access tokens
✅ Refresh token stored in database
✅ Refresh token validated against DB
✅ Passwords hashed with bcrypt
✅ Token type validation

### Best Practices:
- ✅ Access tokens are short-lived (15min)
- ✅ Refresh tokens validated against DB
- ✅ Tokens automatically rotated
- ✅ Failed refresh redirects to login
- ✅ Logout clears all tokens

### Optional Enhancements:
- [ ] Refresh token rotation (issue new refresh token on each use)
- [ ] Refresh token revocation on logout (remove from DB)
- [ ] Device tracking (multiple refresh tokens per client)
- [ ] Refresh token family (detect token reuse)

## 📊 Token Comparison

| Feature | Old System | New System |
|---------|-----------|------------|
| **Token Lifetime** | 7 days | 15 minutes (access) |
| **Auto-Refresh** | ❌ No | ✅ Yes |
| **Security** | Medium | High |
| **User Experience** | Good | Better |
| **Token Theft Risk** | Higher | Lower |
| **Session Length** | 7 days | 7 days (via refresh) |

## 🐛 Troubleshooting

### Issue: Token refresh fails
- Check `client_refresh_token` cookie exists
- Verify refresh token in database
- Check JWT_SECRET is consistent
- Ensure MongoDB connection is working

### Issue: Constant redirects to login
- Clear cookies and login again
- Check refresh token expiration (7 days)
- Verify refresh endpoint is accessible

### Issue: Profile image not uploading
- Check file size (<5MB)
- Verify file type is image/*
- Check Cloudinary configuration
- Ensure `/api/upload` endpoint works

## ✨ Summary

### What Changed:
1. ✅ Added client profile edit page
2. ✅ Implemented profile image upload
3. ✅ Added password change functionality
4. ✅ Implemented refresh token system
5. ✅ Created automatic token refresh utility
6. ✅ Updated dashboard with profile link
7. ✅ Enhanced authentication security

### Benefits:
- **Better Security**: Short-lived access tokens reduce risk
- **Better UX**: Seamless token refresh, no interruptions
- **Client Control**: Clients can edit their own profile
- **Modern Auth**: Industry-standard token refresh pattern

### Client Features:
- ✅ Edit personal information
- ✅ Upload/change profile picture
- ✅ Change password
- ✅ Automatic session management
- ✅ Secure authentication

Date: October 30, 2025
