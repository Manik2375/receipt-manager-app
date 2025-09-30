# 📄 Receipt Manager App

A modern React Native application built with Expo for organizing and managing your receipts digitally. Keep track of your purchases, warranties, and important documents all in one place.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure login with your Google account
- 📱 **Cross-platform** - Works on both iOS and Android
- 📷 **Image Upload** - Capture and store receipt photos
- 📅 **Date Management** - Track purchase and warranty expiry dates
- 🗂️ **Receipt Organization** - View all your receipts in a clean card layout
- ✏️ **Edit & Delete** - Modify or remove receipts as needed
- 🔄 **Real-time Sync** - Data synced across devices via Appwrite
- 📱 **Responsive Design** - Optimized for mobile devices

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Appwrite (BaaS)
- **Authentication**: Google OAuth via Appwrite
- **Storage**: Appwrite Storage for images
- **Database**: Appwrite Databases
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet
- **Build Tool**: EAS Build

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for local builds)
- Appwrite account and project

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/receipt-manager-app.git
cd receipt-manager-app
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://your-appwrite-endpoint
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your-project-id
EXPO_PUBLIC_DATABASE_ID=your-database-id
EXPO_PUBLIC_BUCKET_ID=your-bucket-id
```

### 4. Appwrite Configuration

1. Create an Appwrite project
2. Set up Google OAuth provider
3. Create a database with the following collections:
   - `users` - User profiles
   - `receipt` - Receipt data
4. Create a storage bucket for receipt images
5. Configure appropriate permissions

### 5. Run the application

```bash
# Start the development server
expo start

# Run on Android
expo start --android

# Run on iOS
expo start --ios
```

## 📱 Building APK

### Cloud Build (Recommended for beginners)

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS
eas build:configure

# Build APK
eas build --platform android --profile preview
```

### Local Build (Faster, requires setup)

```bash
# Build locally (requires Android SDK)
eas build --platform android --profile preview --local
```

## 📁 Project Structure

```
receipt-manager-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── index.tsx          # Login screen
│   │   ├── (main)/
│   │   │   ├── index.tsx          # Main receipts list
│   │   │   └── addReceipt.tsx     # Add receipt form
│   │   └── _layout.tsx
│   ├── components/
│   │   └── Themed.tsx
│   ├── lib/
│   │   └── appwrite.ts            # Appwrite configuration
│   └── services/
│       ├── auth.ts                # Authentication service
│       └── receipt.ts             # Receipt CRUD operations
├── assets/                        # Images and static files
├── app.json                       # Expo configuration
├── eas.json                       # EAS Build configuration
└── package.json
```
## 🎯 Usage

1. **Login**: Use your Google account to sign in
2. **Add Receipt**: Tap "Add Receipt" to create a new entry
3. **Fill Details**: Enter receipt name and select dates
4. **Upload Image**: Take a photo or select from gallery
5. **View Receipts**: Browse all your receipts in the main screen
6. **Manage**: Edit or delete receipts as needed

## 🛡️ Security

- Google OAuth for secure authentication
- Row-level security with Appwrite
- User-specific data isolation
- Secure image storage



## 🔮 Future Enhancements

- [ ] OCR text extraction from receipts
- [ ] Category-based receipt organization
- [ ] Expense analytics and reporting
- [ ] Receipt sharing functionality
- [ ] Offline mode support
- [ ] Export to PDF/CSV
