const connectToDB = require('./db-connect.js');
const { dbUrl } = require('../config');

exports.getAllDocuments = (collectionName) => connectToDB(dbUrl).then((db) => db.collection(collectionName).find().toArray());
exports.getDocument = (collectionName, query) => connectToDB(dbUrl).then((db) => db.collection(collectionName).findOne(query));
exports.addDocument = (collectionName, object) => connectToDB(dbUrl).then((db) => db.collection(collectionName).insertOne(object));
exports.deleteDocument = (collectionName, query) => connectToDB(dbUrl).then((db) => db.collection(collectionName).deleteOne(query));
exports.updateDocument = (collectionName, query, newValue) => connectToDB(dbUrl).then((db) => db.collection(collectionName).updateOne(query, newValue));
