const Categories = require("../models/Categories");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const { authJwt } = require("../middlewares/auth");

const router = require("express").Router();

//show
router.get("/getAllCategories", async (req, res) => {
  try {
    const categories = await Categories.find().sort({ Ordinal: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
});
// get all categories where Is_Show is true
router.get("/getCategories", async (req, res) => {
  try {
    const categories = await Categories.find({ Is_Show: true }).sort({ Ordinal: 1 });;
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
});

//show 1
router.get("/getOneCategory/:id", async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

//them
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
  const newCategories = new Categories(req.body);
  try {
    const savedCategories = await newCategories.save();
    res.status(201).json({ message: "Đã thêm loại thành công !" });
  } catch (err) {
    if (err.code == 11000) {
      res.status(200).json({
        message: `${Object.keys(err.keyValue)[0]} ${
          Object.values(err.keyValue)[0]
        } đã tồn tại!`,
      });
    } else {
      res.status(500).json(err);
    }
  }
});

//sua
router.put("/", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
  try {
    const updatedCategory = await Categories.findByIdAndUpdate(
      req.body._id,
      { $set: req.body },
      { new: true }
    );
    res.status(201).json({ message: "Đã sửa loại thành công !" });
  } catch (err) {
    if (err.code == 11000) {
      res.status(200).json({
        message: `${Object.keys(err.keyValue)[0]} ${
          Object.values(err.keyValue)[0]
        } đã tồn tại!`,
      });
    } else {
      res.status(500).json(err);
    }
  }
});
// delte category
router.delete("/", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
  try {
    await Categories.findByIdAndDelete(req.query.id);
    res.status(200).json("Đã xoá thành công!");
  } catch (err) {
    res.status(400).json(err);
  }
});

// get all categories where parent is !null
router.get("/getCategoriesParent", async (req, res) => {
  try {
    const categories = await Categories.find({ Parent_Id: null }).sort({ Ordinal: -1 });;
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
