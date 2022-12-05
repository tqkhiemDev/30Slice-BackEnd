const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    Id_Service: { type: mongoose.Types.ObjectId, ref: 'service' },
    Id_Style_List: { type: mongoose.Types.ObjectId, ref: 'style_list' },
    Id_Customer: { type: mongoose.Types.ObjectId, ref: 'login' },
    BookedTime: { type: String, required: true },
    BookedDate: { type: String, required: true },
    Note: { type: String, default: null },
    Status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('booking', BookingSchema);
