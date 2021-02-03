// Configuration Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyAH1Gt45o7lBlj7La8jg6ivX0BjKjfhOSU',
    authDomain: 'studentmanager-3339f.firebaseapp.com',
    databaseURL: 'https://studentmanager-3339f.firebaseio.com',
    projectId: 'studentmanager-3339f',
    storageBucket: 'studentmanager-3339f.appspot.com',
    messagingSenderId: '49045576934',
    appId: '1:49045576934:web:5419271b3a1ff5dd706f27'
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);


$(document).ready(function () {


    $(window).resize('width', function () {
        if ($(window).width() <= 545) {
            $("textarea").attr({
                "cols": 30,
                "row": 1
            });
        } else if ($(window).width() > 545) {
            $("textarea").attr({
                "cols": 50,
                "row": 4
            });
        }
    });

    $('#current-picture').on('click', function () {
        $('.picture-change').css('display', 'block')
    })

})