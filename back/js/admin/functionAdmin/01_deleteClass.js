$(document).ready(function () {

    const classFirestore = firebase.firestore().collection('class');

    //delete class
    classFirestore.get().then((function (querySnapshot) {

        querySnapshot.forEach(function (doc) {

            let classId = doc.id

            $('#ctnr-class-list').on('click', ".fai-delete" + "." + doc.id, function () {

                classFirestore.doc(doc.id).delete().then(function () {
                    console.log("Document successfully deleted!");
                }).catch(function (error) {
                    console.error("Error removing document: ", error);
                });

                classFirestore.doc(classId).collection('subject').get().then((function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        classFirestore.doc(classId).collection('subject').doc(doc.id).delete().then(function () {
                            console.log("Document successfully deleted!");
                            $(".s-act-tab").remove();
                        }).catch(function (error) {
                            console.error("Error removing document: ", error);
                        });
                    })
                }))

            })
        })
    }))
})

// $(document).ready(function () {

//     const classFirestore = firebase.firestore().collection('class');

//     //delete class
//     classFirestore.get().then((function (querySnapshot) {

//         querySnapshot.forEach(function (doc) {

//             $('#ctnr-class-list').on('click', ".fai-delete" + "." + doc.id, function () {

//                 classFirestore.doc(doc.id).delete().then(function () {
//                     console.log("Document successfully deleted!");
//                 }).catch(function (error) {
//                     console.error("Error removing document: ", error);
//                 });
//             })
//         })
//     }))
// })