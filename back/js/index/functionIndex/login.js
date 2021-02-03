$(document).ready(function () {
    // switch to register or login
    $('#btn-login').on('click', function () {
        event.preventDefault()
        $('.ctnr-form-register').css('display', 'none');
        $('.ctnr-form-login').css('display', 'flex')
    })

    $('#btn-register').on('click', function () {
        event.preventDefault()
        $('.ctnr-form-register').css('display', 'flex')
        $('.ctnr-form-login').css('display', 'none')
    })

    // $('#form-register').on('submit', createUser);
    $('.form-login').on('submit', loginUser);

    function loginUser() {
        event.preventDefault();
        const loginMail = $('#login-mail').val().trim();
        const loginPassword = $('#login-password').val().trim();

        error = []

        if (loginMail < 1) {
            $('#login-mail').css('border', '1px solid red');
            $('#login-mail').attr('placeholder', 'Veuillez remplir ce champ');
            error.push(loginMail)
        } else {
            $('#login-mail').css('border', 'none');
        }

        if (loginPassword < 1) {
            error.push(loginPassword)
            $('#login-password').css('border', '1px solid red');
            $('#login-password').attr('placeholder', 'Veuillez remplir ce champ');
        } else {
            $('#login-password').css('border', 'none');
        }

        if (error.length === 0) {

            firebase.auth().signInWithEmailAndPassword(loginMail, loginPassword).then(function (result) {
                console.log('Succès de connexion', result);
                $('.form-login')[0].reset();

                const userRef = firebase.firestore().collection('users').doc(result.user.uid);

                userRef.get().then(function (doc) {
                    if (doc.exists) {
                        if (doc.data().grade == "admin") document.location.href = './front/admin.html';
                        if (doc.data().grade == "former") document.location.href = './front/former.html';
                        if (doc.data().grade == "student") document.location.href = './front/student.html';
                        if (doc.data().grade == "") alert("Des admin s'occupent de vous. Vous pourrez vous connecter très bientôt")
                        console.log("Document data:", doc.data());
                    }
                })
            }).catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);

                switch (errorCode) {
                    case 'auth/user-not-found':
                        $('#login-mail').val('');
                        $('#login-mail').css('border', '1px solid red');
                        $('#login-mail').attr('placeholder', 'mail incorrect');
                        break;
                    case 'auth/wrong-password':
                        $('#login-password').val('');
                        $('#login-password').css('border', '1px solid red');
                        $('#login-password').attr('placeholder', 'mot de passe incorrect');
                        break

                    default:
                        break;
                }
            });
        }
    }
})