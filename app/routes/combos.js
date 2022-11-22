const Combos = require('../models/Combos');

const router = require('express').Router();

// add bookings to the database
router.post('/', async (req, res) => {
  const newCombos = new Booking(req.body);
  try {
    const saveCombos = await newCombos.save();
    res.status(200).json(saveCombos);
  } catch (err) {
    res.status(400).json(err);
  }
});
// get combos for admin
router.get('/getAllCombos', async (req, res) => {
  try {
    const data = await Combos.find().sort({ Ordinal: 1 });
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
