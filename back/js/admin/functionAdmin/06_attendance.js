$(document).ready(function () {

    const summary = firebase.firestore().collection('studentSummary')

    let datepicker = $('#datepicker-attendance').datepicker()

    let displayAttendanceClass = $(".display-student-list option:selected").val();

    $(".display-student-list").change(function () {
        displayAttendanceClass = $('.display-student-list option:selected').val()
        $('#attendance-class').text(`Classe : ${displayAttendanceClass}`)
        summary.orderBy('username').where('class', '==', displayAttendanceClass).onSnapshot(function (querySnapshot) {

            let displayAttendanceStudent = ''

            $('#attendance-day').on('submit', function (e) {
                e.preventDefault()
                querySnapshot.forEach(function (doc) {


                    let datepickerValue = datepicker.val()

                    if (doc.data().day == datepickerValue) {

                        displayAttendanceStudent +=
                            `
                                <tr>
                                    <td>
                                        <label>${doc.data().day}</label>
                                    </td>
        
                                    <td> 
                                        <label>${doc.data().username}</label>
                                    </td> 
        
                                    <td>
                                        <label>${doc.data().name}</label>
                                    </td>
        
                                    <td> 
                                        <label>${doc.data().justif}</label>
                                    </td>
        
                                    <td>
                                        <label>${doc.data().present}</label>
                                    </td>
        
                                    <td>
                                        <label>${doc.data().late}</label>
                                    </td>
        
                                <td>
                                    <label>${doc.data().absent}</label>
                                </td>
        
                                </tr>
                            `
                    }
                })
                document.getElementById('list-all-attendance').innerHTML = displayAttendanceStudent

                $(" #list-all-attendance td label").text(function (index, text) {
                    return text.replace('false', '0');
                });
                $(" #list-all-attendance td label").text(function (index, text) {
                    return text.replace('true', '1');
                })
            })

        });
    });
})