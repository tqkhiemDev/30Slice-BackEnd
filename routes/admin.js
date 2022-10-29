const Login = require('../models/Login');
const Style_List = require('../models/Style_List');
const verifyTokenAndAdmin = require('../middleware/verifyToken');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');

router.post('/login', async (req, res) => {
  try {
    const user = await Login.findOne({ username: req.body.username });
    if (user) {
      // statement
      if (user.Password !== req.body.password) {
        res
          .status(401)
          .json({
            message: 'Thông tin đăng nhập không đúng.',
            status_code: 401,
          });
      } else {
        const accessToken = jwt.sign(
          { id: user._id, role: user.role },
          PRIVATE_KEY,
          { expiresIn: '2h' }
        );
        res
          .status(200)
          .json({ accessToken, role: user.Role, username: user.Username });
      }
    } else {
      res
        .status(401)
        .json({ message: 'Thông tin đăng nhập không đúng.', status_code: 401 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// register by admin
router.post('/register', verifyTokenAndAdmin, async (req, res) => {
  try {
    const newUser = new Login({
      Username: req.body.username,
      Password: req.body.password,
      Full_Name: req.body.full_name,
      Email: req.body.email,
      Phone: req.body.phone,
      Role: req.body.role,
    });
    const user = await newUser.save();
    switch (req.body.role) {
      case 'styleList':
        const newStyle_List = new Style_List({
          Id_User: user._id,
          Shifts: [],
        });
        const style_list = await newStyle_List.save();

        break;
      case 'writer':
        break;
      default:
    }

    res.status(200).json(user);
  } catch (err) {
    if (err.code == 11000) {
      res
        .status(400)
        .json({ message: `${Object.keys(err.keyValue)[0]} ${Object.values(err.keyValue)[0]} đã tồn tại`, status_code: 400 });
    } else {
      res.status(500).json(err);
    }

  }
});
// change password admin
router.post('/change-password', verifyTokenAndAdmin, async (req, res) => {
  try {
    console.log(res.user);
    const user = await Login.findOne({ _id: res.user.id });
    if (user) {
      // statement
      if (user.Password !== req.body.old_password) {
        res
          .status(401)
          .json({
            message: 'Mật khẩu cũ không đúng.',
            status_code: 401,
          });
      } else {
        user.Password = req.body.new_password;
        await user.save();
        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
      }
    } else {
      res
        .status(401)
        .json({ message: 'Thông tin đăng nhập không đúng.', status_code: 401 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// change password by admin
router.post('/change-password-by-admin', verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await Login.findOne({ _id: req.body.id });
    if (user) {
      // statement
      user.Password = req.body.new_password;
      await user.save();
      res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } else {
      res
        .status(401)
        .json({ message: 'Thông tin đăng nhập không đúng.', status_code: 401 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
