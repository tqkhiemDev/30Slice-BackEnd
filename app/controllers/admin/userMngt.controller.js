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
