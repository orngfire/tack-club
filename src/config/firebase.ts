import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || ""
};

// Validate configuration in development mode
if (process.env.NODE_ENV === 'development') {
  const requiredFields = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

  if (missingFields.length > 0) {
    console.warn('⚠️ Firebase 설정 경고: 다음 필드들이 누락되었습니다:', missingFields);
    console.warn('💡 .env 파일을 확인하고 Firebase 설정 값을 추가해주세요.');
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Database and Auth instances
export const database = getDatabase(app);
export const auth = getAuth(app);

// Log database URL for debugging
console.log('Firebase Database URL configured:', firebaseConfig.databaseURL ? '✅ Set' : '❌ Missing');

export default app;