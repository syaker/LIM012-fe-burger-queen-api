const User = require('../database/user-schema');

module.exports = {
  getUsers: (req, resp, next) => {
    User.find((err, users) => {
      if (err) return next(400);
      resp.json(users);
      return next();
    })
  },
};
