import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";

const app = firebase.initializeApp({
    apiKey: "AIzaSyCNf_BAnD1nugLnp-MdDDlBk_hjn69XPoM",
    authDomain: "omnia-tournaments.firebaseapp.com",
    projectId: "omnia-tournaments",
    storageBucket: "omnia-tournaments.appspot.com",
    messagingSenderId: "64719695036",
    appId: "1:64719695036:web:e7c15e86debb8176eeb4b9",
    measurementId: "G-YYWJTBZGSJ"
});

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const analytics = firebase.analytics()

export default app