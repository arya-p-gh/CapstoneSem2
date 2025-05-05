import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyCbNkxD5HYshtp9P9JnS2C3C_rpokSeQvQ",
  authDomain: "fittr-d4e50.firebaseapp.com",
  projectId: "fittr-d4e50",
  storageBucket: "fittr-d4e50.appspot.com",
  messagingSenderId: "1062712874243",
  appId: "1:1062712874243:web:b1fb5c3c4013c80e410536",
  measurementId: "G-5RL1XR24W3"
};

let app;
let auth;

try {
  console.log('Initializing Firebase with config:', firebaseConfig);
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
  
  auth = getAuth(app);
  console.log('Firebase Auth initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error('Failed to initialize Firebase: ' + error.message);
}

export { auth };
export default app; 