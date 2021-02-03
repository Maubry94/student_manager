/**
 * Display Name of current User
 * Display the current date
 */

$(document).ready(function () {

    firebase.auth().onAuthStateChanged(function (user) {

        var currentUserConnected = firebase.auth().currentUser;

        if (currentUserConnected != null) {

            uid = user.uid;

            const datasUser = firebase.firestore().collection('users').doc(uid);

            datasUser.get().then(function (doc) {

                if (doc.exists) {

                    $(".name-disconnect").prepend(`<h3>${doc.data().name} ${doc.data().username}</h3>`);
                    let currentDate = new Date()
                    let day = currentDate.getDay()
                    let number = currentDate.getDate()
                    let month = currentDate.getMonth()

                    function dayOfWeekAsString(dayIndex) {
                        return ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"][dayIndex];
                    }

                    function monthAsString(dayIndexMonth) {
                        return ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "août", "septembre", "octobre", "novembre", "décembre"][dayIndexMonth];
                    }

                    $(".name-date").prepend(`<h4> ${dayOfWeekAsString(day - 1) + ' ' + number + ' ' + monthAsString(month)}</h4>`);
                }

            })

        }
    });
})
