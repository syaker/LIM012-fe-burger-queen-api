/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
const { ObjectID } = require("mongodb");
const { db } = require("../db-connection/connection");
const { dbUrl } = require("../config");
const { pagination } = require("../utils/pagination");

const mongodb = db(dbUrl);

const isEmail = (uid) => /\S+@\S+/.test(uid);

module.exports = {
  getUsers: (req, resp, next) => {
    const page = req.query.page || 1; // Pagina a consultar
    const limitNumber = req.query.limit || 10; // Limite de elementos por pagina
    const skipPage = (page - 1) * limitNumber; // De cuanto en cuanto se mostraran los documentos
    const url = `${req.protocol}://${req.get("host")}${req.path}`;
    const allUsers = mongodb.then((db) => {
      db.collection("users")
        .find({})
        .toArray()
        .then((docs) => docs);
    });
    const pagePagination = pagination(url, limitNumber, page, allUsers.length);
    resp.set("link", pagePagination);
    mongodb.then((db) => {
      db.collection("users")
        .find({})
        .skip(skipPage)
        .limit(Number(limitNumber))
        .toArray()
        .then((docs) => {
          const docsWhithoutPass = docs.map((doc) => {
            delete doc.password;
            return doc;
          });
          return resp.status(200).json(docsWhithoutPass);
        })
        .catch(() => next(500));
    });
  },

  getAnUser: (req, resp, next) => {
    const { _id, email, roles } = req.user;
    const { uid } = req.params;
    if (roles.admin === false) {
      if (!isEmail(uid)) {
        if (uid !== _id) return next(403);
      }
      if (uid !== email) return next(403);
    }
    if (!isEmail(uid)) {
      mongodb.then((db) => {
        db.collection("users")
          .findOne({ _id: ObjectID(uid) })
          .then((user) => {
            if (user === null) {
              return next(404);
            }
            if (user) {
              delete user.password;
              resp.status(200).json(user);
            }
          })
          .catch((err) => console.log(err));
      });
    } else {
      mongodb.then((db) => {
        db.collection("users")
          .findOne({ email: uid })
          .then((user) => {
            if (!user) return next(404);
            if (user) {
              delete user.password;
              resp.status(200).json(user);
            }
          })
          .catch((err) => console.log(err));
      });
    }
  },

  createAnUser: (req, resp, next) => {
    const { email, password, roles } = req.body;
    let adminRole;
    if (roles) {
      adminRole = { admin: roles.admin };
    } else {
      adminRole = { admin: false };
    }
    if (!password) return next(400);
    if (
      !password ||
      !email ||
      (!email && !password) ||
      password.length <= 3 ||
      !isEmail(email)
    ) {
      return next(400);
    }
    const user = {
      email,
      password,
      roles: adminRole,
    };
    mongodb.then((db) => {
      db.collection("users")
        .findOne({ email })
        .then((userData) => {
          if (!userData) {
            db.collection("users")
              .insertOne(user)
              .then((userData) => {
                const { email } = userData.ops[0];
                const { roles } = userData.ops[0];
                const { _id } = userData.ops[0];
                const userObj = {
                  _id,
                  email,
                  roles,
                };
                return userObj;
              })
              .then((userObj) => {
                resp.status(200).json(userObj);
              });
          }
          if (userData) return next(403);
        });
    });
  },

  updateAnUser: (req, resp, next) => {
    const { _id, email, roles } = req.user;
    const data = req.body;
    const { uid } = req.params;
    if (roles.admin === false) {
      if (!isEmail(uid)) {
        if (uid !== _id) return next(403);
      }
      if (uid !== email) return next(403);
    }
    if (req.body.roles) {
      if (roles.admin !== true) return next(403);
    }
    if (!isEmail(uid)) {
      mongodb.then((db) => {
        db.collection("users")
          .findOne({ _id: ObjectID(uid) })
          .then((user) => {
            if (!user) return next(404);
            if (!data.email && !data.password && !data.roles) return next(400);
            db.collection("users")
              .updateOne({ _id: ObjectID(uid) }, { $set: data })
              .then(() => {
                db.collection("users")
                  .findOne({ _id: ObjectID(uid) })
                  .then((userData) => {
                    delete userData.password;
                    resp.status(200).json(userData);
                  });
              });
          });
      });
    } else {
      mongodb.then((db) => {
        db.collection("users")
          .findOne({ email: uid })
          .then((user) => {
            if (user === null) return next(404);
            if (!data.email && !data.password && !data.roles) return next(400);
            db.collection("users").updateOne({ email: uid }, { $set: data });
            db.collection("users")
              .findOne({ email: uid })
              .then((userData) => {
                resp.status(200).json(userData);
              });
          });
      });
    }
  },

  deleteAnUser: (req, resp, next) => {
    const { _id, email, roles } = req.user;
    const { uid } = req.params;
    if (roles.admin === false) {
      if (!isEmail(uid)) if (uid !== _id) return next(403);
      if (uid !== email) return next(403);
    }
    if (!isEmail(uid)) {
      mongodb.then((db) => {
        db.collection("users")
          .findOne({ _id: ObjectID(uid) })
          .then((userData) => {
            if (!userData) return next(404);
            db.collection("users")
              .deleteOne({ _id: ObjectID(uid) })
              .then(() => {
                db.collection("users")
                  .findOne({ _id: ObjectID(uid) })
                  .then((user) => {
                    if (!user) resp.status(200).json(userData);
                  });
              });
          })
          .catch(() => next(404));
      });
    } else {
      mongodb.then((db) => {
        db.collection("users")
          .findOne({ email: uid })
          .then((userData) => {
            if (!userData) return next(404);
            db.collection("users").deleteOne({ email: uid });
            db.collection("users")
              .findOne({ email: uid })
              .then((user) => {
                if (!user) resp.status(200).json(userData);
              });
          })
          .catch(() => next(404));
      });
    }
  },
};
