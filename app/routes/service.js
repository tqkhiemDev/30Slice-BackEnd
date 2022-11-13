const Service = require('../models/Service');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');
const router = require('express').Router();

//get all service
router.get('/getAllServices', async (req, res) => {
  try {
    const getservices = await Service.find();
    res.status(200).json(getservices);
  } catch (err) {
    res.status(400).json(err);
  }
});
// add new service
router.post('/addService',verifyTokenAndAdmin, async (req, res) => {
  const newService = new Service(req.body);
  try {
    const savedService = await newService.save();
    res.status(200).json(savedService);
  } catch (err) {
    res.status(400).json(err);
  }
});
// delete service
router.delete('/deleteService/',verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.body._id);
    res
      .status(200)
      .json({ message: 'Xoá Dịch Vụ Thành Công!', status_code: 200 });
  } catch (err) {
    res.status(400).json(err);
  }
});
// update service
router.put('/updateService/',verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.req.body._id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedService);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
