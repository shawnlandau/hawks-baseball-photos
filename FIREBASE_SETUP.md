# Firebase Setup Guide

## Enable Anonymous Authentication

To fix the authentication errors, you need to enable anonymous authentication in your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `hawksbaseballphotos-5bb61`
3. Navigate to **Authentication** in the left sidebar
4. Click on **Sign-in method** tab
5. Find **Anonymous** in the list of providers
6. Click on **Anonymous** and toggle it **ON**
7. Click **Save**

## Firebase Security Rules

You'll also need to set up security rules for Firestore and Storage:

### Firestore Rules
Go to **Firestore Database** → **Rules** and use:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/photos/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules
Go to **Storage** → **Rules** and use:
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /artifacts/{appId}/public/data/photos/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Current App Status

The app is now configured to:
- ✅ Work without authentication for viewing photos
- ✅ Show helpful error messages if upload fails due to auth
- ✅ Handle missing logo files
- ✅ Provide fallback for authentication errors

Once you enable anonymous authentication in Firebase Console, the app will work fully with upload functionality. 