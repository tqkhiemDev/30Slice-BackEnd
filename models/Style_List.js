const mongoose = require("mongoose");

const Style_ListSchema = new mongoose.Schema(
    {
        Id_User: { type: String, required: true, unique: true },
        Shifts: [
            {
                Time_shift: {
                    type: String,
                }
            }
        ],
        Status_Code: { type: Number, required: true, default: 0 },
        Status: { type: String, required: true, default: "active" },
        Block_By_Admin: { type: Number, required: true, default: 1 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("style_list", Style_ListSchema);