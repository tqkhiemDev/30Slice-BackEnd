const mongoose = require("mongoose");

const ServicesSchema = new mongoose.Schema(
    {
        Name: { type: String, required: true },
        Price: { type: Number, required: true },
        Describe: { type: String, required: true },
        Images: { type: String, required: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("service", ServicesSchema);