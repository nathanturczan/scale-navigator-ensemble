// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyBiTTX24mBjypGdel2ARBx0UUvFQEaRDf4",
    authDomain: "scale-navigator-ensemble.firebaseapp.com",
    databaseURL: "https://scale-navigator-ensemble-default-rtdb.firebaseio.com",
    projectId: "scale-navigator-ensemble",
    storageBucket: "scale-navigator-ensemble.appspot.com",
    messagingSenderId: "156837833740",
    appId: "1:156837833740:web:ce00fcf2297f899f8b9229",
    measurementId: "G-5G2C3541ZY"
};

let db;
let room = null;

let isHost = false;
// Initialize Firebase
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
}

const roomNameInput = document.getElementById("room-name-input");
document
    .getElementById("room-creation-form")
    .addEventListener("submit", (evt) => {
        evt.preventDefault();
        const name = roomNameInput.value;

        if (name && db) {
            db.ref(`/rooms`).push({
                name
            });
        }
    });

db.ref("/rooms").on("value", (evt) => {
    const children = evt.val();
    const rooms = Object.keys(children).map((key) => ({
        name: children[key].name,
        key
    }));

    updateRoomOptions(rooms);
    document.getElementById("available-rooms").value = room;
});

function updateRoomOptions(rooms) {
    const options = rooms
        .map(({
            key,
            name
        }) => `<option value=${key}>${name}</option>`)
        .join("\n");
    document.getElementById("available-rooms").innerHTML = options;
}

function writeValueToFirebase(val) {
    if (room) {
        db.ref(`/rooms/${room}`).update({
            current_scale: val
        });
    }
}



document
    .getElementById("room-select-form")
    .addEventListener("submit", (evt) => {
        evt.preventDefault();
        room = document.getElementById("available-rooms").value;
        console.log("this room:", room);
        
        var ref = db.ref("/rooms/"+room+"/current_scale");
		
		// Attach an asynchronous callback to read the data at our posts reference
		ref.on("value", function(snapshot) {
		  console.log("whats going on here....", snapshot.val());

          document.getElementById("scale_from_firebase").innerHTML = snapshot.val();
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});

    });

document.getElementById("host-select").addEventListener("change", (evt) => {
    isHost = evt.target.checked;
    console.log(isHost);

	$('body').on('DOMSubtreeModified', '#send_to_firebase', function() {
		writeValueToFirebase(document.getElementById("send_to_firebase").textContent);
	});
});



