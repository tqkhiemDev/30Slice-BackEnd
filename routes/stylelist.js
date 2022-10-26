const Login = require("../models/Login");
const StyleList = require("../models/Style_List");
const Booking = require("../models/Booking");
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
        },
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
// add new shift to 1 stylelist
router.post("/addShift", async (req, res) => {
  try {
    const data = await StyleList.findByIdAndUpdate(req.body._id, {
      $push: {
        Shift: req.body.shift
      }
    }, { new: true })
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
})

// add new shift to shift array in stylelist not duplicate shift
router.post("/addShiftToStyleList", async (req, res) => {
  try {
    const data = await StyleList.findByIdAndUpdate(req.body._id, {
      $addToSet: {
        Shifts: {
          $each: req.body.shift,
        }
      }
    }, { new: true })
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
})

const getAvailableEmployee = (bookedDate, bookedTime) => {
  if (!arrBookedData[bookedDate]) {
    arrBookedData[bookedDate] = new Array(allAvailableTime.length).fill([])
  }
  const arrBookedEmployee = arrBookedData[bookedDate][bookedTime]
  return arrEmployee.filter(employee => {
    return arrBookedEmployee.findIndex(booking => {
      return booking.employee.employeeID === employee.employeeID
    }) === -1
  })
}
router.get('/getAvailableEmployee', async (req, res) => {
  const bookedDate = req.query.bookedDate
  try {
    const arrBooked = await Booking.find({ BookedDate: bookedDate });
    const arrStyle_lists = await Login.aggregate([
      {
        $lookup: {
          from: "style_lists",
          localField: "_id",
          foreignField: "Id_User",
          as: "Info"
        },
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
          "Info.Id_User": 0,
          "Info.createdAt": 0,
          "Info.updatedAt": 0,
        }
      }
    ])
   

    res.status(200).json({ arrBooked, arrStyle_lists });
  } catch (err) {
    res.status(400).json(err);
  }
})








module.exports = router;
