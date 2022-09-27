const mongoose = require("mongoose");

const ProductsSchema = new mongoose.Schema(
  {
    id_cat: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    price_sale: { type: Number, required: true },
    images: { type: String, required: true },
    describe: { type: String, required: true },
    hide: { type: Number, required: true },
    view: { type: Number, required: true },
    date: { type: Number, required: true },


  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductsSchema);