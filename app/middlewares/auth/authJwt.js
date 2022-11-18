const jwt = require('jsonwebtoken');
const config = require('../../config/auth.config');
const db = require('../../models/auth');
const User = db.user;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(401)
      .send({ message: 'Unauthorized! Access Token was expired!' });
  }

  return res.sendStatus(401).send({ message: 'Unauthorized!' });
};

const verifyToken = (req, res, next) => {
  let token = req.headers?.Authorization.replace('Bearer ', '');
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user && user.Role === 'admin') {
      next();
      return;
    }

    res.status(403).send({ message: 'Require Admin Role!' });
    return;
  });
};

const isStylelist = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user && user.Role === 'styleList') {
      next();
      return;
    }

    res.status(403).send({ message: 'Require Stylelist Role!' });
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isStylelist,
};
module.exports = authJwt;
