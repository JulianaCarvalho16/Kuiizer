const admin = require("firebase-admin");
const { getFirestore } = require("firebase-admin/firestore"); // importa Firestore separado
const path = require("path");

const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT);
console.log("🔎 Caminho resolvido:", serviceAccountPath);

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.cert(serviceAccount), // na v14 é admin.cert
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// agora usamos getFirestore()
const db = getFirestore();
module.exports = db;

