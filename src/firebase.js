import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if environment variables are loaded
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Verify config has values before initializing
const missingValues = Object.entries(firebaseConfig)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingValues.length > 0) {
    console.error('Firebase initialization error: Missing environment variables:', missingValues);
    // You could set fallback values here if needed for development
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export everything needed
export { 
    auth, 
    db, 
    storage, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    sendEmailVerification,
    sendPasswordResetEmail,
    signOut
};