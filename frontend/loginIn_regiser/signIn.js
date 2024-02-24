import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {getDatabase,set,ref,get,child} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js"
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js"
const firebaseConfig = {
  apiKey: "AIzaSyA62HL7LD6gf5-7IGPr9zgNdTbtzmEQfKI",
  authDomain: "login-with-firebase-data-27078.firebaseapp.com",
  projectId: "login-with-firebase-data-27078",
  storageBucket: "login-with-firebase-data-27078.appspot.com",
  messagingSenderId: "1098400540900",
  appId: "1:1098400540900:web:8a9c9cb426bfb9c9a664f1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const database = getDatabase(app)
const dbref = ref(database)
    export function login () {
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
      /*if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
    }*/
    signInWithEmailAndPassword(auth,email, password)
    .then((credentials)=>{
        get(child(dbref,'UserAuthList/'+credentials.user.uid)).then((snapshot)=>{
            if(snapshot.exists){
                sessionStorage.setItem("user-info",JSON.stringify({
                    user_fullname  : snapshot.val().full_name,
                }))
                sessionStorage.setItem("user-creds",JSON.stringify(credentials.user));
                window.location.href = 'https://demo.chatscope.io/chat';
            }
        })
    })
    .catch(function(error) {
      var error_code = error.code
      var error_message = error.message
      alert(error_message)
    })
  }
  document.getElementById('loginButton').addEventListener('click',function(){
    login();
  })   
