# 🏟️ Hawks Baseball Photo Gallery

A modern, responsive photo-sharing platform designed specifically for the Hawks 12U Baseball team's Cooperstown Dreams Park 2025 tournament experience. This platform embodies the traditions and values of Dreams Park while providing a seamless way for players, families, and coaches to capture and share memories.

## ✨ Features

### 🎨 **Design & Branding**
- **Hawks Team Branding**: Prominent use of the Hawks logo with navy, red, and white color scheme
- **Cooperstown Dreams Park Theme**: Patriotic design reflecting tournament values of faith, tradition, and country
- **Modern UI/UX**: Clean, accessible design with consistent typography and responsive layout
- **Mobile-First**: Optimized for phones, tablets, and desktops

### 🔐 **Enhanced Authentication**
- **Email/Password Sign Up/Sign In**: Secure authentication with validation
- **Google Authentication**: One-click sign-in for convenience
- **Password Strength Indicators**: Real-time password validation
- **Show/Hide Password**: Enhanced security with user control
- **Form Validation**: Comprehensive client-side validation

### 📸 **Photo Gallery**
- **Responsive Grid Layout**: Beautiful photo display with hover effects
- **Advanced Filtering**: Filter by player tags, date, and search terms
- **Sorting Options**: Sort by date, likes, or comments
- **Lightbox View**: Full-screen photo viewing with navigation
- **Like & Comment System**: Social features for engagement
- **Bulk Selection**: Select multiple photos for management

### ⬆️ **Photo Upload**
- **Drag & Drop Interface**: Intuitive file upload experience
- **Multiple File Support**: Upload multiple photos at once
- **Progress Indicators**: Real-time upload progress
- **Image Resizing**: Automatic client-side image optimization
- **Player Tagging**: Tag Hawks team members in photos
- **Album Organization**: Organize photos by game or event
- **File Validation**: Secure file type and size checking

### 📅 **Tournament Schedule**
- **Complete Itinerary**: Day-by-day tournament schedule
- **Game Information**: Times, locations, and opponents
- **Event Categories**: Games, ceremonies, practices, meals
- **Dreams Park Values**: Information about tournament traditions
- **Interactive Filtering**: Filter by day or event type

### 🗺️ **Dreams Park Map**
- **Interactive Layout**: Visual map of Dreams Park facilities
- **Location Categories**: Fields, amenities, parking, shopping
- **Detailed Information**: Descriptions and directions for each location
- **Quick Links**: Direct access to Google Maps and official website
- **Park Information**: Hours, services, and important notes

### 📱 **Mobile Responsiveness**
- **Touch-Friendly**: Optimized for mobile devices
- **Responsive Navigation**: Collapsible mobile menu
- **Touch Gestures**: Swipe and tap interactions
- **Fast Loading**: Optimized performance for mobile networks

## 🚀 **Getting Started**

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase project with Authentication, Firestore, and Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shawnlandau/hawks-baseball-photos.git
   cd hawks-baseball-photos
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password and Google)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase config

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_FIREBASE_CONFIG={"apiKey":"your-api-key","authDomain":"your-project.firebaseapp.com","projectId":"your-project-id","storageBucket":"your-project.appspot.com","messagingSenderId":"your-sender-id","appId":"your-app-id"}
   ```

5. **Deploy Firebase Security Rules**
   ```bash
   firebase deploy --only firestore:rules,storage
   ```

6. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🏗️ **Project Structure**

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation component
│   ├── AuthForm.js     # Authentication forms
│   ├── PhotoGallery.js # Photo display and management
│   └── PhotoUpload.js  # Photo upload functionality
├── pages/              # Page components
│   ├── HomePage.js     # Landing page
│   ├── SchedulePage.js # Tournament schedule
│   ├── MapPage.js      # Dreams Park map
│   └── AboutPage.js    # Team and platform information
├── contexts/           # React contexts
│   └── FirebaseContext.js # Firebase service provider
├── hooks/              # Custom React hooks
│   └── useFirebase.js  # Firebase hook
├── utils/              # Utility functions
└── assets/             # Static assets
```

## 🎨 **Design System**

### Color Palette
- **Hawks Navy**: `#1e3a8a` - Primary brand color
- **Hawks Red**: `#dc2626` - Accent color
- **Hawks Gold**: `#fbbf24` - Highlight color
- **White**: `#ffffff` - Background and text
- **Gray Scale**: Various shades for UI elements

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700, 800
- **Responsive Sizing**: Scales appropriately across devices

### Components
- **Consistent Spacing**: 8px base unit system
- **Border Radius**: 8px for cards, 4px for buttons
- **Shadows**: Subtle elevation system
- **Transitions**: 200ms ease-in-out for interactions

## 🔧 **Configuration**

### Firebase Setup
1. **Authentication**
   - Enable Email/Password authentication
   - Enable Google authentication
   - Configure authorized domains

2. **Firestore Database**
   - Create collections for photos and user data
   - Set up security rules for data protection
   - Configure indexes for optimal queries

3. **Storage**
   - Set up storage buckets for photo uploads
   - Configure security rules for file access
   - Set up CORS for cross-origin requests

### Environment Variables
```env
REACT_APP_FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
```

## 🚀 **Deployment**

### Netlify Deployment
1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `build`
     - Node version: `18`

2. **Environment Variables**
   - Add Firebase configuration to Netlify environment variables
   - Set up domain and SSL certificate

3. **Deploy**
   - Netlify will automatically deploy on git push
   - Preview deployments for pull requests

### Manual Deployment
```bash
npm run build
# Upload the build folder to your hosting provider
```

## 🧪 **Testing**

### Running Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Manual Testing Checklist
- [ ] Authentication (sign up, sign in, sign out)
- [ ] Photo upload (single and multiple files)
- [ ] Photo gallery (viewing, filtering, sorting)
- [ ] Photo management (likes, comments, deletion)
- [ ] Navigation (all pages and routes)
- [ ] Mobile responsiveness
- [ ] Accessibility features

## 🔒 **Security**

### Authentication
- Secure user authentication with Firebase Auth
- Password strength requirements
- Session management
- Protected routes

### Data Protection
- Firestore security rules
- Storage access controls
- Input validation and sanitization
- XSS protection

### File Upload Security
- File type validation
- File size limits (10MB max)
- Image resizing and optimization
- Secure storage paths

## 📱 **Accessibility**

### Features
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Proper focus indicators and order
- **Alt Text**: Descriptive alt text for all images

### Testing
- Test with screen readers (NVDA, JAWS, VoiceOver)
- Verify keyboard navigation
- Check color contrast ratios
- Validate semantic HTML structure

## 🤝 **Contributing**

### Development Guidelines
1. **Code Style**: Follow ESLint configuration
2. **Component Structure**: Use functional components with hooks
3. **State Management**: Use React Context for global state
4. **Error Handling**: Implement comprehensive error boundaries
5. **Performance**: Optimize for mobile and slow connections

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Cooperstown Dreams Park**: For the inspiration and values
- **Hawks Baseball Team**: For the opportunity to create this platform
- **Firebase**: For the robust backend services
- **React Community**: For the excellent tools and libraries

## 📞 **Support**

For questions or support:
- **Technical Issues**: Create an issue on GitHub
- **Feature Requests**: Submit through GitHub issues
- **Team Questions**: Contact the Hawks coaching staff

---

**Built with ❤️ for the Hawks Baseball team and the Cooperstown Dreams Park experience.** 