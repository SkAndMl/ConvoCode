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
export function register(){
    var email = document.getElementById('email').value
    var password = document.getElementById('password').value
    var full_name = document.getElementById('full_name').value
    function validate_password(password) {
      if (password < 6) {
        return false
      } else {
        return true
      }
    }
    function validate_field(field) {
      if (field == null) {
        return false
      }
      if (field.length <= 0) {
        return false
      } else {
        return true
      }
    } 
    if (validate_password(password) == false) {
      alert('Email or Password is Outta Line!!')
      return
    }
    if (validate_field(full_name) == false){
      alert('One or More Extra Fields is Outta Line!!')
      return
    }
    createUserWithEmailAndPassword(auth,email, password)
    .then((credentials)=>{
      set(ref(database,'UserAuthList/'+credentials.user.uid),{
        user_fullname : full_name,
        user_lastLogin : Date.now()
      })
      window.location.href = 'https://demo.chatscope.io/chat';
    })
    .catch(function(error) {
      var error_code = error.code
      var error_message = error.message
      alert(error_message)
    })
  }
  document.getElementById('registerButton').addEventListener('click',function() {
    register();}
    )