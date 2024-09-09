// Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyDzyTp7KooNYF8_oVgqnld1J48tbNq1pUQ",
    authDomain: "blogging-website-62875.firebaseapp.com",
    projectId: "blogging-website-62875",
    storageBucket: "blogging-website-62875.appspot.com",
    messagingSenderId: "24351806054",
    appId: "1:24351806054:web:98efa74c368420a446d3a7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
let db = firebase.firestore();
let auth = firebase.auth();

// Logout user function
const logoutUser = () => {
    auth.signOut();
    location.reload();
}
