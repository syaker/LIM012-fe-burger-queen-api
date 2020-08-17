const jwt = require("jsonwebtoken");
const { db } = require("../db-connection/connection");
const { ObjectID } = require("mongodb");
const { dbUrl } = require("../config");

const mongodb = db(dbUrl);

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(" ");

  if (type.toLowerCase() !== "bearer") {
    return next();
  }
  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    const uid = decodedToken.uid;
    mongodb.then((db) => {
      db.collection("users")
        .findOne({ _id: ObjectID(uid) })
        .then((user) => {
          req.user = user;
          next();
        })
        .catch(() => {
          return next(404);
        });
    });

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
  });
};

module.exports.isAuthenticated = (req) =>
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  req.user ? true : false;

module.exports.isAdmin = (req) => {
  // TODO: decidir por la informacion del request si la usuaria es admin
  if (req.user.roles.admin === true) {
    return true;
  }
  return false;
};

module.exports.requireAuth = (req, resp, next) =>
  !module.exports.isAuthenticated(req) ? next(401) : next();

module.exports.requireAdmin = (req, resp, next) =>
  // eslint-disable-next-line no-nested-ternary
  !module.exports.isAuthenticated(req)
    ? next(401)
    : !module.exports.isAdmin(req)
    ? next(403)
    : next();
