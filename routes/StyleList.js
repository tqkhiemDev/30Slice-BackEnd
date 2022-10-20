const Login = require("../models/Login");
const Style_List = require("../models/Style_List");

const router = require("express").Router();
//634f733dc9ac9ab627096b20
//get All stylist
router.get("/getAllStyleList", async (req, res) => {
  try {
    const arrStyleList = await Style_List.find();
    const arrInfoUser = await Login.find();
    const arrInfoStyleList = arrInfoUser.filter(user => user.Role === "styleList");

    const data = arrStyleList.map(item => {
      const index = arrInfoStyleList.findIndex(ele => ele._id.toString() === item.Id_User);
      return { ...item._doc, ...arrInfoStyleList[index]._doc }
    })
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
})


router.get("/", async (req, res) => {
  try {
    const arrStyleList = await Style_List.find();
    const arrInfoUser = await Login.find({ Role: "styleList" });

    const data = arrStyleList.map(item => {
      const index = arrInfoUser.findIndex(ele => ele._id.toString() === item.Id_User);
      return { ...item._doc, ...arrInfoUser[index]._doc }
    })
    const { Password, ...other } = data

    res.status(200).json(other);
  } catch (err) {
    res.status(400).json(err);
  }
})

// join stylelist data with login data using lookup
router.get("/lookup", async (req, res) => {
  try {

    const data = await Style_List.find().populate('Id_User').exec((err, docs) => {
      if (err) { throw err; }
      res.status(200).json(docs);
      
    });

  } catch (err) {
    res.status(400).json(err);
  }
});




module.exports = router;