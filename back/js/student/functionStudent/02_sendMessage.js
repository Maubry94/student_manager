/**
 * Send message (convert the date in string)
 * send datas to dataBase
*/

$(document).ready(function () {

    const datepicker = $('#datepicker').datepicker().datepicker('setDate', 'today');

    const datepickerVal = datepicker.val()


    firebase.auth().onAuthStateChanged(function (user) {

        var currentUserConnected = firebase.auth().currentUser;

        if (currentUserConnected != null) {

            uid = user.uid;

            const datasUser = firebase.firestore().collection('users').doc(uid);

            datasUser.get().then(function (doc) {

                if (doc.exists) {

                    $('#student-message').on('submit', function (e) {

                        e.preventDefault()

                        let lateChecked = $('#student-late').is(':checked')
                        let absentChecked = $('#student-absent').is(':checked')
                        let message = $('#justif').val().trim();

                        if (message.length <= 0) {
                            $('#justif').css('border', '1px solid red');
                            $('#justif').attr('placeholder', 'Veuillez remplir ce champ');
                        }

                        if (lateChecked == false && absentChecked == false) {
                            $("<p>Veuillez selectionner si vous êtes en retard ou absent</p>").insertAfter(".student-message-ctnr");
                        }

                        if (lateChecked == true && message.length > 0 || absentChecked == true && message.length > 0) {
                            firebase.firestore().collection('users').doc(uid).collection('status').doc().set({
                                day: datepickerVal,
                                late: lateChecked,
                                absent: absentChecked,
                                message: message,
                                class: doc.data().class,
                                name: doc.data().name
                            });
                            $('textarea').css('border 1px solid', 'grey')
                            $('<p class="send-data-message">Votre message à bien été transférer à votre formateur</p>').insertAfter(".student-message-ctnr");
                            $('#student-message')[0].reset();
                            setTimeout(() => {
                                $('.send-data-message').remove()
                            }, 5000);
                        }
                    });
                }
            })
        }
    });
})