/**
 * Display the current subject
 */
$(document).ready(function () {
    const classFirestore = firebase.firestore().collection('class');

    const datepicker = $('#datepicker').datepicker().datepicker('setDate', 'today');

    const datepickerVal = datepicker.val()

    firebase.auth().onAuthStateChanged(function (user) {

        var currentUserConnected = firebase.auth().currentUser;

        if (currentUserConnected != null) {

            uid = user.uid;

            const datasUser = firebase.firestore().collection('users').doc(uid);

            datasUser.get().then(function (doc) {

                if (doc.exists) {
                    classFirestore.where("class", "==", doc.data().class).onSnapshot(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            classFirestore.doc(doc.id).collection('subject').where("date", "==", datepickerVal).onSnapshot(function (querySnapshot) {
                                querySnapshot.forEach(function (doc) {

                                    let hourSplit = doc.data().time.split('-')

                                    $('.current-subject-late-absent').prepend(
                                        `
                                        <h3>Pour un cours de : 
                                        <span>${doc.data().subject}</span> 
                                        le ${doc.data().date} de ${hourSplit[0]}h à ${hourSplit[1]}h
                                        </h3>
                                        `
                                    )
                                })
                            })
                        })
                    })
                }
            })
        }
    })
})