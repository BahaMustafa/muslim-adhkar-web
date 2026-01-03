// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCLHxEfCwoPUoMkU7rAWCY6g_Xzo8hU2Wc",
    authDomain: "muslimadhkar-8c937.firebaseapp.com",
    projectId: "muslimadhkar-8c937",
    storageBucket: "muslimadhkar-8c937.firebasestorage.app",
    messagingSenderId: "1048927207806",
    appId: "1:1048927207806:web:19e4e78bd1d0e68899b32f",
    measurementId: "G-GJTW08WJTY"
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let analytics: ReturnType<typeof getAnalytics> | undefined;

if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

export { app, analytics };
