const Booking = require("../models/Booking");
const Login = require("../models/Login");
const Customer = require("../models/Customer");
const router = require("express").Router();
const mongoose = require("mongoose");
const { authJwt } = require("../middlewares/auth");

// add bookings to the database
router.post("/", async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    res.status(400).json(err);
  }
});
// get booking where bookedDate
router.get("/getBookingByDate", async (req, res) => {
  try {
    const data = await Booking.find({ BookedDate: req.query.bookedDate });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});
// get history customer booking using aggregate
router.get("/getHistoryBooking", authJwt.verifyToken, async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $match: {
          Id_Customer: new mongoose.Types.ObjectId(req.userId),
        },
      },
      {
        $lookup: {
          from: "logins",
          localField: "Id_Style_List",
          foreignField: "_id",
          as: "StyleList",
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "Id_Service",
          foreignField: "_id",
          as: "Service",
        },
      },
      {
        $unwind: {
          path: "$StyleList",
        },
      },
      {
        $project: {
          Id_Style_List: 0,
          __v: 0,
          Id_Customer: 0,
          Id_Service: 0,
          "StyleList.Password": 0,
          "StyleList.__v": 0,
          "StyleList._id": 0,
          "StyleList.Role": 0,
          "StyleList.Email": 0,
          "StyleList.Phone": 0,
          "StyleList.Username": 0,
          "StyleList.createdAt": 0,
          "StyleList.updatedAt": 0,
          "Service.__v": 0,
          "Service._id": 0,
          "Service.createdAt": 0,
          "Service.updatedAt": 0,
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
