const mongoose = require("mongoose");

const CombosSchema = new mongoose.Schema(
  {
    Arr_Id_Products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
    ],
    Name: { type: String, required: true },
    Ordinal: { type: Number, required: true, unique: true },
    Image: { type: String, required: true },
    Price: { type: Number, required: true },
    Saled: { type: Number, default: 0 },
    Discount: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Views: { type: Number, default: 0 },
    Is_Hot: { type: Number, default: 0 },
    Is_Show: { type: Boolean, default: true },
    InStock: { type: Number, required: true },
    Details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("combos", CombosSchema);
