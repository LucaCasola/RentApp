// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// 1. import the firestore service
import { getFirestore } from "firebase/firestore";

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

// 2. initialize Firestore service
const db = getFirestore(app)

// 3. export the Firestore service from this js file so other parts of your app can use it
export { db }