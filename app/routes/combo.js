const Combo = require("../models/Combo");

const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const newCombo = new Combo(req.body);
    const saved = newCombo.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/getAllCombo", async (req,res) =>{
    try {
        const combos = await Combo.find();
        res.status(200).json(combos);
      } catch (err) {
        res.status(400).json(err);
      }
})

router.get("/getOneCombo", async (req, res) => {
  try {
    const combo = await Combo.findById(req.body._id);
    res.status(200).json(combo);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/", async (req, res) => {
  try {
    await Combo.findByIdAndUpdate(
      req.body._id,
      { $set: req.body },
      { new: true }
    );
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
