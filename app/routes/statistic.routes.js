const express = require('express');
const router = express.Router();

const { authJwt } = require('../middlewares/auth');

const statisticController = require('../controllers/admin/statistic.controller');

router.get(
  '/getTotalOrderByMonth',
  [authJwt.verifyToken, authJwt.isAdmin],
  statisticController.getTotalOrderByMonth
);

router.get(
  '/getTotalProduct',
  [authJwt.verifyToken, authJwt.isAdmin],
  statisticController.getTotalProduct
);

router.get(
  '/getTotalOrder',
  [authJwt.verifyToken, authJwt.isAdmin],
  statisticController.getTotalOrder
);

router.get(
  '/getTotalCustomer',
  [authJwt.verifyToken, authJwt.isAdmin],
  statisticController.getTotalCustomer
);

router.get(
  '/getTotalStylist',
  [authJwt.verifyToken, authJwt.isAdmin],
  statisticController.getTotalStylist
);

router.get(
  '/getTotalBooking',
  [authJwt.verifyToken, authJwt.isAdmin],
  statisticController.getTotalBooking
);

router.get(
  '/getAllOrders',
  // [authJwt.verifyToken, authJwt.isAdmin],
  statisticController.getAllOrders
);

module.exports = router;
