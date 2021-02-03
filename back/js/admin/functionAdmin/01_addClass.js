$(document).ready(function () {
    const classFirestore = firebase.firestore().collection('class');

    // Add class when admin is connected
    $('#form-create-class').on('submit', function (e) {
        e.preventDefault();


        // Get input value
        let optionValue = $('#value-class-name').val().trim();

        // add value to the class database
        if (optionValue.length == 0) {
            $('#value-class-name').attr('placeholder', 'Veuillez remplir ce champ')
            $('#value-class-name').css('border', '1px solid red')
        }
        else if (optionValue.length > 0) {
            classFirestore.doc().set({
                class: optionValue
            });

            // add option in select in "gestion des utilisateurs" (section 2)
            $('.add-gradent-by-class-collection').append('<option value=' + optionValue + '>' + optionValue + '</option>');

            // add option in select in "choissisez une classe" (section 3)
            $('.display-student-list').append('<option value=' + optionValue + '>' + optionValue + '</option>');

            $('#value-class-name').css('border', '1px solid grey')
            $('#value-class-name').attr('placeholder', 'Nom de la classe')
            $('#value-class-name').val('');
        }
    })

    classFirestore.onSnapshot(function (querySnapshot) {

        let displayClass = ''
        querySnapshot.forEach(function (doc) {

            displayClass += `
                    <tr class="row-class">
                        <td> <label>${doc.data().class} </label>  </td>
                        <td> <i class="fas fa-edit fai-edit ${doc.id}"></i>  </td>
                        <td> <i class="fas fa-trash-alt fai-delete ${doc.id}"></i>  </td>
                    </tr>
                `
        })
        document.getElementById('list-class').innerHTML = displayClass;
    })
});