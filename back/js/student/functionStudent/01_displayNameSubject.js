/**
 * Get the user name with uid and display it
 */

const status = firebase.firestore().collection('status');
const usersRef = firebase.firestore().collection('users');

const storageRef = firebase.storage().ref();
const listRef = storageRef.child('photos');

$(document).ready(function () {


    firebase.auth().onAuthStateChanged(function (user) {
        var currentUserConnected = firebase.auth().currentUser;
        if (currentUserConnected != null) {

            uid = user.uid;

            const datasUser = firebase.firestore().collection('users').doc(uid);

            datasUser.get().then(function (doc) {
                if (doc.exists) {

                    $(".name-disconnect").prepend(`<h3>${doc.data().name} ${doc.data().username}</h3>`);


                    $('#file').on('change', onSelectFile);

                    function onSelectFile(event) {

                        // Get file
                        const file = event.target.files[0];

                        const storageRef = firebase.storage().ref();

                        var deleteRef = storageRef.child(`photos/${doc.data().username}`);

                        // Delete the file
                        deleteRef.delete().then(function () {
                            // File deleted successfully
                        }).catch(function (error) {
                            // Uh-oh, an error occurred!
                        });

                        // Send file in dataBase
                        const uploadTask = storageRef.child(`photos/${doc.data().username}`).put(file);

                        // Delete the preview image
                        uploadTask.on('state_changed', onStateChanged, onError, onComplete);
                        function onStateChanged(snapshot) {
                            snapshot.state;            // 'paused' ou 'running'
                            snapshot.bytesTransferred; // nb d'octets déjà téléchargés
                            snapshot.totalBytes;      // taille totale du fichier en octets
                            console.log(snapshot.bytesTransferred)
                            console.log(snapshot.totalBytes)
                            $('#preview-picture img').remove()
                        }
                        function onError(error) {
                            console.error('Oops…', error);
                        }

                        function onComplete() {
                            console.log('File uploaded!');


                            // Find all the prefixes and items.
                            listRef.listAll().then(function (res) {
                                res.items.forEach(async function (itemRef) {


                                    // Récupération des metadata (pour obtenir la taille et la date de création) (renvoie une promesse)
                                    const metadata = await itemRef.getMetadata();
                                    // Récupération de l'URL pour créer un lien vers l'image (renvoie une promesse)
                                    const downloadURL = await itemRef.getDownloadURL();

                                    // Display preview picture if users have upload picture
                                    if (itemRef.name == doc.data().username) {
                                        console.log(itemRef.name)

                                        // Update new data URL
                                        usersRef.doc(doc.id).update({
                                            pictureURL: downloadURL
                                        });
                                    }

                                });
                            }).catch(function (error) {
                                alert('Une erreur s\'est produite lors du listing des fichiers\n' + error);
                            });

                            // Show preview
                            document.getElementById('preview-picture').innerHTML +=
                                `<img src="${doc.data().pictureURL}" alt="picture">`;
                        }
                    }
                    usersRef.where('username', "==", doc.data().username).onSnapshot(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            console.log(doc.data())

                            $('#current-picture img').remove()
                            document.getElementById('current-picture').innerHTML +=
                                `<img src="${doc.data().pictureURL}" alt="picture">`;

                            // Show new preview img
                            document.getElementById('preview-picture').innerHTML +=
                                `<img src="${doc.data().pictureURL}" alt="picture">`;

                            if (doc.data().pictureURL != '') {
                                $('#send-picture').on('submit', function (e) {
                                    e.preventDefault()
                                    $('.default-img').remove()
                                    $('.picture-change').css('display', 'none')
                                    $('#current-picture img').remove()
                                    document.getElementById('current-picture').innerHTML +=
                                        `<img src="${doc.data().pictureURL}" alt="picture">`;
                                })
                            }
                        })
                    })
                }
            })
        }
    });
})