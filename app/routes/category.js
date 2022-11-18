const Categories = require('../models/Categories');
const { verifyTokenAndAdmin }= require('../middlewares/verifyToken');
const { authJwt } = require('../middlewares/auth');

const router = require('express').Router();

//show
router.get('/getAllCategories', async (req, res) => {
  try {
    const categories = await Categories.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
});
// get all categories where Is_Show is true
router.get('/getCategories', async (req, res) => {
  try {
    const categories = await Categories.find({Is_Show: true});
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
});


//show 1
router.get('/getOneCategory/:id', async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
});

//them
router.post('/',verifyTokenAndAdmin, async (req, res) => {
  const newCategories = new Categories(req.body);
  try {
    const savedCategories = await newCategories.save();
    res.status(200).json(savedCategories);
  } catch (err) {
    res.status(400).json(err);
  }
});

//sua
router.put('/', [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
  try {
    const updatedCategory = await Categories.findByIdAndUpdate(
      req.body._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});

//toggle isShow
router.put('/changeHideOrShow',verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedCategory = await Categories.findOneAndUpdate(
      { _id: req.body._id },
      { Is_Show: req.body.Is_Show }
    );
    res.status(200).json('change success!!');
  } catch (err) {
    res.status(400).json(err);
  }
});
// get all categories where parent is !null
router.get('/getCategoriesParent', async (req, res) => {
  try {
    const categories = await Categories.find({ Parent_Id: null });
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
});



module.exports = router;
