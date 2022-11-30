const mongoose = require('mongoose');

const Style_ListSchema = new mongoose.Schema(
  {
    Id_User: { type: mongoose.Schema.Types.ObjectId, ref: 'login' },
    Shifts: { type: Array, required: true },
    Status_Code: { type: Boolean,  default: true },
    Block_By_Admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('style_list', Style_ListSchema);
