const fs = require('fs');
const PRIVATE_KEY = fs.readFileSync('./private-key.txt');

module.exports = {
  secret: PRIVATE_KEY,
  // jwtExpiration: 3600,         // 1 hour
  // jwtRefreshExpiration: 86400, // 24 hours

  jwtExpiration: 30, // 30 second
  jwtRefreshExpiration: 120, // 120 second
};
