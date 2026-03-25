# Profile-Based Token Regeneration System

This system automatically regenerates access tokens whenever a user switches their streaming profile, ensuring that the bearer token is always associated with the current active profile.

## How It Works

1. **Profile Change Detection**: Monitors `localStorage` for changes to the `streaming_profile` key
2. **Automatic Token Regeneration**: Calls `/auth/regenerate-token-with-profile` endpoint with the new profile ID
3. **Token Update**: Replaces the current access token with the new one returned by the API
4. **Error Handling**: Provides comprehensive error handling with fallbacks

## Setup Instructions

### 1. Add ProfileAuthProvider to Your App

Add the `ProfileAuthProvider` component high in your component tree (e.g., in your main layout):

```tsx
import { ProfileAuthProvider } from '@/components/auth/ProfileAuthProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ProfileAuthProvider>
          {/* Your existing app components */}
          {children}
        </ProfileAuthProvider>
      </body>
    </html>
  );
}
```

### 2. API Endpoint Requirements

Your backend must implement the `/auth/regenerate-token-with-profile` endpoint:

```typescript
POST /auth/regenerate-token-with-profile
{
  "streamingProfileId": "string"
}

// Expected Response:
{
  "status": true,
  "message": "Resource created successfully",
  "data": {
    "status": true,
    "message": "Token regenerated successfully with streaming profile",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "streamingProfile": {
        "id": "profile-id",
        "name": "Profile Name",
        "avatar": "https://...",
        "type": "adult",
        "isKidsProfile": false,
        "maxAgeRating": "G"
      },
      "user": {
        // User object
      }
    }
  },
  "timestamp": "2025-09-17T11:05:25.128Z",
  "path": "/auth/regenerate-token-with-profile",
  "method": "POST",
  "statusCode": 201
}
```

### 3. Using Profile Switching

#### Option A: Use the Enhanced ProfilePop Component
The `ProfilePop` component has been updated to automatically handle token regeneration:

```tsx
import ProfilePop from '@/components/header/Profile/ProfilePop';

// The component will automatically handle profile switching with token regeneration
<ProfilePop />
```

#### Option B: Manual Profile Switching with useProfileAuth Hook

```tsx
import { useProfileAuth } from '@/hooks/useProfileAuth';

function MyComponent() {
  const { switchProfileWithAuth, isRegeneratingToken } = useProfileAuth();

  const handleSwitchProfile = async (profile: UserProfile) => {
    const result = await switchProfileWithAuth(profile);
    
    if (result.success) {
      console.log('Profile switched successfully with new token');
    } else {
      console.error('Profile switch failed:', result.error);
    }
  };

  return (
    <button 
      onClick={() => handleSwitchProfile(someProfile)}
      disabled={isRegeneratingToken}
    >
      {isRegeneratingToken ? 'Switching...' : 'Switch Profile'}
    </button>
  );
}
```

## Key Features

### 1. Automatic Detection
- Monitors `localStorage` changes to `streaming_profile`
- Detects both same-tab and cross-tab profile changes
- Polls every second for same-tab changes (since localStorage events don't fire on the same tab)

### 2. Smart Token Management
- Calls `/auth/regenerate-token-with-profile` with the new profile ID
- Updates both Redux store and localStorage with new tokens
- No refresh token is returned in this API response (only access token)

### 3. API Interceptor Integration
- HTTP 401 responses automatically trigger profile-based token regeneration if a profile is active
- Falls back to regular refresh token logic if profile-based regeneration fails
- Clears all auth data and redirects to login on complete failure

### 4. Comprehensive Error Handling
- Logs detailed error messages for debugging
- Provides fallback mechanisms for various failure scenarios
- Includes error reporting service for monitoring authentication issues

## Files Added/Modified

### New Files:
- `src/hooks/useProfileAuth.ts` - Main profile authentication hook
- `src/hooks/useProfileChangeDetection.ts` - Profile change detection hook
- `src/services/profileChangeDetector.ts` - Profile change detection service
- `src/services/authErrorHandler.ts` - Authentication error handling service
- `src/components/auth/ProfileAuthProvider.tsx` - React provider component

### Modified Files:
- `src/store/slices/authApi.ts` - Added regenerate token endpoint
- `src/store/slices/authSlice.ts` - Added profile-based token update action
- `src/services/api.ts` - Enhanced response interceptor with profile-based token regeneration
- `src/components/header/Profile/ProfilePop.tsx` - Updated to use new profile auth system

## Error Handling

The system includes a comprehensive error handling mechanism:

```typescript
import { authErrorHandler } from '@/services/authErrorHandler';

// Listen for authentication errors
const unsubscribe = authErrorHandler.onError((error) => {
  switch (error.type) {
    case 'TOKEN_REGENERATION_FAILED':
      // Handle token regeneration failure
      showNotification(`Failed to regenerate token for ${error.profileName}`);
      break;
    case 'PROFILE_SWITCH_FAILED':
      // Handle profile switch failure
      showNotification(`Failed to switch to ${error.profileName}`);
      break;
    case 'AUTH_EXPIRED':
      // Handle complete authentication failure
      redirectToLogin();
      break;
  }
});
```

## Benefits

1. **Seamless User Experience**: Users can switch profiles without any additional authentication steps
2. **Security**: Each profile gets its own properly scoped access token
3. **Automatic Recovery**: System automatically handles token refresh failures with intelligent fallbacks
4. **Comprehensive Monitoring**: All authentication events are logged and can be monitored
5. **Backward Compatibility**: Existing functionality continues to work while new features enhance the experience

## API Details

The system uses your specific API structure:
- **Request Parameter**: `streamingProfileId` (not `profileId`)
- **Response Structure**: Nested data structure with `data.data.data.accessToken`
- **No Refresh Token**: Only access token is returned, existing refresh token is preserved

## Troubleshooting

1. **Token regeneration not working**: Ensure your backend implements the `/auth/regenerate-token-with-profile` endpoint correctly with the expected response structure
2. **Profile changes not detected**: Check that `streaming_profile` is being saved to localStorage correctly
3. **Infinite loops**: Make sure the profile change detection isn't triggering recursive profile updates
4. **API structure mismatch**: Ensure your API response matches the expected nested structure shown above

For additional debugging, check the browser console for detailed error messages from the auth error handler.