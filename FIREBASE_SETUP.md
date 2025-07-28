# Firebase Setup Guide for Hawks Baseball Photos

## Project: hawks2025dev

### 1. Firebase Project Configuration

#### Get Your Firebase Config:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `hawks2025dev` project
3. Click the gear icon (Project Settings)
4. Scroll to "Your apps" section
5. Click "Add app" if you haven't already
6. Choose "Web" and register your app
7. Copy the config object

#### Set Up Environment Variables:
Create a `.env` file in the project root with:
```
REACT_APP_FIREBASE_CONFIG={"apiKey":"YOUR_API_KEY","authDomain":"hawks2025dev.firebaseapp.com","projectId":"hawks2025dev","storageBucket":"hawks2025dev.appspot.com","messagingSenderId":"YOUR_SENDER_ID","appId":"YOUR_APP_ID"}
```

### 2. Firebase Services Setup

#### Authentication:
1. Go to Authentication > Sign-in method
2. Enable Email/Password
3. Enable Google sign-in
4. Add your domain to authorized domains

#### Firestore Database:
1. Go to Firestore Database
2. Create database in production mode
3. Choose a location (us-central1 recommended)
4. Deploy the security rules from `firestore.rules`

#### Storage:
1. Go to Storage
2. Initialize storage
3. Choose a location (us-central1 recommended)
4. Deploy the security rules from `storage.rules`

### 3. Security Rules

#### Firestore Rules (`firestore.rules`):
- ✅ Users can read all photos
- ✅ Only authenticated users can create photos
- ✅ Users can only update/delete their own photos
- ✅ User profiles are protected

#### Storage Rules (`storage.rules`):
- ✅ Anyone can download photos
- ✅ Only authenticated users can upload (10MB limit, images only)
- ✅ Only authenticated users can delete

### 4. Deploy Rules

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### 5. Test Authentication

1. Start the development server: `npm start`
2. Go to http://localhost:3008
3. Try signing up with email/password
4. Try Google sign-in
5. Test photo upload functionality

### 6. Troubleshooting

#### Common Issues:
- **"Firebase not initialized"**: Check your `.env` file and restart the dev server
- **"Permission denied"**: Deploy the security rules
- **"Storage not found"**: Initialize Firebase Storage
- **"Authentication failed"**: Enable the sign-in methods in Firebase Console

#### Debug Steps:
1. Check browser console for errors
2. Verify Firebase config in `.env` file
3. Ensure rules are deployed
4. Check Firebase Console for any service issues

### 7. Production Deployment

When ready for production:
1. Update authorized domains in Firebase Console
2. Set up custom domain if needed
3. Configure hosting rules
4. Deploy to your hosting platform

### 8. Security Checklist

- ✅ Authentication enabled
- ✅ Firestore rules deployed
- ✅ Storage rules deployed
- ✅ File size limits enforced
- ✅ User permissions properly set
- ✅ Environment variables configured
- ✅ Domain authorized in Firebase Console 