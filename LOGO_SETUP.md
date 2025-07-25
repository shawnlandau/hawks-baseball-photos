# Adding Your Custom Logo

## Quick Setup

To add your own logo to the Hawks Baseball Photos app, follow these steps:

### 1. Prepare Your Logo Files

Create these image files with your Hawks Baseball logo:

- **`logo192.png`** - 192x192 pixels (PNG format)
- **`logo512.png`** - 512x512 pixels (PNG format) 
- **`favicon.ico`** - 32x32 pixels (ICO format)

### 2. Replace the Files

Replace the placeholder files in the `public/` folder:

```bash
# Copy your logo files to the public folder
cp your-logo-192.png public/logo192.png
cp your-logo-512.png public/logo512.png
cp your-favicon.ico public/favicon.ico
```

### 3. Restart the Development Server

The changes will be automatically picked up, but you can restart if needed:

```bash
npm start
```

## Logo Specifications

### Recommended Logo Design:
- **Size**: 192x192px for main logo, 512x512px for larger displays
- **Format**: PNG with transparent background
- **Style**: Should work well on blue background (header uses blue gradient)
- **Colors**: Consider using colors that contrast well with blue/white

### Header Logo:
- The logo appears in the top-left corner of the app
- Size: 48x48 pixels (12x12 in Tailwind classes)
- Has rounded corners and shadow for modern look
- Falls back to SVG icon if image fails to load

### Browser Icons:
- **Favicon**: 32x32px ICO file for browser tabs
- **App Icons**: 192x192px and 512x512px for PWA features

## Current Logo Location

The logo appears in:
1. **Browser tab** (favicon.ico)
2. **Header** (logo192.png)
3. **PWA manifest** (logo192.png and logo512.png)
4. **Mobile home screen** (when installed as PWA)

## Testing Your Logo

After adding your logo:
1. Refresh the browser to see the new favicon
2. Check the header logo appears correctly
3. Test on mobile devices for PWA installation
4. Verify the logo looks good on the blue header background

## Customization Options

If you want to modify the logo styling, edit the `src/App.js` file around line 930:

```jsx
<img 
  src="/logo192.png" 
  alt="Hawks Baseball Logo" 
  className="w-12 h-12 mr-3 rounded-lg shadow-md"
  // You can modify these classes to change size, spacing, etc.
/>
```

Common modifications:
- `w-12 h-12` - Change logo size
- `mr-3` - Adjust spacing from text
- `rounded-lg` - Change border radius
- `shadow-md` - Modify shadow 