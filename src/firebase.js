import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_APIKEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGINGID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
};

const firebaseApp = firebase.initializeApp(firebaseConfig);  //initializing a firebase app
const db = firebaseApp.firestore(); //connecting database
const auth = firebase.auth(); //setting up authentication
const provider = new firebase.auth.GoogleAuthProvider();  //setting up authentication provider (it will help in adding google login)
const storage = firebase.storage();  //for storing pictures, videos 

export { auth, provider, storage};
export default db;