const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    Id_User: { type: mongoose.Schema.Types.ObjectId, ref: "login" },
    History: { type: Array },
    Style_List_Favorite: { type: String, default: null },
    Schedule: { type: String, default: null },
    isSignUp: { type: Boolean, default: false },
    Block_By_Admin: { type: Number, required: true, default: 1 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("customer", CustomerSchema);
