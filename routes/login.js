const Login = require("../models/Login");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');


router.post("/login", async (req, res) => {
    try {
      const user = await Login.findOne({ username: req.body.username });
      if (user) {
        // statement
        if ( user.Password !== req.body.password ){
          res.status(401).json({"message": "Thông tin đăng nhập không đúng.","status_code": 401});
        }else{
          const accessToken = jwt.sign(
            { id: user._id,role: user.role },PRIVATE_KEY,{ expiresIn: "2h" });
          res.status(200).json({ accessToken,role: user.Role,username: user.Username });
        }
      }else{
        res.status(401).json({"message": "Thông tin đăng nhập không đúng.","status_code": 401});
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;