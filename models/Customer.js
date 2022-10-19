const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
    {
        Id_User: { type: String, required: true, unique: true },
        History: { type: Array },
        Style_List_Favorite: { type: String },
        Schedule: { type: String },
        Block_By_Admin: { type: Number, required: true, default: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("customer", CustomerSchema);