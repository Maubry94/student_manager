/**
 * Display current class assigned to subject
 */

$(document).ready(function () {
    const usersRef = firebase.firestore().collection('users');
    const classFirestore = firebase.firestore().collection('class');

    // Detect date selectioned
    const datepicker = $('#datepicker').datepicker({ onSelect: function (selectedDate) { } });

    let showInfoSubject = false
    let showed = false
    let showMessage = false

    let datepickerValue2 = ""
    let dateDisplay = ""



    firebase.auth().onAuthStateChanged(function (user) {
        var currentUserConnected = firebase.auth().currentUser;


        if (currentUserConnected != null) {
            uid = user.uid;

            const datasUser = firebase.firestore().collection('users').doc(uid);

            // Get the current former connected
            datasUser.get().then(function (doc) {

                if (doc.exists) {

                    userName = doc.data().username

                    classFirestore.onSnapshot(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {

                            $('#send').on('click', function () {

                                const datepickerValue = datepicker.val()

                                if (datepickerValue != datepickerValue2) {
                                    showed = false
                                    showInfoSubject = false
                                    showMessage = false
                                    datepickerValue2 = datepickerValue
                                }

                                // Get subject compared at date in dataBase (subject)
                                classFirestore.doc(doc.id).collection('subject').where("date", "==", datepickerValue).onSnapshot(function (querySnapshot) {
                                    querySnapshot.forEach(function (doc) {

                                        // If name of Current former is equal to name of subject former, display this class
                                        if (doc.data().former == userName) {

                                            if (showInfoSubject == false) {
                                                $(".name-class-subject").append(` <p> Matière: ${doc.data().subject} </p>`);
                                                $(".name-class-subject").append(` <p> Classe: ${doc.data().classname} </p>`);
                                                $(".name-class-subject").append(` <p> Horraire: ${doc.data().time} </p>`);
                                                showInfoSubject = true
                                            }

                                            usersRef.where("class", "==", doc.data().classname).get().then((function (querySnapshot) {
                                                let i = 0
                                                let displayStudent = ''

                                                if (showed == false && datepickerValue != dateDisplay) {
                                                    querySnapshot.forEach(function (doc) {
                                                        i++
                                                        // do id to td for get if student is late or absent
                                                        displayStudent +=
                                                            `
                                                                <tr class='no-edit-table'>
                                                                    <td class="student title-array">
                                                                        <label>${doc.data().username}</label>
                                                                    </td>

                                                                    <td class="student"> 
                                                                        <label>${doc.data().name}</label>
                                                                    </td> 

                                                                    <td class="present round-present${doc.id}">
                                                                        <div class="ctnr-present">
                                                                            <input type="radio" name="status${i}" id="check-present${doc.id}">
                                                                        </div>
                                                                    </td>

                                                                    <td class="delay round-late${doc.id}"> 
                                                                        <div class="ctnr-late">
                                                                        </div>
                                                                        <input type="radio" name="status${i}" id="check-late${doc.id}">
                                                                    </td>

                                                                    <td class="absence round-absent${doc.id}">
                                                                        <div class="ctnr-absent">
                                                                        </div>
                                                                        <input type="radio" name="status${i}" id="check-absent${doc.id}">
                                                                    </td>

                                                                </tr>
                                                            `
                                                    })

                                                    $(`${displayStudent}`).insertAfter(".title").innerHTML;
                                                    dateDisplay = datepickerValue
                                                    showed = true
                                                }

                                            }))
                                        }

                                        // Find student with id and display message if he is late or absent
                                        usersRef.get().then((function (querySnapshot) {
                                            querySnapshot.forEach(function (doc) {

                                                const userName = doc.data().name

                                                usersRef.doc(doc.id).collection('status').where("day", "==", datepickerValue).get().then((function (querySnapshot) {
                                                    querySnapshot.forEach(function (doc) {

                                                        const userMessage = doc.data().message

                                                        if (doc.data().late == true) {

                                                            usersRef.get().then((function (querySnapshot) {
                                                                querySnapshot.forEach(function (doc) {

                                                                    if (userName == doc.data().name && showMessage == false) {
                                                                        $(`#check-late${doc.id}`).prop("checked", true)
                                                                        $(`.round-late${doc.id}`).append(`<i class="fas fa-envelope msg-icon" id="msg${doc.id}"></i>`)


                                                                        $(`<div class="display-message"></div>`).insertAfter(`#msg${doc.id}`);
                                                                        $('.display-message').append(`<p class="late${doc.id}"> ${userMessage} </p>`)

                                                                        $(`#display-class-list`).on("mouseenter", `#msg${doc.id}`, function () {
                                                                            $('.display-message').css('display', 'block')
                                                                        });

                                                                        $(`#display-class-list`).on("mouseleave", `#msg${doc.id}`, function () {
                                                                            $('.display-message').css('display', 'none')
                                                                        });
                                                                        showMessage = true
                                                                    }
                                                                })
                                                            }))
                                                        }

                                                        if (doc.data().absent == true) {

                                                            usersRef.get().then((function (querySnapshot) {
                                                                querySnapshot.forEach(function (doc) {

                                                                    if (userName == doc.data().name && showMessage == false) {
                                                                        $(`.round-absent${doc.id} .ctnr-absent`).append('<div class="red"></div>')
                                                                        $(`#check-absent${doc.id}`).prop("checked", true)
                                                                        $(`.round-absent${doc.id}`).append(`<i class="fas fa-envelope msg-icon" id="msg${doc.id}"></i>`)

                                                                        $(`<div class="display-message"></div>`).insertAfter(`#msg${doc.id}`);
                                                                        $('.display-message').append(`<p class="absent${doc.id}"> ${userMessage} </p>`)

                                                                        $(`#display-class-list`).on("mouseenter", `#msg${doc.id}`, function () {
                                                                            $('.display-message').css('display', 'block')
                                                                        });

                                                                        $(`#display-class-list`).on("mouseleave", `#msg${doc.id}`, function () {
                                                                            $('.display-message').css('display', 'none')
                                                                        });
                                                                        showMessage = true
                                                                    }
                                                                })
                                                            }))
                                                        }
                                                    })
                                                }))
                                            })
                                        }))
                                    })
                                })
                            });
                        })
                    })
                }
            })
        }
    });
});