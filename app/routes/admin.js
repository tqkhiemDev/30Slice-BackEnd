const Login = require("../models/Login");
const Style_List = require("../models/Style_List");
const {
  verifyToken,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const { authJwt } = require("../middlewares/auth");

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const PRIVATE_KEY = fs.readFileSync("./private-key.txt");
const bcrypt = require("bcrypt");

const Mailjet = require("node-mailjet");
const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC || "",
  apiSecret: process.env.MJ_APIKEY_PRIVATE || "",
});

// register by admin
router.post(
  "/addUser",
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    try {
      const newUser = new Login({
        Username: req.body.username,
        Password: bcrypt.hashSync(req.body.password, 8),
        Full_Name: req.body.full_name,
        Email: req.body.email,
        Phone: req.body.phone,
        Role: req.body.role,
      });
      const user = await newUser.save();
      switch (req.body.role) {
        case "styleList":
          const newStyle_List = new Style_List({
            Id_User: user._id,
            Shifts: req.body.shifts,
          });
          const style_list = await newStyle_List.save();
          break;
        case "writer":
          break;
        default:
      }
      res
        .status(201)
        .json({ message: `Đã thêm thành công người dùng ${newUser.Username}` });
    } catch (err) {
      if (err.code == 11000) {
        res.status(200).json({
          message: `${Object.keys(err.keyValue)[0]} ${
            Object.values(err.keyValue)[0]
          } đã tồn tại`,
        });
      } else {
        res.status(500).json(err);
      }
    }
  }
);
// change password admin
router.put(
  "/change-password",
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    try {
      const user = await Login.findOne({ _id: req.userId });
      if (user) {
        // statement
        const passwordIsValid = bcrypt.compareSync(
          req.body.old_password,
          user.Password
        );
        console.log(passwordIsValid);
        if (!passwordIsValid) {
          res.status(200).json({
            message: "Mật khẩu cũ không đúng.",
          });
        } else {
          user.Password = bcrypt.hashSync(req.body.new_password, 8);
          await user.save();
          res.status(201).json({ message: "Đổi mật khẩu thành công" });
        }
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// change password by admin
router.post(
  "/change-password-by-admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    try {
      const user = await Login.findOne({ _id: req.body.id });
      if (user) {
        // statement
        user.Password = bcrypt.hashSync(req.body.new_password, 8);
        await user.save();
        res.status(200).json({ message: "Đổi mật khẩu thành công" });
      } else {
        res.status(401).json({
          message: "Thông tin đăng nhập không đúng.",
          status_code: 401,
        });
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
);
// forgot password send email
router.post("/forgot-password", async (req, res) => {
  try {
    const user = await Login.findOne({ Email: req.body.email });
    if (user) {
      // statement
      const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        PRIVATE_KEY,
        { expiresIn: "5m" }
      );
      const request = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "no-reply@30slice.com",
              Name: "30slice",
            },
            To: [
              {
                Email: req.body.email,
                Name: user.Full_Name,
              },
            ],
            Variables: {
              name: `${user.Full_Name}`,
              link: `http://localhost:3000/reset-password/?token=${accessToken}`,
            },
            TemplateID: 4318212,
            TemplateLanguage: true,
            Subject: "30slice - Khôi phục mật khẩu",
          },
        ],
      });
      if (request.body.Messages[0].Status === "success") {
        res.status(200).json({ message: "Gửi email thành công" });
      } else {
        res.status(400).json({ message: "Gửi email thất bại" });
      }
    } else {
      res
        .status(401)
        .json({ message: "Email không tồn tại.", status_code: 401 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// reset password
router.post("/reset-password", authJwt.verifyToken, async (req, res) => {
  try {
    const user = await Login.findOne({ _id: req.userId });
    if (user) {
      // statement
      user.Password = bcrypt.hashSync(req.body.new_password, 8);
      await user.save();
      res.status(200).json({ message: "Đổi mật khẩu thành công" });
    } else {
      res
        .status(401)
        .json({ message: "Thông tin đăng nhập không đúng.", status_code: 401 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
