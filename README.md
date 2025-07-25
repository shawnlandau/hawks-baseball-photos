# Hawks Baseball Photos

A React.js web application for sharing photos from 12U baseball tournaments. Built with Firebase for authentication, storage, and real-time updates.

## Features

- **User Authentication**: Email/password signup and login
- **Photo Upload**: Upload images with optional captions
- **Real-time Gallery**: View all photos in a responsive masonry layout with real-time updates
- **Multi-Photo Selection**: Click photos to select multiple items for batch operations
- **Photo Deletion**: Delete selected photos with confirmation modal
- **Lightbox View**: Click photos to view in full-screen lightbox with navigation
- **Like System**: Like and unlike photos with real-time like count updates
- **Comment System**: Add comments to photos with real-time updates
- **Photo Download**: Download photos directly from the lightbox
- **Modern UI**: Clean, responsive design using Tailwind CSS and Inter font
- **Error Handling**: Modal-based error messages and user feedback

## Technology Stack

- **Frontend**: React.js 18
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Authentication, Cloud Firestore, Cloud Storage)
- **Font**: Inter (Google Fonts)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Authentication, Firestore, and Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hawks-baseball-photos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the root directory with your Firebase configuration:
   ```
   REACT_APP_FIREBASE_CONFIG={"apiKey":"your-api-key","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-project.appspot.com","messagingSenderId":"123456789","appId":"your-app-id"}
   REACT_APP_APP_ID=your-app-id
   ```

   **Note**: Replace the placeholder values with your actual Firebase project configuration.

4. **Configure Firebase Security Rules**

   **Firestore Rules** (for the `artifacts/{appId}/public/data/photos` collection and subcollections):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/photos/{photoId} {
      allow read: if true;  // Anyone can read photos
      allow write: if request.auth != null;  // Only authenticated users can upload

      // Rules for likes subcollection
      match /likes/{userId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null && request.auth.uid == userId;
        allow delete: if request.auth != null && request.auth.uid == userId;
      }

      // Rules for comments subcollection
      match /comments/{commentId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
        allow update: if request.auth != null && request.auth.uid == resource.data.commentedBy;
        allow delete: if request.auth != null && request.auth.uid == resource.data.commentedBy;
      }
    }
  }
}
```

   **Storage Rules** (for the `artifacts/{appId}/public/data/photos` path):
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /artifacts/{appId}/public/data/photos/{allPaths=**} {
         allow read: if true;  // Anyone can read photos
         allow write: if request.auth != null;  // Only authenticated users can upload
       }
     }
   }
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

## Usage

1. **Sign Up/Login**: Create an account or log in with your email and password
2. **Upload Photos**: Click the "Upload" tab to select and upload images with optional captions
3. **View Gallery**: Browse all uploaded photos in the responsive masonry layout
4. **Select Photos**: Click on photos to select them (selected photos show a blue border and checkmark)
5. **Delete Photos**: Select multiple photos and click "Delete Selected" to remove them
6. **Lightbox View**: Click on any photo to open it in full-screen lightbox
7. **Like Photos**: Click the heart icon in the lightbox to like/unlike photos
8. **Add Comments**: Type comments in the lightbox and click "Post" to add them
9. **Download Photos**: Click the download button in the lightbox to save photos
10. **Navigate Photos**: Use arrow buttons in the lightbox to browse through photos
11. **Real-time Updates**: New photos, likes, and comments appear automatically

## Project Structure

```
hawks-baseball-photos/
├── public/
│   ├── index.html          # Main HTML entry point
│   └── manifest.json       # PWA manifest
├── src/
│   ├── App.js             # Main React application component
│   ├── index.js           # React entry point
│   └── index.css          # Tailwind CSS and global styles
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── README.md             # This file
```

## Firebase Configuration

The app supports multiple Firebase configuration sources:

1. **Environment Variables**: `REACT_APP_FIREBASE_CONFIG` (JSON string)
2. **Canvas Environment**: `__firebase_config` global variable
3. **App ID**: `REACT_APP_APP_ID` or `__app_id` for storage paths

## Deployment

### Netlify
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Deploy automatically on push to main branch

### Vercel
1. Import your repository to Vercel
2. Configure environment variables
3. Deploy with automatic builds

## Security Considerations

- All photo uploads require authentication
- Firebase security rules restrict access appropriately
- User IDs are truncated in the UI for privacy
- Error messages are user-friendly without exposing sensitive information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Hawks Baseball Photos** - Built for the 12U baseball community 