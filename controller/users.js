const User = require('../database/user-schema');
const bcrypt = require('bcrypt');
const { userAllowed } = require('../middleware/auth');

module.exports = {
  getUsers: (req, resp, next) => {
    const page = req.query.page;
    const limit = req.query.limit;
    User.paginate({}, { page, limit }, (err, users) => {
      if (err) {
        console.log(err);
        return next(500)
      };
      users.docs.forEach((user) => {
        delete user.password;
        return user;
      });
      return resp.status(200).json(users.docs);
    });
  },
  getOneUser: (req, resp, next) => {
    const { uid } = req.params;
    const field = uid.match(/@/g) ? 'email' : '_id';
    if (!userAllowed(req)){ return next(403) }
    User.findOne({ [field]: uid }, { password: 0 }, (err, dbUser) => {
      if (err || !dbUser) {
        return next(404);
      } else {
        resp.status(200).json(dbUser);
      }
    });
  },
  addUser: (req, resp, next) => {
    const { email, password, roles } = req.body;
    if (!email || !password) {
      return next(400)
    }
    User.findOne({ email: email }, (err, dbUser) => {
      if (dbUser) {
        return next(403);
      }
    });
    const user = new User({
      email,
      password: bcrypt.hashSync(password, 10),
      roles
    });
    user.save((err, newUser) => {
      if (err) {
        return next(400);
      }
      return resp.status(200).json({
        _id: newUser._id,
        email,
        roles
      });
    });
  },
  updateUser: async(req, resp, next) => {
    const { uid } = req.params;
    const { email, password, roles } = req.body;
    if (!userAllowed(req)){ return next(403) }
    const userIsAdminField = req.headers.user.roles.admin;
    if (roles) {
      if (!userIsAdminField && roles.admin !== userIsAdminField) {
        return next(403);
      }
    }
    if (!email || !password) {
      return next(400);
    }
    try {
      const doc = await User.updateOne({ _id: uid }, req.body);
      delete doc.password;
      return resp.status(200).json(doc);
    } catch(e) {
      return next(404)
    };

  },
  deleteUser: async (req, resp, next) => {
    const { uid } = req.params;
    if (!userAllowed(req)){ return next(403) }
    try {
      const doc = await User.deleteOne({ _id: uid });
      return resp.status(200).json(doc);
    } catch {
      return next(404);
    }
  }
};
