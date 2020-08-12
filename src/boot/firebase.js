// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC9E7w6Pic4uDv6xoF-Pupw4Q16YdPA1pE",
  authDomain: "cloudidea-77e8d.firebaseapp.com",
  databaseURL: "https://cloudidea-77e8d.firebaseio.com",
  projectId: "cloudidea-77e8d",
  storageBucket: "cloudidea-77e8d.appspot.com",
  messagingSenderId: "589808539346",
  appId: "1:589808539346:web:efbf940cd718192edcbf0b"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebaseApp.auth();
const firebaseDB = firebaseApp.database();
const firebaseStorage = firebaseApp.storage();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

export { firebaseAuth, firebaseDB, firebaseStorage, googleAuthProvider, facebookAuthProvider };
