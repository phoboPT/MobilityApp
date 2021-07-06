import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
var firebaseConfig = {
  apiKey: 'AIzaSyDFLQDGb00IociGsqpThE58XY0F87dRVQ8',
  authDomain: 'mobilityone-67d68.firebaseapp.com',
  projectId: 'mobilityone-67d68',
  storageBucket: 'mobilityone-67d68.appspot.com',
  messagingSenderId: '524759516643',
  appId: '1:524759516643:web:327164b28299f145214cd6',
  measurementId: 'G-4NC9MMPXEF',
};
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
const db = app.firestore();
const auth = firebase.auth();
export {db, auth};
