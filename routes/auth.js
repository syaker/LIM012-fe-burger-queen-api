const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcrypt');
const User = require('../database/user-schema');
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
  app.post('/auth', (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }
    User.findOne({ email: email }, (err, dbUser) => {
      if (err) {
        return next(500);
      }
      // verificar si existe el usuario por medio del email
      if (!dbUser) {
        return next(400);
      }
      // TODO: autenticar a la usuarix
      // Verficar si la contrasena corresponde al email
      if (!bcrypt.compareSync(password, dbUser.password)) {
        return next(400);
      }
    });
    // Se genera el token de autenticación
    const token = jwt.sign({
      uid: dbUser._id,
    }, secret, {
      expiresIn: 60 * 60 * 24
    });
    resp.json({
      auth: true,
      user, dbUser,
      token,
    });

    next();
  });

  return nextMain();
};
