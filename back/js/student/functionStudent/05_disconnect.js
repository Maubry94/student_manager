/**
 * Disconnect and direction at login.html
 */

$(document).ready(function () {

    $('.disconnect-fai').on('click', function () {

        firebase.auth().signOut().then(function () {
            document.location.href = '../index.html';

        }).catch(function (error) {
            // An error happened.
        });

    })

})