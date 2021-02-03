/**
 * Display justification of student
 */

$(document).ready(function () {

    const summary = firebase.firestore().collection('studentSummary')

    summary.onSnapshot(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {

            $(`#display-class-list`).on("mouseenter", `#msg${doc.id}`, function () {
                $('.display-message').remove()
                $(`<div class="display-message"></div>`).insertAfter(`#msg${doc.id}`);
                $('.display-message').append(`<p class="late${doc.id}"> ${doc.data().justif} </p>`)
            });
            $(`#display-class-list`).on("mouseleave", `#msg${doc.id}`, function () {
                $('.display-message').remove()
            });
        })
    })
})

