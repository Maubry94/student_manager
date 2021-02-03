/**
 * Display all users in same class on a right div "Liste des élèves"
 * Edit the user when we click on icon update
 * Display the id card user when we click on icon card
 * Delete user when we click on icon delete
 */

$(document).ready(function () {

    let displayEdit = false
    let displayShow = false
    const classFirestore = firebase.firestore().collection('class');
    const usersRef = firebase.firestore().collection('users');
    const summary = firebase.firestore().collection('studentSummary')


    // Create select for choose the class who is show (section 3)
    $(".select-class-list").prepend("<select class='display-student-list'><option selected disabled>Choisissez une classe</option>");

    // Display all class who is in dataBases and add option
    classFirestore.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {

            //Scrolling-menu dynamiquelly create
            $('.display-student-list').append('<option class=' + doc.id + ' value=' + doc.data().class + '>' + doc.data().class + '</option>');
        })
    });

    let displayStudentClass = $(".display-student-list option:selected").val();

    $(".display-student-list").change(function () {

        displayStudentClass = $('.display-student-list option:selected').val()

        // Get all student who is in same class
        usersRef.where("class", "==", displayStudentClass).onSnapshot(function (querySnapshot) {

            let displayStudent = ''

            querySnapshot.forEach(function (doc) {
                displayStudent += `
                    <tr class="row-users">
                        <td><label>${doc.data().username}</td></label>
                        <td><label>${doc.data().name}</td></label>
                        <td> <label>${doc.data().class} </label>  </td>
                        <td> <i class="far fa-id-card fai-identity ${doc.id}"></i> </td>
                        <td> <i class="fas fa-edit fai-edit ${doc.id}"></i>  </td>
                        <td> <i class="fas fa-trash-alt fai-delete ${doc.id}"></i>  </td>
                    </tr>
                `
            });
            $('#class-name').val(displayStudentClass)
            document.getElementById('list-all-class').innerHTML = displayStudent;
        })
    });


    // Get all former
    usersRef.where("grade", "==", "former").onSnapshot(function (querySnapshot) {

        let displayFormer = ''

        querySnapshot.forEach(function (doc) {
            displayFormer += `
                <tr class="row-users">
                    <td><label>${doc.data().username}</td></label>
                    <td><label>${doc.data().name}</td></label>
                    <td> <i class="far fa-id-card fai-identity ${doc.id}"></i> </td>
                    <td> <i class="fas fa-edit fai-edit ${doc.id}"></i>  </td>
                    <td> <i class="fas fa-trash-alt fai-delete ${doc.id}"></i>  </td>
                </tr>
            `
        });
        document.getElementById('list-all-former').innerHTML = displayFormer;
    })





    // Edit user when we click on icon and update it on dataBase (css: 310 - 325)
    usersRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            $('.display').on('click', ".fai-edit" + "." + doc.id, function (event) {
                event.preventDefault()

                if (displayEdit == false) {
                    $('#timetable-section').css('filter', 'blur(6px)')
                    $('#select-class').css('filter', 'blur(6px)')
                    $('#new-users').css('filter', 'blur(6px)')
                    $('#add-student').css('filter', 'blur(6px)')

                    $('.blur').css('display', 'block')
                    $('<div class="update-student">').insertAfter('#select-class');
                    $(".update-student").append('<form id="update-student-form">');

                    $('#update-student-form').append('<div class="ctnr-picture-user">');
                    $('.ctnr-picture-user').append('<div class="picture-user">');
                    $('.picture-user').append(`<img class="current-picture-edit" src="${doc.data().pictureURL}" alt="picture">`);

                    $('#update-student-form').append('<div class="datas-users">');

                    $(".datas-users").append('<div class="name"> </div>')
                    $(".name").append(`<label>Nom: </label>`);
                    $(".name").append(`<input type="text" value="${doc.data().username}" class="update-username "/>`);

                    $(".datas-users").append('<div class="username"> </div>')
                    $(".username").append(` <label>Prénom: </label>`);
                    $(".username").append(`<input type="text" value="${doc.data().name}" class=" update-name"/>`);

                    if (doc.data().grade != "former") {
                        $(".datas-users").append('<div class="class"> </div>')
                        $(".class").append(` <label>Classe: </label>`);
                        $(".class").append(`<input type="text" value="${doc.data().class}" class="update-class-name "/>`);
                    }

                    $(".datas-users").append('<div class="grade"> </div>')
                    $(".grade").append(` <label>Grade: </label>`);
                    $(".grade").append(`<input type="text" value="${doc.data().grade}" class="update-grade "/>`);

                    $(".datas-users").append('<div class="ctnr-btn-edit-user"> </div>')

                    $(".ctnr-btn-edit-user").append(`<input type="button" class="btn valide-update-value" value="Enregistrer" />`);
                    $(".ctnr-btn-edit-user").append(`<input type="button" class="btn cancel-update-value" value="Annuler" />`);

                    displayEdit = true

                    if (doc.data().pictureURL == '') {
                        $('.current-picture-edit').remove()
                        $('.picture-user').append(`<img src="../../../../front/img/defaultPicture.png" alt="picture">`);
                        $('.picture-user img').css("margin-top", "0px")
                    }

                    $('.cancel-update-value').on('click', function () {
                        $('.update-student').remove()
                        $('#timetable-section').css('filter', 'blur(0px)')
                        $('#select-class').css('filter', 'blur(0px)')
                        $('#new-users').css('filter', 'blur(0px)')
                        $('#add-student').css('filter', 'blur(0px)')
                        displayEdit = false
                    })

                    $('.valide-update-value').on('click', function () {
                        let newUsernameValue = $('.update-username').val()
                        let newNameValue = $('.update-name').val()
                        let newclassValue = $('.update-class-name ').val()
                        let newGradeValue = $('.update-grade').val()

                        usersRef.doc(doc.id).update({
                            username: newUsernameValue,
                            name: newNameValue,
                            grade: newGradeValue,
                            class: newclassValue,
                        })

                        summary.where('username', '==', newUsernameValue).get().then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                summary.doc(doc.id).update({
                                    username: newUsernameValue,
                                    name: newNameValue,
                                    class: newclassValue
                                })
                                console.log(doc.data())
                            })
                        })

                        $('.update-student').remove()
                        $('#timetable-section').css('filter', 'blur(0px)')
                        $('#select-class').css('filter', 'blur(0px)')
                        $('#new-users').css('filter', 'blur(0px)')
                        $('#add-student').css('filter', 'blur(0px)')
                        displayEdit = false
                    })
                }
            })
        })
    });

    // Display user when we click on a card identity
    usersRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            $('.display').on('click', ".fai-identity" + "." + doc.id, function (event) {
                event.preventDefault()

                if (displayShow == false) {
                    $('#timetable-section').css('filter', 'blur(6px)')
                    $('#select-class').css('filter', 'blur(6px)')
                    $('#new-users').css('filter', 'blur(6px)')
                    $('#add-student').css('filter', 'blur(6px)')

                    // $('.blur').css('display', 'block')

                    $('<div class="identity-student" </div>').insertAfter('#select-class');

                    $('.identity-student').append('<div class="ctnr-picture-user">');
                    $('.ctnr-picture-user').append('<div class="picture-user">');
                    $('.picture-user').append(`<img class="current-picture" src="${doc.data().pictureURL}" alt="picture">`);

                    $('.identity-student').append('<div class="datas-users">');
                    $('.datas-users').append(`<label> <span class="data-identity-card">Nom:</span> <p class="uppercase-identity-card"> ${doc.data().name}</p></label>`)
                    $('.datas-users').append(`<label><span class="data-identity-card">Prénom:</span><p> ${doc.data().username}</p></label>`)
                    $('.datas-users').append(`<label><span class="data-identity-card">Classe:</span> <p class="uppercase-identity-card"> ${doc.data().class}</p>`)
                    $('.datas-users').append(`<label><span class="data-identity-card">Adresse mail:</span> <p> ${doc.data().mail}</p>`)
                    $('.datas-users').append(`<label><span class="data-identity-card">Grade:</span> <p> ${doc.data().grade}</p>`)
                    $('.datas-users').append(`<br><input type="button" class="btn cancel-identity-card" value="Retour" />`)
                    displayShow = true

                    if (doc.data().pictureURL == '') {
                        $('.current-picture').remove()
                        $('.picture-user').append(`<img src="../../../../front/img/defaultPicture.png" alt="picture">`);
                        $('.picture-user img').css("margin-top", "0px")
                    }
                }


                $('.cancel-identity-card').on('click', function () {
                    $('.identity-student').remove()
                    $('#timetable-section').css('filter', 'blur(0px)')
                    $('#select-class').css('filter', 'blur(0px)')
                    $('#new-users').css('filter', 'blur(0px)')
                    $('#add-student').css('filter', 'blur(0px)')
                    displayShow = false
                })
            })
        })
    })

    // Delete user on a list and in a dataBase
    usersRef.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            $('.display').on('click', ".fai-delete" + "." + doc.id, function (event) {
                event.preventDefault()
                usersRef.doc(doc.id).delete().then(function () {
                    console.log("Document successfully deleted!");
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });
            })
        })
    })
});