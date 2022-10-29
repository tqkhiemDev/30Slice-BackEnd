const Login = require('../models/Login');
const Style_List = require('../models/Style_List');
const { verifyToken, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');
const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || '',
  apiSecret: process.env.MJ_APIKEY_PRIVATE || '',
});
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
          { id: user._id, role: user.Role },
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
    const user = await Login.findOne({ _id: req.user.id });
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
// forgot password send email
router.post('/forgot-password', async (req, res) => {
  try {
    const user = await Login.findOne({ Email: req.body.email });
    if (user) {
      // statement
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        PRIVATE_KEY,
        { expiresIn: '5m' }
      );
      const request = await mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: 'no-reply@30slice.com',
              Name: '30slice',
            },
            To: [
              {
                Email: req.body.email,
                Name: user.Full_Name,
              },
            ],
            Subject: '30slice - Khôi phục mật khẩu',
            TextPart: 'Khôi phục mật khẩu',
            HTMLPart: `<h3>Chào ${user.Full_Name},</h3>
            <p>Bạn vừa yêu cầu khôi phục mật khẩu tại 30slice. Vui lòng click vào link bên dưới để tiếp tục.</p>
            <a href="https://30slice.com/reset-password/${accessToken}">Khôi phục mật khẩu</a>
            <p>Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này.</p>
            <p>Trân trọng,</p>
            <p>30slice</p>`,
            CustomID: 'AppGettingStartedTest',
          },
        ],
      });
      console.log(request.body);
      if (request.body.Messages[0].Status === 'success') {
        res.status(200).json({ message: 'Gửi email thành công' });
      }
    } else {
      res
        .status(401)
        .json({ message: 'Email không tồn tại.', status_code: 401 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// reset password
router.post('/reset-password', verifyToken, async (req, res) => {
  try {
    const user = await Login.findOne({ _id: req.user.id });
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
