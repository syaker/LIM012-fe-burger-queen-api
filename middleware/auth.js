const jwt = require('jsonwebtoken');
const User = require('../database/user-schema');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
  });
};


module.exports.isAuthenticated = (req) => {
  const { email } = req.body;
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  User.findOne({ email: email }, (err, dbUser) => {
    if (dbUser) {
      return true;
    } else {
      console.log('false')
      return false;
    }
  });
};


module.exports.isAdmin = (req) => (
  // TODO: decidir por la informacion del request si la usuaria es admin
  true
);


module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);


module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
