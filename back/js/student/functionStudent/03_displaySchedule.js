/**
 * Display shcedule with current User connected
 * Edit the week
 */

// Min days of week
let startDate;

// max days of week
let endDate;

// Min days of week
let nMin = 0

// max days of week
let nMax = 7

$(document).ready(function () {

    // Display schedule
    $('#display-class').on('submit', displaySchedule);

    let $weekPicker = $('#datepicker-schedule-date');

    // Display the current week
    function updateWeekStartEnd() {

        // Get current date
        let date = $weekPicker.datepicker('getDate') || new Date();

        // Update variable with start week
        startDate = $.datepicker.formatDate("mm/dd/yy", new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1));

        // Update variable with end Week
        endDate = $.datepicker.formatDate("mm/dd/yy", new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 7));

        $('.date').append(`<p> Semaine du ${startDate} au ${endDate}</p>`);
    }

    updateWeekStartEnd();

    // Display precedente and next week
    function updateDateText() {

        // Get actuel date
        let date = $weekPicker.datepicker('getDate') || new Date();
        $('#addWeek').on('click', function () {

            nMin += 7
            nMax += 7

            // Update variable + 7 days at the precWeek and nextWeek
            startDate = $.datepicker.formatDate("mm/dd/yy", new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + nMin + 1))
            endDate = $.datepicker.formatDate("mm/dd/yy", new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + nMax))

            $('.date').text('Semaine du ' + startDate + ' au ' + endDate);
            displaySchedule()
        })

        $('#precWeek').on('click', function () {

            nMin -= 7
            nMax -= 7

            //Update variable + 7 days at the precWeek and nextWeek
            startDate = $.datepicker.formatDate("mm/dd/yy", new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + nMin + 1))
            endDate = $.datepicker.formatDate("mm/dd/yy", new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + nMax))

            $('.date').text('Semaine du ' + startDate + ' au ' + endDate);
            displaySchedule()
        })
    }

    updateDateText();

    $(window).resize('width', function () {
        displaySchedule()
    });

})

function displaySchedule() {

    const classFirestore = firebase.firestore().collection('class');

    firebase.auth().onAuthStateChanged(function (user) {

        var currentUserConnected = firebase.auth().currentUser;

        if (currentUserConnected != null) {

            uid = user.uid;

            const datasUser = firebase.firestore().collection('users').doc(uid);

            datasUser.get().then(function (doc) {

                if (doc.exists) {

                    // Get collection where this class == class in dataBase
                    classFirestore.where("class", "==", doc.data().class).onSnapshot(function (querySnapshot) {

                        $(".s-act-tab").remove();
                        querySnapshot.forEach(function (doc) {

                            // Get all subject of this class
                            classFirestore.doc(doc.id).collection('subject').onSnapshot(function (querySnapshot) {
                                querySnapshot.forEach(function (doc) {

                                    // Get the subject who is in current week
                                    if (doc.data().date >= startDate && doc.data().date < endDate) {

                                        var schedule = {
                                            initialize: function () {
                                                schedule.activities.set();

                                            },
                                            options: {
                                                schedule: '#schedule',
                                                breaks: [], // breaks duration
                                                s_breaks: [], // the time after which the break begins
                                                lesson_time: 60, // lesson duration (minutes)
                                                lessons: 1, // number of lessons per week
                                                start: function () { // start at 7.10 
                                                    return schedule.general.toMin(9, 00)
                                                },
                                                end: function () { // start at 16.10 
                                                    return schedule.general.toMin(17, 00)
                                                },
                                                h_width: $('.s-hour-row').width(), // get a width of hour div
                                                minToPx: function () { // divide the box width by the duration of one lesson
                                                    return schedule.options.h_width / schedule.options.lesson_time;
                                                },
                                            },
                                            general: {
                                                hoursRegEx: function (hours) {
                                                    var regex = /([0-9]{1,2}).([0-9]{1,2})-([0-9]{1,2}).([0-9]{1,2})/;
                                                    if (regex.test(hours)) {
                                                        return true;
                                                    } else {
                                                        return false;
                                                    }

                                                },
                                                toMin: function (hours, minutes, string) {
                                                    // change time format (10,45) to minutes (645)
                                                    if (!string) {
                                                        return (hours * 60) + minutes;
                                                    }

                                                    if (string.length > 0) {
                                                        // "9.00"
                                                        var h = parseInt(string.split('.')[0]),
                                                            m = parseInt(string.split('.')[1]);

                                                        return schedule.general.toMin(h, m);
                                                    }
                                                },
                                                getPosition: function (start, duration, end) {
                                                    var translateX = (start - schedule.options.start()) * schedule.options.minToPx(),
                                                        width = duration * schedule.options.minToPx(),
                                                        breaks = schedule.options.breaks,
                                                        s_breaks = schedule.options.s_breaks;

                                                    $.each(breaks, function (index, item) {
                                                        if (start < s_breaks[index] && duration > item && end > (s_breaks[index] + item)) {
                                                            width -= item * schedule.options.minToPx();
                                                        }
                                                        if (start > s_breaks[index] && duration > item && end > (s_breaks[index] + item)) {
                                                            translateX -= item * schedule.options.minToPx();
                                                        }
                                                    });

                                                    return [translateX, width];
                                                }
                                            },
                                            activities: {
                                                find: function (week, hours, id) {

                                                },
                                                delete: function (week, hours) {
                                                    /* week: 0-4 << remove all activities from a day 
                                                       hours: "9.00-17.00" << remove all activities from a choosed hours
                                                    */
                                                    function finalize(message) {
                                                        if (confirm(message)) {
                                                            return true;
                                                        }
                                                    }

                                                    if (week && !hours) {
                                                        if (finalize("Do you want to delete all activities on the selected day?")) {
                                                            $('.s-activities .s-act-row:eq(' + week + ')').empty();
                                                        }
                                                    }

                                                    if (!week && !hours) {
                                                        console.log('Error. You have to add variables like a week (0-4) or hours ("9.10-10.45")!')
                                                    }
                                                    // if day is not defined and hours has got a correct form
                                                    if (!week && schedule.general.hoursRegEx(hours)) {

                                                        console.log('Week not defined and hours are defined!');

                                                        $(schedule.options.schedule + ' .s-act-tab').each(function (i, v) {
                                                            var t = $(this), // get current tab
                                                                name = t.children('.s-act-name').text(), // get tab name
                                                                h = t.attr('data-hours').split('-'), // get tab hours
                                                                s = schedule.general.toMin(0, 0, h[0]), // get tab start time (min)
                                                                e = schedule.general.toMin(0, 0, h[1]), // get tab end time (min)
                                                                uh = hours.split('-'), // user choosed time
                                                                us = schedule.general.toMin(0, 0, uh[0]), // user choosed start time (min)
                                                                ue = schedule.general.toMin(0, 0, uh[1]); // user choosed end time (min)

                                                            if (us <= s && ue >= e) {
                                                                $(this).remove();
                                                            }

                                                        })

                                                    }

                                                    if (week && hours) {
                                                        // if week and hours is defined 
                                                        console.log('Week is defined and hours are defined too!');

                                                        $('#schedule .s-act-row:eq(' + week + ') .s-act-tab').each(function (i, v) {
                                                            var t = $(this), // get current tab
                                                                name = t.children('.s-act-name').text(), // get tab name
                                                                h = t.attr('data-hours').split('-'), // get tab hours
                                                                s = schedule.general.toMin(0, 0, h[0]), // get tab start time (min)
                                                                e = schedule.general.toMin(0, 0, h[1]), // get tab end time (min)
                                                                uh = hours.split('-'), // user choosed time
                                                                us = schedule.general.toMin(0, 0, uh[0]), // user choosed start time (min)
                                                                ue = schedule.general.toMin(0, 0, uh[1]); // user choosed end time (min)

                                                            if (us <= s && ue >= e) {
                                                                $(this).remove();
                                                            }

                                                        })


                                                    };

                                                },
                                                add: function () {
                                                    /* EXAMPLES --> week: 0-4, lesson: "Math", hours: "9.45-12.50", 
                                                    classroom: 145, group: "A", teacher: "A. Badurski", color: "orange" */
                                                    var tab = "<div class='s-act-tab " + doc.data().color + "' data-hours='" + doc.data().time + "'>\
                                              <div class='s-act-name'>"+ doc.data().subject + "</div>\
                                              <div class='s-wrapper'>\
                                                <div class='s-act-teacher'>"+ doc.data().former + "</div>\
                                                <div class='s-act-room'>"+ doc.data().room + "</div>\
                                                <div class='s-act-group'>"+ doc.data().classname + "</div>\
                                              </div>\
                                            </div>";
                                                    $('.s-activities .s-act-row:eq(' + doc.data().line + ')').append(tab);
                                                    schedule.activities.set();
                                                },
                                                set: function () {
                                                    $(schedule.options.schedule + ' .s-act-tab').each(function (i) {
                                                        var hours = $(this).attr('data-hours').split("-"),
                                                            start = /* HOURS */ parseInt(hours[0].split(".")[0] * 60)
                                                                + /* MINUTES */ parseInt(hours[0].split(".")[1]),
                                                            end = /* HOURS */ parseInt(hours[1].split(".")[0] * 60)
                                                                + /* MINUTES */ parseInt(hours[1].split(".")[1]),
                                                            duration = end - start,
                                                            translateX = schedule.general.getPosition(start, duration, end)[0],
                                                            width = schedule.general.getPosition(start, duration, end)[1];

                                                        $(this)
                                                            .attr({ "data-start": start, "data-end": end })
                                                            .css({ "transform": "translateX(" + translateX + "px)", "width": width + "px" });
                                                    });
                                                }
                                            }

                                        }
                                        schedule.initialize();
                                        schedule.activities.add()
                                    }
                                })
                            })
                        })
                    })
                }
            })
        }
    });

}

$(window).resize('width', function () {
    displaySchedule()
});

setInterval(() => {
    displaySchedule()
}, 60000);

// Display shcedule one time
displaySchedule()