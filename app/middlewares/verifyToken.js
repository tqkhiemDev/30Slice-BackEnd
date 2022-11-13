const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');

const verifyToken = (req, res, next) => {
  const authorizationClient = req.headers['authorization'];
  const token = authorizationClient && authorizationClient.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Vui lòng nhập Token.', status_code: 401 });
  }
  else {
    jwt.verify(token, PRIVATE_KEY, (err, user) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Token không hợp lệ.', status_code: 403 });
      }
      req.user = user;
      next();
    });
  }
};




const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role == 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Bạn không có quyền truy cập.', status_code: 403 });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin
};