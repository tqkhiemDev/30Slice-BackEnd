const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Price: { type: Number, required: true },
    Saled: { type: Number },
    Id_Categories: { type: String, required: true },
    Descibe: { type: String },
    Images: { type: Array, required: true },
    InStock: { type: Number, required: true },
    Is_Show: { type: Boolean, default: true },
    Views: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("product", ProductSchema);
