$(document).ready(function () {

    const classFirestore = firebase.firestore().collection('class');

    let nameClass = ''

    $(".display-student-list").change(function () {
        nameClass = $('.display-student-list option:selected').val()
    });

    classFirestore.get().then((function (querySnapshot) {

        querySnapshot.forEach(function (doc) {

            const classId = doc.id

            classFirestore.doc(doc.id).collection('subject').onSnapshot(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {

                    $('#display-subject').on('click', ".fai-delete-subject" + "." + doc.id, function (event) {

                        if (doc.data().classname === nameClass) {
                            classFirestore.doc(classId).collection('subject').doc(doc.id).delete()
                            displaySchedule()
                        }
                    })
                })
            })
        })
    }))
})