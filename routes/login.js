const Login = require("../models/Login");
const Style_List = require("../models/Style_List");
const Customer = require("../models/Customer");


const router = require("express").Router();
const jwt = require("jsonwebtoken");
const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.post("/login", async (req, res) => {
  try {
    const user = await Login.findOne({ username: req.body.username });
    if (user) {
      // statement
      if (user.Password !== req.body.password) {
        res.status(401).json({ "message": "Thông tin đăng nhập không đúng.", "status_code": 401 });
      } else {
        const accessToken = jwt.sign(
          { id: user._id, role: user.role }, PRIVATE_KEY, { expiresIn: "2h" });
        res.status(200).json({ accessToken, role: user.Role, username: user.Username });
      }
    } else {
      res.status(401).json({ "message": "Thông tin đăng nhập không đúng.", "status_code": 401 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// register by admin
router.post("/register", async (req, res) => {
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
      case "styleList":

        const newStyle_List = new Style_List({
          Id_User: user._id,
          Shifts: [],
        });
        const style_list = await newStyle_List.save();

        break;
      case "writer":

        break;
      default:
    }

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json(err);
  }
});
// customer register
router.post("/register/customer", async (req, res) => {
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
    });
    const customer = await newCustomer.save();
    let respon = {
      Id_User: user._id,
      Full_Name: user.Full_Name,
      Phone: user.Phone,
      Role: user.Role,
    }
    res.status(200).json(respon);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;