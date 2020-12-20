import firebase from 'firebase';



const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBU1f_4mYjnJWGfUvamMestDhPENl1h40I",
    authDomain: "instagram-clone-react-f8c30.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-f8c30.firebaseio.com",
    projectId: "instagram-clone-react-f8c30",
    storageBucket: "instagram-clone-react-f8c30.appspot.com",
    messagingSenderId: "407425654204",
    appId: "1:407425654204:web:674ffd7ff4a956cd0e1fb9",
    measurementId: "G-TV9GHD994G"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db, auth, storage};



