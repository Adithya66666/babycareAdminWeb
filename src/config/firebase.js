import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyAt-JUESE-LNuOVK6MR4t13eLHsHIGCgSY",
  authDomain: "babycare-51f66.firebaseapp.com",
  databaseURL: "https://babycare-51f66-default-rtdb.firebaseio.com",
  projectId: "babycare-51f66",
  storageBucket: "babycare-51f66.appspot.com",
  messagingSenderId: "488176076945",
  appId: "1:488176076945:web:3856e11adadce061401730",
  measurementId: "G-0KX9Y4349R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const database = getDatabase(app)