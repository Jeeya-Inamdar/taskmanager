import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "task-manager-ed712.firebaseapp.com",
  projectId: "task-manager-ed712",
  storageBucket: "task-manager-ed712.firebasestorage.app",
  messagingSenderId: "228052163092",
  appId: "1:228052163092:web:a88dac92c7ba061cba6501",
  measurementId: "G-YCZWNR38GY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
