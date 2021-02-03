/**
 * Display the attendance with day, justification, number of retard / absent / present
 */

$(document).ready(function () {
    const summary = firebase.firestore().collection('studentSummary')

    firebase.auth().onAuthStateChanged(function (user) {

        var currentUserConnected = firebase.auth().currentUser;

        if (currentUserConnected != null) {

            uid = user.uid;

            const datasUser = firebase.firestore().collection('users').doc(uid);

            datasUser.get().then(function (doc) {

                if (doc.exists) {

                    const currentUserName = doc.data().name


                    // Display the datas who is send by the former

                    summary.orderBy('day').get().then(function (querySnapshot) {

                        let displayDatasStudent = ''

                        querySnapshot.forEach(function (doc) {

                            const summeryName = doc.data().name

                            if (currentUserName == summeryName) {

                                displayDatasStudent +=
                                    `
                                    <tr>
                                        <td>
                                            <label>${doc.data().day}</label>
                                        </td>

                                        <td> 
                                            <label>${doc.data().justif}</label>
                                        </td> 

                                        <td>
                                            <label class="Presence">${doc.data().present}</label>
                                        </td>

                                        <td> 
                                            <label class="Retard">${doc.data().late}</label>
                                        </td>

                                        <td>
                                            <label class="Absence">${doc.data().absent}</label>
                                        </td>

                                    </tr>
                                `
                            }
                        })

                        $(`${displayDatasStudent}`).insertAfter($("#title-attendance")).innerHTML;
                        $("td label").text(function (index, text) {
                            return text.replace('false', '0');
                        });
                        $("td label").text(function (index, text) {
                            return text.replace('true', '1');
                        })
                    })
                }

            })
        }
    });
});