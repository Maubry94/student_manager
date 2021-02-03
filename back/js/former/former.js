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

$(document).ready(function(){
    
    if($('#modify-list').attr('disabled')){
        $('#modify-list').css({
            'opacity': '0.3',
            'cursor' : 'default'
        })
    }

    $('#send-list').on('click', function(e){
        $('#modify-list').removeAttr("disabled")
        $('#modify-list').css({
            'opacity' : 1,
            'cursor' : 'pointer'
        })
    })
})