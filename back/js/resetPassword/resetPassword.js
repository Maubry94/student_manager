// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAH1Gt45o7lBlj7La8jg6ivX0BjKjfhOSU",
  authDomain: "studentmanager-3339f.firebaseapp.com",
  databaseURL: "https://studentmanager-3339f.firebaseio.com",
  projectId: "studentmanager-3339f",
  storageBucket: "studentmanager-3339f.appspot.com",
  messagingSenderId: "49045576934",
  appId: "1:49045576934:web:5419271b3a1ff5dd706f27",
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

$(document).ready(function () {
  $(".form-reset-password").on("submit", function (e) {
    e.preventDefault();

    const emailAddress = $("#mail").val().trim();

    auth
      .sendPasswordResetEmail(emailAddress)
      .then(function () {
        alert("Mail envoyer !");
        $(".form-reset-password")[0].reset();
        document.location.href = "../index.html";
      })
      .catch(function (error) {
        // An error happened.
      });
  });
});
