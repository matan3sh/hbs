import firebase from 'firebase/app'
import 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

// Initialize Firebase
const config = {
    apiKey: "AIzaSyD2Y_mc80ynED3jpR1aDVCTGWvT_5ovQkQ",
    authDomain: "h-bs-39e99.firebaseapp.com",
    databaseURL: "https://h-bs-39e99.firebaseio.com",
    projectId: "h-bs-39e99",
    storageBucket: "h-bs-39e99.appspot.com",
    messagingSenderId: "287437563939"
  };

  firebase.initializeApp(config);

  const firebaseDB = firebase.database();
  const firebaseMatches = firebaseDB.ref('matches');
  const firebasePromotions = firebaseDB.ref('promotions');
  const firebaseTeams = firebaseDB.ref('teams');
  const firebasePlayers = firebaseDB.ref('players');

  export {
      firebase,
      firebaseMatches,
      firebasePromotions,
      firebaseTeams,
      firebasePlayers,
      firebaseDB
  }