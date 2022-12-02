const router = require("express").Router();
const Order = require("../models/Order");
const querystring = require("qs");
const dateFormat = require("dateformat");
const mongoose = require("mongoose");
const { authJwt } = require("../middlewares/auth");
const CryptoJS = require("crypto-js");
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
    }).sort({ createdAt: -1 });
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
    let ipAddr =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    // console.log(ipAddr);

    let tmnCode = process.env.vnp_TmnCode;
    let secretKey = process.env.vnp_HashSecret;
    let vnpUrl = process.env.vnp_Url;
    let returnUrl = process.env.vnp_ReturnUrl;
    let date = new Date();

    let createDate = dateFormat(date, "yyyymmddHHmmss");
    let orderId = savedOrder._id;

    let vnp_Params = {};
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

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, secretKey);
    let hash = hmac.update(signData).finalize().toString(CryptoJS.enc.Hex);
    vnp_Params["vnp_SecureHash"] = hash;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    res.status(200).json(vnpUrl);
  } catch (err) {
    res.status(400).json(err);
  }
});
router.get("/vnpay_return", async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.vnp_HashSecret;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, secretKey);
    let signed = hmac.update(signData).finalize().toString(CryptoJS.enc.Hex);
    if (secureHash === signed) {
      let orderId = vnp_Params["vnp_TxnRef"];
      let rspCode = vnp_Params["vnp_ResponseCode"];
      console.log(orderId);
      const order = await Order.findByIdAndUpdate(orderId, {
        Payment_Status: "completed",
      });
      res
        .status(200)
        .redirect("http://localhost:3100/order-success?order_id=" + orderId);

      //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
      // res.status(200).json({ RspCode: "00", Message: "success" });
    } else {
      res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
