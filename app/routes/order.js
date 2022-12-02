const router = require("express").Router();
const Order = require("../models/Order");
const querystring = require("qs");
const crypto = require("crypto");
const dateFormat = require("dateformat");
const mongoose = require("mongoose");
const { authJwt } = require("../middlewares/auth");

function sortObject(obj) {
  var sorted = {};
  var str = [];
  var key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
//get all
router.get("/getAllOrders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/getOneOrder/:id", async (req, res) => {
  try {
    const order = await Order.aggregate([
      {
        $lookup: {
          from: "logins",
          localField: "Id_Customer",
          foreignField: "_id",
          as: "Info",
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
        },
      },
      {
        $unwind: {
          path: "$Info",
        },
      },
      {
        $project: {
          IsCustomer_Delete: 0,
          IsAdmin_Delete: 0,
          __v: 0,
          "Info.Password": 0,
          "Info.__v": 0,
          "Info.createdAt": 0,
          "Info.updatedAt": 0,
        },
      },
    ]);
    res.status(200).json(order[0]);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get by customer
router.get("/getOrdersByCustomer", authJwt.verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({
      Id_Customer: req.userId,
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
    await Order.findOneAndUpdate({ _id: req.body._id }, { Status: "huy" });
    res.status(200).json("Update thành công");
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/orderVnpay", async (req, res, next) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    var ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    // console.log(ipAddr);

    var tmnCode = process.env.vnp_TmnCode;
    var secretKey = process.env.vnp_HashSecret;
    var vnpUrl = process.env.vnp_Url;
    var returnUrl = process.env.vnp_ReturnUrl;
    var date = new Date();

    var createDate = dateFormat(date, "yyyymmddHHmmss");
    var orderId = savedOrder._id;

    var vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = tmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toán đơn hàng 30Slice " + orderId;
    vnp_Params["vnp_OrderType"] = "billpayment";
    vnp_Params["vnp_Amount"] = savedOrder.Amount * 100;
    vnp_Params["vnp_ReturnUrl"] = returnUrl;
    vnp_Params["vnp_IpAddr"] = ipAddr;
    vnp_Params["vnp_CreateDate"] = createDate;

    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    res.status(200).redirect(vnpUrl);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
