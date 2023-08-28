const { getFirestore } = require('firebase-admin/firestore');
const { getStorage } = require('firebase-admin/storage');
const admin = require('firebase-admin');

const serviceAccount = require("./key.json");

const initializeFirestore = (app) => {
  let firestore = getFirestore(app);
  return firestore;
};

const initializeFirebaseStorage = (app) => {
  let firebaseStorage = getStorage(app);
  return firebaseStorage;
};

const initialize = () => {
  const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  const firestore =  initializeFirestore(app);
  const firebaseStorage = initializeFirebaseStorage(app);
  return {
    firestore,
    firebaseStorage
  }
}

module.exports = initialize();
