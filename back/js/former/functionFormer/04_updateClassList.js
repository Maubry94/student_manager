/**
 * Get the actuel date for comparate and update
 * Submit only 3 datas: present, late and absent
 */

$(document).ready(function () {

    const summary = firebase.firestore().collection('studentSummary')

    // Get the current Day
    const todayDay = $("#datepicker").datepicker("setDate", "today");

    $('#redirection-update').on('click', function () {

        $('.no-edit-table').remove()
        $('#validate-update-value').css('display', 'block')
        $('#redirection-update').css('display', 'none')

        const summary = firebase.firestore().collection('studentSummary')


        summary.where('day', "==", todayDay.val()).get().then((function (querySnapshot) {

            let displayStudent = ''

            let i = 0

            querySnapshot.forEach(function (doc) {

                if (doc.exists) {

                    i++

                    if (doc.data().late == true) {
                        displayStudent +=
                            `
                                <tr class="edit-table">
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
                                        <input type="radio" name="status${i}" checked id="check-late${doc.id}">
                                        <i class="fas fa-envelope msg-icon" id="msg${doc.id}"></i>

                                    </td>

                                    <td class="absence round-absent${doc.id}">
                                        <div class="ctnr-absent">
                                        </div>
                                        <input type="radio" name="status${i}" id="check-absent${doc.id}">
                                    </td>

                                </tr>
                            `
                    }

                    if (doc.data().absent == true) {
                        displayStudent +=
                            `
                                <tr class="edit-table">
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
                                        <input type="radio" name="status${i}" checked id="check-absent${doc.id}">
                                        <i class="fas fa-envelope msg-icon" id="msg${doc.id}"></i>
                                    </td>

                                </tr>
                            `
                    }

                    if (doc.data().present == true) {
                        displayStudent +=
                            `
                                <tr class="edit-table">
                                    <td class="student title-array">
                                        <label>${doc.data().username}</label>
                                    </td>

                                    <td class="student"> 
                                        <label>${doc.data().name}</label>
                                    </td> 

                                    <td class="present round-present${doc.id}">
                                        <div class="ctnr-present">
                                            <input type="radio" name="status${i}" checked id="check-present${doc.id}">
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
                    }
                }

            })
            $(`${displayStudent}`).insertAfter(".title").innerHTML;

        }))
        summary.get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                if (doc.data().late == true && doc.data().justif == '' || doc.data().absent == true && doc.data().justif == '') {
                    $(`#msg${doc.id}`).remove()
                }
            })
        })
    })


    $('#update-class-list').on('submit', function (e) {
        e.preventDefault()
        $('#validate-update-value').css('display', 'none')
        $('#redirection-update').css('display', 'block')


        // verify day for edit and check id of checkbox to update this in dataBase
        summary.where('day', "==", todayDay.val()).get().then((function (querySnapshot) {
            querySnapshot.forEach(function (doc) {

                if ($(`#check-present${doc.id}`).is(':checked') == true) {
                    summary.doc(doc.id).update({
                        late: false,
                        absent: false,
                        present: true,
                    });

                } else if ($(`#check-late${doc.id}`).is(':checked') == true) {
                    summary.doc(doc.id).update({
                        late: true,
                        absent: false,
                        present: false,
                    });

                } else if ($(`#check-absent${doc.id}`).is(':checked') == true) {
                    summary.doc(doc.id).update({
                        late: false,
                        absent: true,
                        present: false,
                    });
                }
            })
        }))
    })
})