const jwt = require("jsonwebtoken");
const { db } = require("../db-connection/connection");

const config = require("../config");

const { dbUrl } = config;
const { secret } = config;

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */
  app.post("/auth", (req, resp, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(400);
    }
    db(dbUrl).then((db) => {
      db.collection("users")
        .findOne({ email: email })
        .then((userData) => {
          if (!userData) return next(404);
          const user = {
            uid: userData._id,
          };
          const token = jwt.sign(user, secret, {
            expiresIn: 14440,
          });
          resp.json({
            token,
          });
        })
        .catch((err) => {
          if (err) {
            console.log(err);
            return next(501);
          }
        });
    });
  });
  return nextMain();
};
