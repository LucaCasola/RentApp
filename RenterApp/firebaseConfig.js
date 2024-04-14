// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpVlBTOJds05Ll8VRgYGpH7jDiQPQYEDU",
  authDomain: "rentathing-b90cf.firebaseapp.com",
  projectId: "rentathing-b90cf",
  storageBucket: "rentathing-b90cf.appspot.com",
  messagingSenderId: "704832894082",
  appId: "1:704832894082:web:0600bb4551502df3d8709b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore services (database, authentication and storage)
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

// Export the Firestore services from this js file so other parts of your app can use it
export { db }
export { auth }
export { storage }