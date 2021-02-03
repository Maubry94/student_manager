$(document).ready(function () {

    const classFirestore = firebase.firestore().collection('class');
    let displayed = false

    // Edit class name
    classFirestore.get().then((function (querySnapshot) {

        querySnapshot.forEach(function (doc) {
            $('#ctnr-class-list').on('click', ".fai-edit" + "." + doc.id, function (event) {
                event.preventDefault()
                if (displayed == false) {

                    $('#create-class').css('filter', 'blur(6px)')
                    $('#timetable-section').css('filter', 'blur(6px)')
                    $('#select-class').css('filter', 'blur(6px)')
                    $('#new-users').css('filter', 'blur(6px)')
                    $('#add-student').css('filter', 'blur(6px)')

                    $('<div class="update-class">').insertAfter('#create-class')

                    $('.update-class').append('<div class="ctnr-update-class">');
                    $('.ctnr-update-class').append(`<p>Modifier ${doc.data().class}</p>`);

                    $(".update-class").append('<form id="update-class-form">');

                    $('#update-class-form').append('<div class="update-class-name">');

                    $(".update-class-name").append(`<label>Nom: </label>`);
                    $(".update-class-name").append(`<input type="text" value="${doc.data().class}" class="update-classname "/>`);

                    $(".update-class form").append(`<input type="button" class="btn valide-update-value" value="Enregistrer" />`);
                    $(".update-class form").append(`<input type="button" class="btn cancel-update-value" value="Annuler" />`);

                    displayed = true

                    $('.cancel-update-value').on('click', function () {
                        $('.update-class').remove()
                        $('#create-class').css('filter', 'blur(0px)')
                        $('#timetable-section').css('filter', 'blur(0px)')
                        $('#select-class').css('filter', 'blur(0px)')
                        $('#new-users').css('filter', 'blur(0px)')
                        $('#add-student').css('filter', 'blur(0px)')
                        displayed = false
                    })

                    $('.valide-update-value').on('click', function () {

                        $('#create-class').css('filter', 'blur(0px)')
                        $('#timetable-section').css('filter', 'blur(0px)')
                        $('#select-class').css('filter', 'blur(0px)')
                        $('#new-users').css('filter', 'blur(0px)')
                        $('#add-student').css('filter', 'blur(0px)')

                        let newclassnameValue = $('.update-classname').val()

                        classFirestore.doc(doc.id).update({
                            class: newclassnameValue,
                        })
                        $('.update-class').remove()
                        $('.blur').css('display', 'none')
                        displayed = false
                    })
                }

            })
        })
    }))
})