const Login = require("../models/Login");
const Style_List = require("../models/Style_List");

const router = require("express").Router();
//634f733dc9ac9ab627096b20
//get All stylist
router.get("/getAllStyleList", async (req,res) => {
    try {
        const arrStyleList = await Style_List.find();
        const arrInfoUser = await Login.find();
        const arrInfoStyleList = arrInfoUser.filter(user => user.Role === "styleList");
        
        const data = arrStyleList.map(item => {
            const index = arrInfoStyleList.findIndex(ele => ele._id.toString() === item.Id_User);
           return {...item._doc,...arrInfoStyleList[index]._doc}
        })
        res.status(200).json(data);
      } catch (err) {
        res.status(400).json(err);
      }
})

module.exports = router;