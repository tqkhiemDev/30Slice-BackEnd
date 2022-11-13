const models = require('../../models/auth');
const { user: User, ROLES } = models;

checkDuplicateInfo = (req, res, next) => {
  // Username
  User.findOne({
    Username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: 'Tên người dùng đã tồn tại!' });
      return;
    }

    // Email
    User.findOne({
      Email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res.status(400).send({ message: 'Email đã tồn tại!' });
        return;
      }

      // Phone
      User.findOne({
        Phone: req.body.phone,
      }).exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        if (user) {
          res.status(400).send({ message: 'Số điện thoại đã tồn tại!' });
          return;
        }
        next();
      });
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.role) {
    if (!ROLES.includes(req.body.role)) {
      res.status(400).send({
        message: `Không tồn tại role '${req.body.role}'!`,
      });
      return;
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateInfo,
  checkRolesExisted,
};

module.exports = verifySignUp;
