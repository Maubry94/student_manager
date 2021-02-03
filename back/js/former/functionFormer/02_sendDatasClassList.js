$(document).ready(function () {

    const usersRef = firebase.firestore().collection('users');
    const summary = firebase.firestore().collection('studentSummary');
    const classFirestore = firebase.firestore().collection('class');

    let isGood = []

    firebase.auth().onAuthStateChanged(function (user) {
        var currentUserConnected = firebase.auth().currentUser;


        if (currentUserConnected != null) {
            uid = user.uid;

            const datasUser = firebase.firestore().collection('users').doc(uid);

            // Get the current former connected
            datasUser.get().then(function (doc) {

                if (doc.exists) {

                    userName = doc.data().username

                    $('.form-list').on('submit', function (e) {
                        e.preventDefault()

                        $('.send-message').remove()

                        // Get the current date
                        const todayDay = $("#datepicker").datepicker("setDate", "today");

                        classFirestore.onSnapshot(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {

                                // Get the subject with current date
                                classFirestore.doc(doc.id).collection('subject').where("date", "==", todayDay.val()).onSnapshot(function (querySnapshot) {
                                    querySnapshot.forEach(function (doc) {

                                        // Get the name of class
                                        let className = doc.data().classname

                                        // Comparate former Name and the current former connected
                                        if (doc.data().former == userName) {

                                            // Get the message of student to know if he is late or absent
                                            usersRef.onSnapshot(function (querySnapshot) {
                                                querySnapshot.forEach(function (doc) {

                                                    console.log(className)

                                                    if (className == doc.data().class) {
                                                        console.log(doc.data())
                                                        // If radio not checked
                                                        if ($(`#check-present${doc.id}`).is(':checked') == false && $(`#check-late${doc.id}`).is(':checked') == false && $(`#check-absent${doc.id}`).is(':checked') == false) {
                                                            isGood.push(false)
                                                        } else {
                                                            isGood.push(true)
                                                        }

                                                        for (let i = 0; i < isGood.length; i++) {
                                                            if (isGood[i] == false) {
                                                                $('<p class="error-class-list">Tous les cases ne sont pas cocher</p>').insertAfter("#display-class-list");
                                                                setTimeout(() => {
                                                                    $('.error-class-list').remove()
                                                                }, 5000);
                                                                setTimeout(() => {
                                                                    isGood = []
                                                                }, 1000);
                                                            }
                                                        }

                                                        // Send data only if all radios checked
                                                        if (isGood.indexOf(false) == -1) {
                                                            setTimeout(() => {
                                                                isGood = []
                                                            }, 1000);

                                                            if ($(`#check-present${doc.id}`).is(':checked') == true) {
                                                                summary.doc().set({
                                                                    day: todayDay.val(),
                                                                    late: false,
                                                                    absent: false,
                                                                    present: true,
                                                                    justif: "",
                                                                    class: doc.data().class,
                                                                    name: doc.data().name,
                                                                    username: doc.data().username,
                                                                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                                                                });

                                                            } else if ($(`#check-late${doc.id}`).is(':checked') == true) {

                                                                const lateMessage = $(`.late${doc.id}`).html()

                                                                summary.doc().set({
                                                                    day: todayDay.val(),
                                                                    late: true,
                                                                    absent: false,
                                                                    present: false,
                                                                    justif: lateMessage,
                                                                    class: doc.data().class,
                                                                    name: doc.data().name,
                                                                    username: doc.data().username,
                                                                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                                                                });

                                                            } else if ($(`#check-absent${doc.id}`).is(':checked') == true) {

                                                                const absentMessage = $(`.ctnr-absent .absent${doc.id}`).html()

                                                                summary.doc().set({
                                                                    day: todayDay.val(),
                                                                    late: false,
                                                                    absent: true,
                                                                    present: false,
                                                                    justif: absentMessage,
                                                                    class: doc.data().class,
                                                                    name: doc.data().name,
                                                                    username: doc.data().username,
                                                                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                                                                });

                                                            }

                                                        }
                                                    }
                                                })
                                            })
                                        }
                                    })
                                })
                            })
                        })
                    })
                }
            })
        }
    })
})