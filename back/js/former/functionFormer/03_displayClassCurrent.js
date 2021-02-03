/**
 * Display new array with the new value who is send in dataBase
 */

$(document).ready(function () {

    const summary = firebase.firestore().collection('studentSummary')

    const todayDay = $("#datepicker").datepicker("setDate", "today");

    $('.display-message').css("display", 'block');

    summary.where('day', "==", todayDay.val()).onSnapshot(function (querySnapshot) {

        $('.edit-table').remove()
        $('.no-edit-table').remove()

        let i = 0
        let displayStudent = ''

        querySnapshot.forEach(function (doc) {

            if (doc.exists) {
                $('#redirection-update').css('display', 'block')
                $('#send-list').css('display', 'none')
                $('#datepicker, #send').remove()
                i++
                if (doc.data().late == true) {

                    displayStudent +=
                        `
                            <tr class="no-edit-table">
                                <td class="student title-array">
                                    <label> ${doc.data().username} </label>
                                </td>

                                <td class="student"> 
                                    <label> ${doc.data().name} </label>
                                </td> 

                                <td class="present round-present${doc.id}">
                                    <div class="ctnr-present">
                                        <input type="radio" disabled name="status${i}" id="check-present${doc.id}">
                                    </div>
                                </td>

                                <td class="delay round-late${doc.id}"> 
                                    <div class="ctnr-late">
                                        <input type="radio" disabled name="status${i}" checked id="check-late${doc.id}">
                                        <i class="fas fa-envelope msg-icon" id="msg${doc.id}"></i>
                                    </div>
                                    
                                </td>

                                <td class="absence round-absent${doc.id}">
                                    <div class="ctnr-absent">
                                        <input type="radio" disabled name="status${i}" id="check-absent${doc.id}">
                                    </div>
                                </td>
                            </tr>
                        `
                }

                if (doc.data().absent == true) {

                    displayStudent +=
                        `
                            <tr class="no-edit-table">
                                <td class="student title-array">
                                    <label> ${doc.data().username} </label>
                                </td>

                                <td class="student"> 
                                    <label> ${doc.data().name} </label>
                                </td> 

                                <td class="present round-present${doc.id}">
                                    <div class="ctnr-present">
                                        <input type="radio" disabled name="status${i}" id="check-present${doc.id}">
                                    </div>
                                </td>

                                <td class="delay round-late${doc.id}"> 
                                    <div class="ctnr-late">
                                        <input type="radio" disabled name="status${i}" id="check-late${doc.id}">
                                    </div>
                                </td>

                                <td class="absence round-absent${doc.id}">
                                    <div class="ctnr-absent">
                                        <input type="radio" disabled name="status${i}" checked id="check-absent${doc.id}">
                                        <i class="fas fa-envelope msg-icon" id="msg${doc.id}"></i>
                                    </div>
                                </td>
                            </tr>
                        `
                }

                if (doc.data().present == true) {

                    displayStudent +=
                        `
                            <tr class="no-edit-table">
                                <td class="student title-array">
                                    <label> ${doc.data().username} </label>
                                </td>

                                <td class="student"> 
                                    <label> ${doc.data().name} </label>
                                </td> 

                                <td class="present round-present${doc.id}">
                                    <div class="ctnr-present">
                                        <input type="radio" disabled name="status${i}" checked id="check-present${doc.id}">
                                    </div>
                                </td>

                                <td class="delay round-late${doc.id}">
                                    <div class="ctnr-late">
                                        <input type="radio" disabled name="status${i}" id="check-late${doc.id}">
                                    </div>
                                </td>

                                <td class="absence round-absent${doc.id}">
                                    <div class="ctnr-absent">
                                        <input type="radio" disabled name="status${i}" id="check-absent${doc.id}">
                                    </div>
                                </td>
                            </tr>
                        `
                }
            }

        })
        $(`${displayStudent}`).insertAfter(".title").innerHTML;
    })

    summary.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (doc.data().late == true && doc.data().justif == '' || doc.data().absent == true && doc.data().justif == '') {
                $(`#msg${doc.id}`).remove()
            }
        })
    })
});