const config = require('../../config/auth.config');
const models = require('../../models/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { user: User, refreshToken: RefreshToken } = models;
exports.signup = (req, res) => {
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
      res.send({ message: 'Đăng ký thành công!' });
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    Username: req.body.username,
  }).exec(async (err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: 'Người dùng không tồn tại.' });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.Password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: 'Sai mật khẩu!',
      });
    }

    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    const refreshToken = await RefreshToken.createToken(user);

    res.status(200).send({
      id: user._id,
      username: user.Username,
      image : user.Images,
      name: user.Full_Name,
      email: user.Email,
      role: user.Role,
      accessToken: token,
      refreshToken: refreshToken,
      phone : user.Phone
    });
  });
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: 'Refresh Token is required!' });
  }

  try {
    const refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: 'Refresh token is not in database!' });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: 'Refresh token was expired. Please make a new signin request',
      });
      return;
    }

    const newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
