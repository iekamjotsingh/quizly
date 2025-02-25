import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTftRwGhQB_JemlrDJrN0ZwkspDgVyn7k",
  authDomain: "kidsquiz-cb015.firebaseapp.com",
  projectId: "kidsquiz-cb015",
  storageBucket: "kidsquiz-cb015.appspot.com",
  messagingSenderId: "241365660829",
  appId: "1:241365660829:web:c4d38a53dd79fcd745d074",
  measurementId: "G-M6J813RNPF"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Initialize Analytics only in production and browser environment
let analytics = null;
if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const db = getFirestore(app);

export { analytics };