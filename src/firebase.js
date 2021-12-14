import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAG_Wa2ANl7KuAmFtcciKHfqVsAwisSBFU",
  authDomain: "react-messenger-15789.firebaseapp.com",
  projectId: "react-messenger-15789",
  storageBucket: "react-messenger-15789.appspot.com",
  messagingSenderId: "723110889203",
  appId: "1:723110889203:web:30ef72cff80c67613a1986",
  measurementId: "G-N4SKC2CN2E"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
export { auth, db, storage };