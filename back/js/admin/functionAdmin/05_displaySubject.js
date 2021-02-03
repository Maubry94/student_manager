/**
 * Display all subject with the name / date of subject / fai icon for edit and delete
 */

$(document).ready(function () {

  const classFirestore = firebase.firestore().collection('class');

  const datepicker = $('#datepicker-subject').datepicker().datepicker('setDate', 'today');

  const datepickerVal = datepicker.val()

  let getClassSelect = $('.display-student-list option:selected').val()

  $(".display-student-list").change(function () {
    getClassSelect = $('.display-student-list option:selected').val()

    classFirestore.where("class", "==", getClassSelect).onSnapshot(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {

        classFirestore.doc(doc.id).collection('subject').onSnapshot(function (querySnapshot) {

          let displaySubject = ''

          querySnapshot.forEach(function (doc) {

            if (datepickerVal <= doc.data().date) {

              displaySubject += `
                <tr class="row-subject">
                    <td> <label>${doc.data().subject} </label>  </td>
                    <td> <label>${doc.data().date} </label>  </td>
                    <td> <i class="fas fa-edit fai-edit-subject ${doc.id}"></i>  </td>
                    <td> <i class="fas fa-trash-alt fai-delete-subject ${doc.id}"></i>  </td>
                </tr>
              `
            }
          })
          document.getElementById('list-all-subject').innerHTML = displaySubject;
        })

      })
    })
  });
})
