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
        $unwind: {
          path: "$Service",
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
// get booking by id
router.get("/getBookingById/:id", async (req, res) => {
  try {
    const data = await Booking.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id),
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
          path: "$Service",
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
        $unwind: {
          path: "$StyleList",
        },
      },
      {
        $lookup: {
          from: "logins",
          localField: "Id_Customer",
          foreignField: "_id",
          as: "Customer",
        },
      },
      {
        $unwind: {
          path: "$Customer",
        },
      },
      {
        $project: {
          __v: 0,
          Id_Service: 0,
          Id_Style_List: 0,
          Id_Customer: 0,
          "Service.__v": 0,
          "Service._id": 0,
          "Service.createdAt": 0,
          "Service.updatedAt": 0,
          "Service.Images": 0,
          "Service.Describe": 0,
          "StyleList.Password": 0,
          "StyleList.__v": 0,
          "StyleList._id": 0,
          "StyleList.Role": 0,
          "StyleList.Email": 0,
          "StyleList.Phone": 0,
          "StyleList.Username": 0,
          "StyleList.createdAt": 0,
          "StyleList.updatedAt": 0,
          "Customer.Password": 0,
          "Customer.__v": 0,
          "Customer._id": 0,
          "Customer.Role": 0,
          "Customer.Email": 0,
          "Customer.Username": 0,
          "Customer.createdAt": 0,
          "Customer.updatedAt": 0,
        },
      },
    ]);
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(400).json(err);
  }
});
// get booking by style list
router.get("/getBookingByStyleList",authJwt.verifyToken, async (req, res) => {
  try {
    const data = await Booking.find({ Id_Style_List: req.userId }).populate("Id_Service","Name").populate("Id_Customer",{Full_Name:1,Phone:1}).sort({ BookedDate: -1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});



module.exports = router;
