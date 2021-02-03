/**
 * Create div and form
 */

$(document).ready(function () {
  const usersRef = firebase.firestore().collection("users");

  // Attrute the name of line
  let line = "";

  // Get name of class selectionner for comparate
  let nameClass = "";

  // Variable for not multiplicate the div
  let displayed = false;

  $(".display-student-list").change(function () {
    nameClass = $(".display-student-list option:selected").val();
  });

  $(".btn-add-subject").on("click", function () {
    // Display the container only if displayed = false
    if (displayed == false) {
      if (nameClass == "Choisissez une classe" || nameClass == "") {
        $(
          "<p class='not-selected-class'>Vous n'avez pas selectionner de classe</p>"
        ).insertAfter("#display-subject");
      } else {
        $("#timetable-section").css("filter", "blur(6px)");
        $("#select-class").css("filter", "blur(6px)");
        $("#new-users").css("filter", "blur(6px)");
        $("#add-student").css("filter", "blur(6px)");
        /**css : line 563 -  */
        $('<div class="add-subject-ctnr">').insertAfter("#select-class");
        $(".add-subject-ctnr").append('<div class="ctnr-add-subject">');
        $(".ctnr-add-subject").append(`<p>Ajout d'un cours</p>`);
        $(".add-subject-ctnr").append('<form id="add-datas-schedule">');

        $("#add-datas-schedule").append('<div class="add-subject-datepicker">');
        $(".add-subject-datepicker").append(` <label>Date du cours:</label>`);
        $(".add-subject-datepicker").append(
          `<input type="text" name="add-subject-input" id="datepicker" placeholder="mm/dd/yy">`
        );

        $("#add-datas-schedule").append('<div class="add-subject-subject">');
        $(".add-subject-subject").append(` <label>Matière:</label>`);
        $(".add-subject-subject").append(
          `<input type="text" id="add-class" placeholder="matière">`
        );

        $("#add-datas-schedule").append('<div class="add-subject-hour">');
        $(".add-subject-hour").append(` <label>Horaires:</label>`);
        $(".add-subject-hour").append(
          `<input type = "text" id = "add-time" placeholder ='heures ex: "9.00-10.30"'>`
        );

        $("#add-datas-schedule").append('<div class="add-subject-room">');
        $(".add-subject-room").append(` <label>Salle:</label>`);
        $(".add-subject-room").append(
          `<input type = "text" id = "add-room" placeholder = "salle">`
        );

        $("#add-datas-schedule").append('<div class="add-subject-class">');
        $(".add-subject-class").append(` <label>Classe:</label>`);
        $(".add-subject-class").append(
          `<input type = "text" value = "${nameClass}" id = "add-class-name" placeholder = "classe" disabled>`
        );

        $("#add-datas-schedule").append('<div class="add-subject-former">');
        $(".add-subject-former").append(` <label>Professeur:</label>`);
        $(".add-subject-former").append(
          `<select id = "add-former" placeholder = "professeur"/>`
        );

        $("#add-datas-schedule").append('<div class="add-subject-color">');
        $(".add-subject-color").append(
          ` <label class="colors-infos">Couleur</label> <i class="fas fa-question-circle question-fai"></i>`
        );
        $(".add-subject-color").append(
          `<input type = "text" id = "add-color" placeholder = "couleur (en englais)">`
        );

        $(".add-subject-ctnr form").append(
          `<input type="submit" class="confirm-update-cours-btn btn" value="Ajouter le cours">`
        );
        $(".add-subject-ctnr form").append(
          `<input type = "button" class="cancel-add-value btn" value = "Annuler">`
        );

        // Get string of date and convert to number for schedule
        $("#datepicker").datepicker({
          dateFormat: "mm/dd/yy",
          beforeShow: function (input, inst) {
            window.setTimeout(function () {
              $("#ui-datepicker-div").position({
                my: "left top",
                at: "left bottom",
                of: input,
              });
            }, 1);
          },
          onSelect: function (dateText) {
            var seldate = $(this).datepicker("getDate");
            seldate = seldate.toDateString();
            seldate = seldate.split(" ");
            var weekday = new Array();
            weekday["Mon"] = "Monday";
            weekday["Tue"] = "Tuesday";
            weekday["Wed"] = "Wednesday";
            weekday["Thu"] = "Thursday";
            weekday["Fri"] = "Friday";
            weekday["Sat"] = "Saturday";
            weekday["Sun"] = "Sunday";
            var dayOfWeek = weekday[seldate[0]];

            switch (dayOfWeek) {
              case "Monday":
                line = "0";
                break;
              case "Tuesday":
                line = "1";
                break;
              case "Wednesday":
                line = "2";
                break;
              case "Thursday":
                line = "3";
                break;
              case "Friday":
                line = "4";
                break;
              case "Saturday":
                line = "5";
                break;
              case "Sunday":
                line = "6";
                break;

              default:
                break;
            }
          },
        });

        displayed = true;
      }
    }

    setTimeout(() => {
      $(".not-selected-class").remove();
    }, 5000);

    usersRef
      .where("grade", "==", "former")
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          $("#add-former").append(
            "<option value=" +
              doc.data().username +
              ">" +
              doc.data().username +
              " " +
              doc.data().name +
              "</option>"
          );
        });
      });
  });

  $(document).on("mouseenter", ".question-fai", function () {
    $(`<div class="display-colors"></div>`).insertAfter(".colors-infos");
    $(".display-colors").append(
      "<p> Pink, blue, orange, green, red, black </p>"
    );
  });
  $(document).on("mouseleave", ".question-fai", function () {
    $(".display-colors").remove();
  });

  // Click on datepicker create dynamically
  $("body").on("focus", "#datepicker", function () {
    $(this).datepicker();
  });

  // Cancel button and remove container div
  $("body").on("click", "input.cancel-add-value", function () {
    $(".add-subject-ctnr").remove();
    $("#timetable-section").css("filter", "blur(0px)");
    $("#select-class").css("filter", "blur(0px)");
    $("#new-users").css("filter", "blur(0px)");
    $("#add-student").css("filter", "blur(0px)");
    displayed = false;
  });

  const colorsName = [
    "black",
    "pink",
    "blue",
    "orange",
    "green",
    "red",
    "black",
  ];

  $(document).on("submit", "#add-datas-schedule", function (e) {
    e.preventDefault();

    const datepicker = $("#datepicker").datepicker({
      onSelect: function (selectedDate) {},
    });
    const datepickerVal = datepicker.val();

    const error = [];

    // Subject
    const clAss = $("#add-class").val().trim();
    //Hour
    const time = $("#add-time").val().trim();
    //Classroom
    const room = $("#add-room").val().trim();
    //Name class
    const className = $("#add-class-name").val().trim();
    //Former
    const former = $("#add-former").val().trim();
    //Color
    const color = $("#add-color").val().trim();

    if (clAss < 1) {
      $("#add-class").css("border", "1px solid red");
      $("#add-class").attr("placeholder", "Veuillez remplir ce champ");
      error.push("champ vide");
    } else {
      $("#add-class").css("border 1px", "black");
    }

    if (time < 1) {
      $("#add-time").css("border", "1px solid red");
      $("#add-time").attr("placeholder", "Veuillez remplir ce champ");
      error.push("champ vide");
    } else {
      $("#add-time").css("border 1px", "black");
    }

    if (room < 1) {
      $("#add-room").css("border", "1px solid red");
      $("#add-room").attr("placeholder", "Veuillez remplir ce champ");
      error.push("champ vide");
    } else {
      $("#add-room").css("border 1px", "black");
    }

    if (former < 1) {
      $("#add-former").css("border", "1px solid red");
      $("#add-former").attr("placeholder", "Veuillez remplir ce champ");
      error.push("champ vide");
    } else {
      $("#add-former").css("border 1px", "black");
    }

    if (color < 1) {
      $("#add-color").css("border", "1px solid red");
      $("#add-color").attr("placeholder", "Veuillez remplir ce champ");
      error.push("champ vide");
    } else {
      $("#add-color").css("border 1px", "black");
    }

    if (datepickerVal < 1) {
      $("#datepicker").css("border", "1px solid red");
      $("#datepicker").attr("placeholder", "Choisissez une date");
      error.push("champ vide");
    } else {
      $("#datepicker").css("border 1px", "black");
    }

    // // Split the hours at "-"
    let timeSplit = time.split("-");

    let leftHourSplit = timeSplit[0];
    let rightHourSplit = timeSplit[1];

    // Array with left number not accepted 0 to 8 and right number 21 to 24
    let numberFalse = [
      "00",
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "21",
      "22",
      "23",
      "24",
    ];

    // Get the 1 st number for verify
    let firstCharactereLeftHourSplit = leftHourSplit.substr(0, 2);

    // Get the 2 first number
    let firstCharactereRightHourSplit = rightHourSplit.substr(0, 2);

    // Error message if field is empty
    if (
      leftHourSplit == "" ||
      rightHourSplit == "" ||
      (leftHourSplit && rightHourSplit == "")
    ) {
      $("#add-time").val("");
      $("#add-time").css("border", "1px solid red");
      $("#add-time").attr("placeholder", "Veuillez remplir ce champ");
      error.push("champ vide");
    }

    for (let i = 0; i < numberFalse.length; i++) {
      // Verify if hours is < 9
      if (firstCharactereLeftHourSplit == numberFalse[i]) {
        $("#add-time").val("");
        $("#add-time").attr(
          "placeholder",
          "Vous avez selectionné un horraire avant le début des cours"
        );
        $("#add-time").css("border", "1px solid red");
        error.push("horraire avant le début des cours");

        // Verify hours is > 20
      } else if (firstCharactereRightHourSplit == numberFalse[i]) {
        $("#add-time").val("");
        $("#add-time").attr(
          "placeholder",
          "Vous avez selectionné un horraire après la fin des cours"
        );
        $("#add-time").css("border", "1px solid red");
        error.push("horraire après la fin des cours");

        // Verify if hours is < 9 && > 20
      }
    }

    // Verify color in english
    if (colorsName.indexOf(color) != -1) {
      $("#add-color").attr("placeholder", "Couleur (en anglais)");
      $("#add-color").css("border 1px", "black");
    } else {
      $("#add-color").val("");
      $("#add-color").css("border", "1px solid red");
      $("#add-color").attr("placeholder", "Couleur invalide");
      error.push("champ vide");
    }

    // Add to dataBase if error is equal to 0
    if (error.length == 0) {
      classFirestore
        .where("class", "==", nameClass)
        .onSnapshot(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            classFirestore.doc(doc.id).collection("subject").doc().set({
              line: line,
              subject: clAss,
              time: time,
              classname: className,
              former: former,
              color: color,
              room: room,
              date: datepickerVal,
            });
          });
        });
      $(".add-subject-ctnr").remove();
      $("#timetable-section").css("filter", "blur(0px)");
      $("#select-class").css("filter", "blur(0px)");
      $("#new-users").css("filter", "blur(0px)");
      $("#add-student").css("filter", "blur(0px)");

      displayed = false;
    }
  });
});
