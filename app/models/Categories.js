const mongoose = require('mongoose');

const CategoriesSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Ordinal: { type: Number, required: true, unique: true },
    Is_Show: { type: Boolean, required: true },
    Parent_Id: { type: String, default: null },
    isCatProducts: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('categories', CategoriesSchema);
