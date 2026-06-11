// firebase-config.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCZ1o51tJOyc8RAvudllScdkCSQ3Db5Y-Q",
  authDomain: "here-6b1b4.firebaseapp.com",
  projectId: "here-6b1b4",
  storageBucket: "here-6b1b4.firebasestorage.app",
  messagingSenderId: "664481977011",
  appId: "1:664481977011:web:c2dfffc29e05fb5ea4d6c6",
  measurementId: "G-0TWSLJ8X42",
};
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
