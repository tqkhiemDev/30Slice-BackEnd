const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;

db.user = require('../Login');
db.refreshToken = require('./refreshToken.model');
db.ROLES = ['admin', 'styleList', 'customer', 'writer'];

module.exports = db;
