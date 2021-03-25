import firebase from "firebase/app";
import "firebase/database";

const firebaseconfig = {
  apiKey: "AIzaSyAhFHyXYnwwJTm11BuAa12KI9JMbkw-r4A",
  authDomain: "chat-vue-ffeba.firebaseapp.com",
  projectId: "chat-vue-ffeba",
  storageBucket: "chat-vue-ffeba.appspot.com",
  messagingSenderId: "347979935670",
  appId: "1:347979935670:web:691a458533446ea5dedb17",
};

const db = firebase.initializeApp(firebaseconfig);

export default db;
