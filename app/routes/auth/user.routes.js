const express = require('express');
const router = express.Router();

const { authJwt } = require('../../middlewares/auth');
const controller = require('../../controllers/auth/user.controller');

router.route('/all').get(controller.allAccess);
router.route('/customer').get(authJwt.verifyToken, controller.userBoard);
router
  .route('/admin')
  .get([authJwt.verifyToken, authJwt.isAdmin], controller.adminBoard);
router
  .route('/stylelist')
  .get([authJwt.verifyToken, authJwt.isStylelist], controller.stylelistBoard);

module.exports = router;
