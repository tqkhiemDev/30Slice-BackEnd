const Login = require('../models/Login');
const Customer = require('../models/Customer');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');
const bcrypt = require('bcrypt');
const { authJwt } = require('../middlewares/auth');

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
// customer register
router.post('/register', async (req, res) => {
  try {
    const newUser = new Login({
      Username: makeid(15),
      Password: makeid(20),
      Email: `${makeid(10)}@gmail.com`,
      Full_Name: req.body.full_name,
      Phone: req.body.phone,
    });
    const user = await newUser.save();
    const newCustomer = new Customer({
      Id_User: user._id,
      isSignUp: false,
    });
    const customer = await newCustomer.save();
    let respon = {
      Id_User: user._id,
      Full_Name: user.Full_Name,
      Phone: user.Phone,
    };
    res.status(200).json(respon);
  } catch (err) {
    res.status(500).json(err);
  }
});
// get all customer
router.get(
  '/getAllCustomer',
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    try {
      const users = await Customer.aggregate([
        {
          $match: {
            isSignUp: true,
          },
        },
        {
          $lookup: {
            from: 'logins',
            localField: 'Id_User',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $project: {
            _id: 0,
            History: 0,
            Style_List_Favorite: 0,
            Schedule: 0,
            __v: 0,
            'user._id': 0,
            'user.Password': 0,
            'user.__v': 0,
            'user.createdAt': 0,
            'user.updatedAt': 0,
          },
        },
      ]);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get(
  '/getCustomer/:id',
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
      const user = await Customer.find({ Id_User: id }).populate(
        'Id_User',
        '-Password'
      );
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// customer sign up
router.post('/signup', async (req, res) => {
  try {
    const isSignUp = await Customer.findOne({
      Phone: req.body.phone,
      isSignUp: false,
    });
    console.log(isSignUp);
    if (isSignUp) {
      const user = await Login.findByIdAndUpdate(
        isSignUp.Id_User,
        {
          $set: {
            Username: req.body.username,
            Password: bcrypt.hashSync(req.body.password, 8),
            Email: req.body.email,
            Full_Name: req.body.full_name,
            isSignUp: true,
          },
        },
        { new: true }
      );
      const customer = await Customer.findByIdAndUpdate(
        isSignUp._id,
        {
          $set: {
            isSignUp: true,
          },
        },
        { new: true }
      );
      res.status(200).json(user);
    } else {
      const newUser = new Login({
        Username: req.body.username,
        Password: bcrypt.hashSync(req.body.password, 8),
        Email: req.body.email,
        Full_Name: req.body.full_name,
        Phone: req.body.phone,
      });
      const user = await newUser.save();
      const newCustomer = new Customer({
        Id_User: user._id,
        isSignUp: true,
      });
      const customer = await newCustomer.save();
      res.status(200).json(user);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// booking by customer
router.post('/booking', async (req, res) => {
  try {
    const user = await Login.findOne({ Phone: req.body.phone });
    if (user) {
      res.status(200).json({
        Id_User: user._id,
        Full_Name: user.Full_Name,
        Phone: user.Phone,
      });
    } else {
      res
        .status(204)
        .json({ message: 'Số điện thoại này chưa đăng ký', status_code: 204 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put('/change-password', authJwt.verifyToken, async (req, res) => {
  console.log(req.userId);
  try {
    const user = await Login.findOne({ _id: req.userId });
    if (user) {
      // statement
      const passwordIsValid = bcrypt.compareSync(
        req.body.old_password,
        user.Password
      );
      // console.log(passwordIsValid);
      if (!passwordIsValid) {
        res.status(200).json({
          message: 'Mật khẩu cũ không đúng.',
        });
      } else {
        user.Password = bcrypt.hashSync(req.body.new_password, 8);
        await user.save();
        res.status(201).json({ message: 'Đổi mật khẩu thành công' });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
// change info
router.put('/change-info', authJwt.verifyToken, async (req, res) => {
  try {
    const user = await Login.findOne({ _id: req.userId });
    if (user) {
      // statement
      user.Full_Name = req.body.name;
      user.Phone = req.body.phone;
      user.Username = req.body.username;
      user.Email = req.body.email;
      await user.save();
      res.status(201).json({ message: 'Đổi thông tin thành công' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
//  change avatar
router.put('/change-avatar', authJwt.verifyToken, async (req, res) => {
  try {
    await Login.findByIdAndUpdate(
      req.userId,
      {
        $set: {
          Images: req.body.Images,
        },
      },
      { new: true }
    );
    res.status(201).json({ message: 'Đổi avatar thành công' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// // user sign up
// router.post("/signup", async (req, res) => {
//   try {
//     const newUser = new Login({
//       Username: req.body.username,
//       Password: req.body.password,
//       Email: req.body.email,
//       Full_Name: req.body.full_name,
//       Phone: req.body.phone,
//     });
//     const user = await newUser.save();
//     const newCustomer = new Customer({
//       Id_User: user._id,
//     });
//     const customer = await newCustomer.save();
//     const { Password , ...other} = user._doc

//     res.status(200).json(other);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// user sign in
// router.post("/signin", async (req, res) => {
//   try {
//     const user = await Login.findOne({ Username: req.body.username });
//     if (user) {
//       // statement
//       if ( user.Password !== req.body.password ){
//         res.status(401).json({"message": "Thông tin đăng nhập không đúng.","status_code": 401});
//       }else{
//         const accessToken = jwt.sign(
//           { id: user._id,role: user.Role },PRIVATE_KEY,{ expiresIn: "12h" });
//         res.status(200).json({ accessToken,role: user.Role,username: user.Username });
//       }
//     }else{
//       res.status(401).json({"message": "Thông tin đăng nhập không đúng.","status_code": 401});
//     }
//   }
//   catch(e){
//     console.log(e)
//     res.status(500).json(e);
//   }
// });

module.exports = router;
