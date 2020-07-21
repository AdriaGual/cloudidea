import * as firebase from "firebase/app";
import "firebase/firestore";

// Agregar configuración firebase:
var firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  databaseURL: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);
let db = firebase.firestore();

export { db, firebase };
