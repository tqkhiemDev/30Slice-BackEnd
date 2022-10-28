const Booking = require('../models/Booking');

const router = require('express').Router();

// add bookings to the database
router.post('/', async (req, res) => {
  const newBooking = new Booking(req.body);
  try {
    const savedBooking = await newBooking.save();
    res.status(200).json(savedBooking);
  } catch (err) {
    res.status(400).json(err);
  }
});
// get booking where bookedDate
router.get('/getBookingByDate', async (req, res) => {
  try {
    const data = await Booking.find({ BookedDate: req.query.bookedDate });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
