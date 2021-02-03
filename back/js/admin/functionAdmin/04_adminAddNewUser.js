const classFirestore = firebase.firestore().collection('class');
const usersRef = firebase.firestore().collection('users');
let isActive = false

$('.add-user').on('click', function (event) {
    event.preventDefault()

    if (isActive == false) {
        $('<div class="create-user">').insertAfter('#add-student');
        $(".create-user").append('<form id="create-student-form">');
        $(".create-user form").append(`<div class="appm"><p>Ajouter un utilisateur</></div>`);
        $(".create-user form").append(`<input type="text" placeholder="mail" value="" class="create-userMail"/>`);
        $(".create-user form").append(`<input type="text" placeholder="nom" value="" class="create-username"/>`);
        $(".create-user form").append(`<input type="text" placeholder="Prénom" value="" class="create-name"/>`);
        $(".create-user form").append(`<input type="password" placeholder="mot de passe" value="" class="create-password"/>`);
        $(".create-user form").append(`<br><input type="button" class="btn valide-update-value" value="Enregistrer" />`);
        $(".create-user form").append(`<br><input type="button" class="btn cancel-update-value" value="Annuler" />`);
        isActive = true
    }

    $('.cancel-update-value').on('click', function () {
        $('.create-user').remove()
        isActive = false
    })

    $('.valide-update-value').on('click', function () {

        // check fields form
        event.preventDefault();
        const mail = $('.create-userMail').val().trim();
        const username = $('.create-username').val().trim();
        const name = $('.create-name').val().trim();
        const password = $('.create-password').val().trim();

        error = []

        if (mail < 1) {
            $('.create-userMail').css('border', '1px solid red');
            $('.create-userMail').attr('placeholder', 'Veuillez remplir ce champ');
            error.push(mail)
        } else {
            $('.create-userMail').css('border 1px', 'black');
        }

        if (username < 1) {
            $('.create-username').css('border', '1px solid red');
            $('.create-username').attr('placeholder', 'Veuillez remplir ce champ');
            error.push(username)
        } else {
            $('.create-username').css('border 1px', 'black');
        }

        if (name < 1) {
            $('.create-name').css('border', '1px solid red');
            $('.create-name').attr('placeholder', 'Veuillez remplir ce champ');
            error.push(name)
        } else {
            $('.create-name').css('border 1px', 'black');
        }

        if (password < 1) {
            error.push(password)
            $('.create-password').css('border', '1px solid red');
            $('.create-password').attr('placeholder', 'Veuillez remplir ce champ');
        } else {
            $('.create-password').css('border 1px', 'black');
        }

        if (error.length === 0) {

            firebase.auth().createUserWithEmailAndPassword(mail, password).then(function (result) {

                // Add data to cloudfirestore with data auth
                firebase.auth().onAuthStateChanged(function (user) {
                    const email = user.email;
                    const uid = user.uid;
                    // const displayName = user.displayName;
                    // const emailVerified = user.emailVerified;
                    // const photoURL = user.photoURL;
                    // const isAnonymous = user.isAnonymous;
                    // const providerData = user.providerData;

                    if (user) {

                        // Database Connect
                        const usersRef = firebase.firestore().collection('users');

                        // add to the users database
                        usersRef.doc(uid).set({
                            username: username,
                            name: name,
                            mail: email,
                            grade: "",
                            class: "",
                        });
                    }
                });
                $('.create-user').remove()

            }).catch(function (error) {
                // Handle Errors here.
                const errorCode = error.code;

                switch (errorCode) {
                    case 'auth/invalid-email':
                        $('.create-userMail').val('');
                        $('.create-userMail').css('border', '1px solid red');
                        $('.create-userMail').attr('placeholder', 'Veuillez entrer un mail valide');
                        break;
                    case 'auth/email-already-in-use':
                        $('.create-userMail').val('');
                        $('.create-userMail').css('border', '1px solid red');
                        $('.create-userMail').attr('placeholder', 'Ce mail existe déjà');
                        break;
                    case 'auth/weak-password':
                        $('.create-password').val('');
                        $('.create-password').css('border', '1px solid red');
                        $('.create-password').attr('placeholder', 'mot de passe trop court (6 caractères min)');
                        break

                    default:
                        break;
                }
            });
        }
        isActive = false
    })
})