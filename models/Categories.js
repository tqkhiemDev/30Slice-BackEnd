const mongoose = require("mongoose");

const CategoriesSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rank: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("categories", CategoriesSchema);