const functions = require("firebase-functions");

const admin = require("firebase-admin");

exports.getRooms = functions.https.onRequest((request, response) => {
  admin.database().ref("/rooms").once("value", (snap) => {
    response.send(snap.val());
  });
});

exports.addRoom = functions.https.onRequest((request, response) => {
  admin.database().ref("/rooms").push().set({
    ip_address: request.ip,
    name: request.query.name,
  });
  response.send("Room Created!");
});

exports.delRoom = functions.https.onRequest((request, response) => {
  const ref = admin.database().ref("/rooms");
  const query = ref.orderByChild("ip_address").equalTo(request.ip);
  query.once("value", function(snapshot) {
    snapshot.forEach(function(child) {
      child.ref.remove().then(function() {
        response.send("Room Removed");
      });
    });
  });
});
