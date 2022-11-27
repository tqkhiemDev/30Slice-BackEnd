const express = require('express');
const router = express.Router();

const { authJwt } = require('../../middlewares/auth');
const verifySignUp = require('../../middlewares/auth/verifySignUp');
const controller = require('../../controllers/admin/userMngt.controller');

router
  .route('/getUsers')
  .get([authJwt.verifyToken, authJwt.isAdmin], controller.getUsers);
  
module.exports = router;
