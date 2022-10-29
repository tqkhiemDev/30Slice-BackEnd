const Login = require('../models/Login');
const StyleList = require('../models/Style_List');
const Booking = require('../models/Booking');
const router = require('express').Router();
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');


// join stylelist data with login data using lookup
router.get('/gettAllStyleList', async (req, res) => {
  try {
    const data = await Login.aggregate([
      {
        $lookup: {
          from: 'style_lists',
          localField: '_id',
          foreignField: 'Id_User',
          as: 'Info',
        },
      },
      {
        $match: {
          Role: 'styleList',
        },
      },
      {
        $unwind: '$Info',
      },
      {
        $project: {
          Password: 0,
          __v: 0,
          'Info.__v': 0,
          'Info.Id_User': 0,
          'Info.createdAt': 0,
          'Info.updatedAt': 0,
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

// add new shift to shift array in stylelist not duplicate shift
router.post('/addShiftToStyleList',verifyTokenAndAdmin, async (req, res) => {
  try {
    const data = await StyleList.findByIdAndUpdate(
      req.body._id,
      {
        $addToSet: {
          Shifts: {
            $each: req.body.shift,
          },
        },
      },
      { new: true }
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get('/getAvailableEmployee', async (req, res) => {
  const bookedDate = req.query.bookedDate;
  try {
    const arrBooked = await Booking.find({ BookedDate: bookedDate });
    const arrStylelist = await Login.aggregate([
      {
        $lookup: {
          from: 'style_lists',
          localField: '_id',
          foreignField: 'Id_User',
          as: 'Info',
        },
      },
      {
        $match: {
          Role: 'styleList',
        },
      },
      {
        $unwind: '$Info',
      },
      {
        $project: {
          Password: 0,
          __v: 0,
          'Info.__v': 0,
          'Info.Id_User': 0,
          'Info.createdAt': 0,
          'Info.updatedAt': 0,
        },
      },
    ]);
    if (arrBooked.length !== 0) {
      let bookedData = {};
      arrBooked.forEach((booking) => {
        if (!bookedData[booking.Id_Style_List])
          bookedData[booking.Id_Style_List] = {};
        bookedData[booking.Id_Style_List][booking.BookedTime] = true;
      });
      arrStylelist.forEach((stylelist) => {
        let _id = stylelist._id.toString();
        if (bookedData[_id])
          stylelist.Info.Shifts = stylelist.Info.Shifts.filter(
            (shift) => !bookedData[_id][shift]
          );
      });
    }
    res.status(200).json(arrStylelist);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
