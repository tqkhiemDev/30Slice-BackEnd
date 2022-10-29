const Order = require("../models/Order");

const router = require("express").Router();

//get all
router.get("/getAllOrders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get by customer
router.get("/getOrdersByCustomer", async (req, res) => {
  try {
    const orders = await Order.find({
      Id_Customer: req.body._id,
    });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
});

//add
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(400).json(err);
  }
});

//customer hidden
router.put("DeleteOrderByUser", async (req, res) => {
  try {
    await Order.findOneAndUpdate(
      { _id: req.body._id },
      { IsCustomer_Delete: true }
    );
    res.status(200).json("Update thành công");
  } catch (err) {
    res.status(400).json(err);
  }
});

//admin hidden
router.put("DeleteOrderByAdmin", async (req, res) => {
    try {
      await Order.findOneAndUpdate(
        { _id: req.body._id },
        { IsAdmin_Delete: true }
      );
      res.status(200).json("Update thành công");
    } catch (err) {
      res.status(400).json(err);
    }
});

//cancel order
router.put("CancelOrderByUser", async (req, res) => {
    try {
      await Order.findOneAndUpdate(
        { _id: req.body._id },
        { Status: "huy" }
      );
      res.status(200).json("Update thành công");
    } catch (err) {
      res.status(400).json(err);
    }
});
module.exports = router;
