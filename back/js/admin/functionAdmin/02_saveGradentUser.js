$(document).ready(function () {
  const classFirestore = firebase.firestore().collection("class");
  const usersRef = firebase.firestore().collection("users");
  let msgDisplayed = false;

  $("#save-gradent-user").on("submit", saveGradentStudent);

  // Update value in dataBase
  function saveGradentStudent(event) {
    event.preventDefault();

    usersRef.onSnapshot(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        // get option selecionned in a select
        let studentClassSelected = $(
          ".add-gradent-by-class-collection option:selected"
        ).val();

        // update student grade if this radio is selectionned
        if ($("input[value=student]" + "." + doc.id).is(":checked")) {
          usersRef.doc(doc.id).update({
            grade: "student",
            class: studentClassSelected,
          });

          // remove line cheked
          $(".row-users").remove();

          // update former grade if this radio is selectionned
        } else if ($("input[value=former]" + "." + doc.id).is(":checked")) {
          usersRef.doc(doc.id).update({
            grade: "former",
            class: "",
          });

          // remove line cheked
          $(".row-users").remove();
        }
      });
    });

    // let studentChecked = $('#student-checked').is(':checked')
    // let formerChecked = $('#former-checked').is(':checked')

    // if (studentChecked == false && formerChecked == false) {
    //     if (msgDisplayed == false) {
    //         $('<p class="display-message-false">Veuillez sélectionner si c\'est un étudiant ou un formateur</p>').insertAfter(".display-user-connected");
    //         msgDisplayed = true
    //         setTimeout(() => {
    //             $('.display-message-false').remove()
    //             msgDisplayed = false
    //         }, 5000);
    //     }
    // }
  }

  usersRef.onSnapshot(function (querySnapshot) {
    let i = 0;
    let definedGradent = "";
    querySnapshot.forEach(function (doc) {
      // Display all new users who don't have class and gradent
      if (doc.data().grade == "") {
        i++;

        definedGradent += `
                        <tr class="row-users">
                            <td>
                                <label>
                                    ${doc.data().username}</p>
                                </label>
                            </td>
                            <td>
                                <label>
                                    <p>${doc.data().name}</p>
                                </label>
                            </td>
                            <td>
                                <label> <input type="radio" name="grade${i}" value="student" id="student-checked" class=${
          doc.id
        }>student</label>
                            </td>
                            <td>
                                <label> <input type="radio" name="grade${i}" value="former" id="former-checked" class=${
          doc.id
        }>former</label>
                            </td>
                            <td>
                                <select class='add-gradent-by-class-collection'></select>
                            </td>
                        </tr>
                    `;
      }
    });
    document.getElementById("list-users-status").innerHTML = definedGradent;

    classFirestore.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        $(".add-gradent-by-class-collection").append(
          "<option value=" +
            doc.data().class +
            ">" +
            doc.data().class +
            "</option>"
        );
      });
    });
  });
});
