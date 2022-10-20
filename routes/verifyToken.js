const jwt = require("jsonwebtoken");
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');


function verifyToken(req, res, next) {
    const authorizationClient = req.headers['authorization'];
    const token = authorizationClient && authorizationClient.split(' ')[1]
    if (!token) return res.status(401).json({"message": "Vui lòng nhập Token.","status_code": 401})
      try {
        const userInfo = jwt.verify(token, PRIVATE_KEY)
        res.user = userInfo
        next()
      } catch (e) {
        return res.status(403).json({"message": "Token không hợp lệ.","status_code": 403})
      }
    }


module.exports = verifyToken;