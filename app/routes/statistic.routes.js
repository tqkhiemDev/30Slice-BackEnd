const express = require('express');
const router = express.Router();

const { authJwt } = require('../middlewares/auth');

const statisticController = require('../controllers/admin/statistic.controller');

router
  .route('/getTotalOrdersByMonth')
  .get(
    // [authJwt.verifyToken, authJwt.isAdmin],
    statisticController.getTotalOrdersByMonth
  );

module.exports = router;
