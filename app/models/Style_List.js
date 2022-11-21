const mongoose = require('mongoose');

const Style_ListSchema = new mongoose.Schema(
  {
    Id_User: { type: mongoose.Schema.Types.ObjectId, ref: 'login' },
    Shifts: { type: Array, required: true },
    Status_Code: { type: Boolean,  default: true },
    Status: { type: String, required: true, default: 'active' },
    Block_By_Admin: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('style_list', Style_ListSchema);
