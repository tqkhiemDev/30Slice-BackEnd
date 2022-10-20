const Login = require("../models/Login");
const router = require("express").Router();


// join stylelist data with login data using lookup 
router.get("/gettAllStyleList", async (req, res) => {
  try {
    const data = await Login.aggregate([
      {
        $lookup: {
          from: "style_lists",
          localField: "_id",
          foreignField: "Id_User",
          as: "Info"
        }
      },
      {
        $match: {
          "Role": "styleList",
        }
      },
      {
        $unwind: "$Info"
      },
      {
        $project: {
          "Password": 0,
          "__v": 0,
          "Info.__v": 0,
          "Info._id": 0,
          "Info.Id_User": 0,
          "Info.createdAt": 0,
          "Info.updatedAt": 0,
        }
      }
    ])
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
})




module.exports = router;
