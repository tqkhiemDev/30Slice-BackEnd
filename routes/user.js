const Login = require('../models/Login');
const Customer = require('../models/Customer');
const router = require('express').Router();
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
// login by customer
router.post('/login', async (req, res) => {
  try {
    const user = await Login.findOne({ Phone: req.body.phone });
    if (user) {
      res
        .status(200)
        .json({
          Id_User: user._id,
          Full_Name: user.Full_Name,
          Phone: user.Phone,
        });
    } else {
      res
        .status(401)
        .json({ message: 'Số điện thoại này chưa đăng ký', status_code: 404 });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
