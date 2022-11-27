const models = require('../../models/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { user: User } = models;

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.addUser = (req, res) => {
  const user = new User({
    Username: req.body.username,
    Password: bcrypt.hashSync(req.body.password, 8),
    Email: req.body.email,
    Full_Name: req.body.full_name,
    Phone: req.body.phone,
    Role: req.body.role,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    user.save((err) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ message: 'Thêm người dùng thành công!' });
    });
  });
};
