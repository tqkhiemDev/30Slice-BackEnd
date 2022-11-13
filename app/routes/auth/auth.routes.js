const express = require('express');
const router = express.Router();
const verifySignUp = require('../../middlewares/auth/verifySignUp');
const loginLimiter = require('../../middlewares/auth/loginLimiter');
const controller = require('../../controllers/auth/auth.controller');

router
  .route('/signup')
  .post(
    [verifySignUp.checkDuplicateInfo, verifySignUp.checkRolesExisted],
    controller.signup
  );
router.route('/signin').post(loginLimiter, controller.signin);
router.route('/refreshtoken').post(controller.refreshToken);

module.exports = router;
