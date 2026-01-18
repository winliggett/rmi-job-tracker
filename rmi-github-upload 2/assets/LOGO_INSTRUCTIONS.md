# RMI Logo Replacement Instructions

## Current Placeholder
The app currently uses 🏗️ crane emoji as a placeholder throughout.

## Where to Add Your Logo

### 1. App Icon (Required)
**File:** `icon.png`
**Size:** 1024x1024 pixels
**Format:** PNG with transparency
**Usage:** Shows on home screen, App Store

### 2. Splash Screen (Required)
**File:** `splash.png`
**Size:** 1284x2778 pixels (iPhone 14 Pro Max)
**Format:** PNG
**Background:** Navy blue #1C3B59
**Logo:** Centered, white or light colored

### 3. Android Adaptive Icon (Required for Android)
**File:** `adaptive-icon.png`
**Size:** 1024x1024 pixels
**Format:** PNG with transparency
**Note:** Should work on colored backgrounds

### 4. Favicon (Optional - for web)
**File:** `favicon.png`
**Size:** 48x48 pixels
**Format:** PNG

---

## Design Recommendations

### Logo Style
- Simple, clean design
- Works in both color and monochrome
- Readable at small sizes (as small as 16x16)
- Professional construction industry aesthetic

### Color Palette
Use app's professional colors:
- **Primary Navy:** #1C3B59
- **White/Light:** #FFFFFF for contrast
- **Accent Orange:** #D97742 (optional)

### Safe Areas
- Leave 10% padding around edges
- Logo should be centered
- Test at multiple sizes

---

## Quick Replacement Steps

1. **Get your RMI logo file** (PNG, AI, or SVG)
2. **Create 1024x1024 PNG:**
   - Open in design software (Figma, Photoshop, Canva)
   - Export as PNG
   - Name it `icon.png`
   - Save to `/assets/` folder
3. **Create splash screen:**
   - Use 1284x2778 canvas
   - Fill with navy #1C3B59
   - Center your logo (white/light version)
   - Export as `splash.png`
4. **Rebuild app:**
   ```bash
   npx expo start --clear
   ```

---

## Need Help?

If you don't have design software, you can use:
- **Canva** (free, easy): canva.com
- **Figma** (free, professional): figma.com
- **Online PNG Resizer**: simpleimageresizer.com

Or send your logo to Win at **win@promptfulconsulting.com** and he can create the assets for you.

**Promptful Consulting**  
https://promptfulconsulting.com

---

## Current Emoji Placeholder Locations

The 🏗️ emoji currently appears in:
- `App.js` - Loading screen
- `DashboardScreen.js` - Header logo
- `JobDetailsScreen.js` - Job card header

Once you add `icon.png`, these will automatically use your logo on mobile.
For custom logo in the app UI, we can replace the emoji with an `<Image>` component.

