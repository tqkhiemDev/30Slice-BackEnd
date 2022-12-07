const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema(
  {
    Username: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Images : { type: String, default: 'https://30slice.com/assets/images/user.png' },
    Full_Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Phone: { type: String, required: true, unique: true },
    Role: { type: String, default: 'customer' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('login', LoginSchema);
