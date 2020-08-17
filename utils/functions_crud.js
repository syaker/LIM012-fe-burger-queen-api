const { db } = require("../db-connection/connection");
const { ObjectID } = require("mongodb");
const { dbUrl } = require("../config");

const mongodb = db(dbUrl);

const findAll = (collection, skip_page, limitNumber, next) => {
  return mongodb
    .then((db) => {
      return db
        .collection(collection)
        .find({})
        .skip(skip_page)
        .limit(Number(limitNumber))
        .toArray();
    })
    .catch((err) => {
      console.log(err);
      return next(404);
    });
};

const findAllUsers = (collection, next) => {
  return mongodb
    .then((db) => {
      return db.collection(collection).find({}).toArray();
    })
    .catch((err) => {
      console.log(err);
      return next(404);
    });
};
const findById = (collection, uid, next) => {
  return mongodb
    .then((db) => {
      return db.collection(collection).findOne({ _id: ObjectID(uid) });
    })
    .catch((err) => {
      console.log(err);
      return next(404);
    });
};

const findByEmail = (collection, email, next) => {
  return mongodb
    .then((db) => {
      return db.collection(collection).findOne({ email: email });
    })
    .catch((err) => {
      console.log(err);
      return next(404);
    });
};

const insertDoc = (collection, doc, next) => {
  return mongodb
    .then((db) => {
      return db.collection(collection).insertOne(doc);
    })
    .catch((err) => {
      console.log(err);
      return next(404);
    });
};

const deleteById = (collection, uid, next) => {
  return mongodb
    .then((db) => {
      return db.collection(collection).deleteOne({ _id: ObjectID(uid) });
    })
    .catch((err) => {
      console.log(err);
      return next(404);
    });
};

const deleteByEmail = (collection, email, next) => {
  return mongodb
    .then((db) => {
      return db.collection(collection).deleteOne({ email: email });
    })
    .catch((err) => {
      console.log(err);
      return next(404);
    });
};
module.exports = {
  findById,
  findAll,
  findByEmail,
  findAllUsers,
  insertDoc,
  deleteByEmail,
  deleteById,
};
