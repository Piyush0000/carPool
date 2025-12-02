import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
try {
  // Check if Firebase Admin is already initialized
  if (!admin.apps.length) {
    // For development, we can initialize with default credentials
    // For production, you would use a service account key file
    if (process.env.NODE_ENV === 'development') {
      admin.initializeApp();
    } else {
      // In production, you would provide service account credentials
      // This is a placeholder - you would need to provide actual credentials
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
    }
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
}

// For development, we'll use a simpler verification method
// In production, you should use proper service account credentials

// Verify Firebase ID token
export const verifyFirebaseIdToken = async (idToken: string) => {
  try {
    // For development, we'll skip actual verification
    // In production, you should properly verify the token
    if (process.env.NODE_ENV === 'development') {
      // In development, we'll try to verify but catch errors and decode manually
      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        return decodedToken;
      } catch (error) {
        // If verification fails, decode the token manually
        const decodedToken = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
        return decodedToken;
      }
    }
    
    // For production, properly verify the token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    throw error;
  }
};

// Create or update user in Firebase
export const createFirebaseUser = async (email: string, password: string, displayName?: string) => {
  try {
    // For development, we'll skip actual Firebase user creation
    // In production, you should properly create the user
    if (process.env.NODE_ENV === 'development') {
      return {
        uid: 'dev_' + Date.now(),
        email,
        displayName: displayName || email,
      };
    }
    
    // For production, properly create the user
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    return userRecord;
  } catch (error) {
    console.error('Error creating Firebase user:', error);
    throw error;
  }
};

export default admin;