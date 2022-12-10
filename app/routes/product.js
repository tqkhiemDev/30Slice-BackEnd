const Product = require("../models/Product");
const { authJwt } = require("../middlewares/auth");

const router = require("express").Router();

//them
router.post("/", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

//sua
router.put("/", [authJwt.verifyToken, authJwt.isAdmin], async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.body._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

//toggle isShow
router.put(
  "/changeHideOrShow",
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    try {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: req.body._id },
        { Is_Show: req.body.Is_Show }
      );
      res.status(200).json("change success!!");
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//show
router.get(
  "/getAllProducts",
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    try {
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .populate("Id_Categories", "Name");
      res.status(200).json(products);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//show by category by page and limit
router.get("/getProductsByCategory", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const Id_Categories = req.query.id;
  try {
    const products = await Product.find({
      Id_Categories: Id_Categories,
      Is_Show: true,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit * 1)
      .populate("Id_Categories", "Name");
    const totalItem = await Product.countDocuments({
      Id_Categories: Id_Categories,
    });
    const totalPage = Math.ceil(totalItem / limit);
    res.status(200).json({ totalItem, totalPage, products });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/getProductsByCategory/:id", async (req, res) => {
  const Id_Categories = req.params.id;
  try {
    const products = await Product.find({
      Id_Categories: Id_Categories,
      Is_Show: true,
    })
      .sort({ createdAt: -1 })
      .populate("Id_Categories", "Name");

    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
});

// get one product and get views +1
router.get("/getOneProduct/:id", async (req, res) => {
  const Id_Product = req.params.id;
  try {
    const products = await Product.findById(Id_Product).populate(
      "Id_Categories",
      "Name"
    );
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: Id_Product },
      { Views: products.Views + 1 }
    );
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json(err);
  }
});

// get product by page and limit and return total page
router.get("/getProducts", async (req, res) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const name = decodeURI(req.query.search);
  try {
    if (name) {
      const products = await Product.find({
        Name: { $regex: name, $options: "i" },
        Is_Show: true,
      })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit * 1);
      const totalItem = await Product.countDocuments({
        Name: { $regex: name, $options: "i" },
      });
      const totalPage = Math.ceil(totalItem / limit);
      res.status(200).json({ totalItem, totalPage, products });
    } else {
      const totalItem = await Product.countDocuments();
      const totalPage = Math.ceil(totalItem / limit);
      const products = await Product.find({ Is_Show: true })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit * 1);
      res.status(200).json({ totalItem, totalPage, products });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});
// get product by page and limit and return total page by admin
router.get(
  "/getAllProductsByPage",
  [authJwt.verifyToken, authJwt.isAdmin],
  async (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const name = decodeURI(req.query.search);
    try {
      if (name) {
        const products = await Product.find({
          Name: { $regex: name, $options: "i" },
        })
          .populate("Id_Categories", "Name")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit * 1);
        const totalItem = await Product.countDocuments({
          Name: { $regex: name, $options: "i" },
        });
        const totalPage = Math.ceil(totalItem / limit);
        res.status(200).json({ totalItem, totalPage, products });
      } else {
        const totalItem = await Product.countDocuments();
        const totalPage = Math.ceil(totalItem / limit);
        const products = await Product.find()
          .populate("Id_Categories", "Name")
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit * 1);
        res.status(200).json({ totalItem, totalPage, products });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  }
);
router.delete("/", async (req, res) => {
  try {
    await Product.findByIdAndDelete({ _id: req.body._id });
    res.status(200).json("delete success!!");
  } catch (err) {
    res.status(400).json(err);
  }
});
router.get("/getProductsHome", async (req, res) => {
  try {
    const productsNew = await Product.find({ Is_Show: true })
      .sort({ createdAt: -1 })
      .limit(12);
      const productHot = await Product.find({ Is_Show: true, Is_Hot: true })
      .sort({ createdAt: -1 })
      .limit(12);
    res.status(200).json({productsNew, productHot});
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
