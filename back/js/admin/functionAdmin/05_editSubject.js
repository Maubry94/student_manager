/**
 * Edit subject
 * Create div and form
 * Submit datas in dataBase
 */

$(document).ready(function () {

    const classFirestore = firebase.firestore().collection('class');
    const usersRef = firebase.firestore().collection("users");


    let displayed = false

    let nameClass = ''

    let subjectId = ''

    $(".display-student-list").change(function () {
        nameClass = $('.display-student-list option:selected').val()
    });

    classFirestore.get().then((function (querySnapshot) {

        querySnapshot.forEach(function (doc) {

            const classId = doc.id

            classFirestore.doc(classId).collection('subject').onSnapshot(function (querySnapshot) {

                querySnapshot.forEach(function (doc) {

                    $('#display-subject').on('click', ".fai-edit-subject" + "." + doc.id, function (event) {

                        //Display the container only if displayed = false
                        if (displayed == false) {
                            subjectId = doc.id

                            if (doc.data().classname === nameClass) {

                                $('#timetable-section').css('filter', 'blur(6px)')
                                $('#select-class').css('filter', 'blur(6px)')
                                $('#new-users').css('filter', 'blur(6px)')
                                $('#add-student').css('filter', 'blur(6px)')

                                $('<div class="update-subject-ctnr">').insertAfter('#select-class')
                                $('.update-subject-ctnr').append('<div class="ctnr-update-subject-div">');
                                $('.ctnr-update-subject-div').append(`<p>Modification d'un cours</p>`);

                                $(".update-subject-ctnr").append('<form id="update-datas-schedule">');

                                $('#update-datas-schedule').append('<div class="ctnr-update-day">');
                                $(".ctnr-update-day").append(` <label>Jour</label>`);
                                $(".ctnr-update-day").append(`<input type = "text" value = "${doc.data().line}" id = "line" placeholder = "Jours (0 à 4)">`);

                                $('#update-datas-schedule').append('<div class="ctnr-update-subject">');
                                $(".ctnr-update-subject").append(` <label>Matière</label>`);
                                $(".ctnr-update-subject").append(`<input type="text" value="${doc.data().subject}" id="class" placeholder="cours">`);

                                $('#update-datas-schedule').append('<div class="ctnr-update-hour">');
                                $(".ctnr-update-hour").append(` <label>Horaires</label>`);
                                $(".ctnr-update-hour").append(`<input type = "text" value = "${doc.data().time}" id = "time" placeholder = 'heures "ex: 9.00-10.30"'>`);

                                $('#update-datas-schedule').append('<div class="ctnr-update-room">');
                                $(".ctnr-update-room").append(` <label>Salle</label>`);
                                $(".ctnr-update-room").append(`<input type = "text" value = "${doc.data().room}" id = "room" placeholder = "salle">`);

                                $('#update-datas-schedule').append('<div class="ctnr-update-class">');
                                $(".ctnr-update-class").append(` <label>Classe</label>`);
                                $(".ctnr-update-class").append(`<input type = "text" value = "${doc.data().classname}" id = "class-name" placeholder = "classe" disabled>`);

                                $('#update-datas-schedule').append('<div class="ctnr-update-former">');
                                $(".ctnr-update-former").append(` <label>Professeur</label>`);
                                // $(".ctnr-update-former").append(`<input type = "text" value = "${doc.data().former}" id = "former" placeholder = "professeur">`);
                                $(".ctnr-update-former").append(`<select id = "former" placeholder = "professeur">`);

                                $('#update-datas-schedule').append('<div class="ctnr-update-color">');
                                $(".ctnr-update-color").append(` <label>Couleur</label>`);
                                $(".ctnr-update-color").append(`<input type = "text" value = "${doc.data().color}" id = "color" placeholder = "couleur (en englais)">`);

                                $(".update-subject-ctnr form").append(`<input type="submit" class="confirm-update-cours-btn btn" value="modifier le cours">`);
                                $(".update-subject-ctnr form").append(`<input type = "button" class="cancel-update-value btn" value = "Annuler">`);

                                displayed = true

                                $('.cancel-update-value').on('click', function () {
                                    $('.update-subject-ctnr').remove()
                                    displayed = false
                                    $('.add-subject-ctnr').remove()
                                    $('#timetable-section').css('filter', 'blur(0px)')
                                    $('#select-class').css('filter', 'blur(0px)')
                                    $('#new-users').css('filter', 'blur(0px)')
                                    $('#add-student').css('filter', 'blur(0px)')
                                })
                            }

                        }

                        usersRef.where('grade', '==', 'former').get().then(function(querySnapshot){
                            querySnapshot.forEach(function(doc){
                                $('#former').append('<option value=' + doc.data().username + '>' + doc.data().username + ' ' + doc.data().name + '</option>')
                                console.log(doc.data())
                            })
                        })
                    })
                })
            })
        })
    }))

    $(document).on('submit', '#update-datas-schedule', function (e) {
        e.preventDefault()

        const line = $('#line').val()
        const subject = $('#class').val()
        const time = $('#time').val()
        const room = $('#room').val()
        const clAss = $('#class-name').val()
        const former = $('#former').val()
        const color = $('#color').val()

        classFirestore.get().then((function (querySnapshot) {
            querySnapshot.forEach(function (doc) {

                const classId = doc.id

                classFirestore.doc(classId).collection('subject').get().then((function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {


                        if (doc.id == subjectId) {

                            classFirestore.doc(classId).collection('subject').doc(doc.id).update({
                                line: line,
                                subject: subject,
                                time: time,
                                room: room,
                                classname: clAss,
                                former: former,
                                color: color
                            })
                            displaySchedule()
                        }
                    })
                }))
            })
        }))
        $('.update-subject-ctnr').remove()
        displayed = false
    })
})










