const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  Id_Customter: { type: mongoose.Schema.Types.ObjectId, ref: "login" },
  Id_Product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  Id_Combo: { type: mongoose.Schema.Types.ObjectId, ref: "combo" },
  Content: { type: String, require: true },
  Parent_Id: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model("comment", CommentSchema);