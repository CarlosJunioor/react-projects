const functions = require('firebase-functions');
const express = require('express');
const app = express();
// The Firebase Admin SDK to access Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

app.get('/admin/:email', (req,res) => {
  var email = req.params.email;
  admin.auth().getUserByEmail(email).then((userRecord) => {
    if(userRecord.customClaims['admin'] === true) {
      res.send('This person is already an admin!')
    } else {
      res.send('New admin added!')
      return admin.auth().setCustomUserClaims(userRecord.uid, {
        admin: true,
      });
    }
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
    res.send(error)
  });
})

const api = functions.https.onRequest(app)

module.exports = {
  api
}