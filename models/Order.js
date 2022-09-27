
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        name:{
          type: String
        },
        price:{
          type: Number
        },
        images:{
          type: String
        }
      },
    ],
    amount: { type: Number, required: true },
    note: { type: String, default: "" },
    status: { type: String, default: "pending" },


  },
  { timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema);