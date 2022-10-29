const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        Id_Customer: { type: mongoose.Schema.Types.ObjectId, ref: 'customer' },
        Products: [
            {
                ProductId: {
                    type: mongoose.Schema.Types.ObjectId, ref: 'product'
                },
                Quantity: {
                    type: Number,
                    default: 1,
                },
                Name: {
                    type: String
                },
                Price: {
                    type: Number
                },
                Images: {
                    type: Array
                }
            },
        ],
        Status: { type: String, require: true },
        Receiver: { type: String },
        Address: { type: String, required: true },
        Phone: { type: String, required: true },
        Email: { type: String, required: true },
        Amount: { type: String, required: true },
        Payment_Method: { type: String },
        Payment_Status: { type: String },
        Admin_Note: { type: String },
        Customer_Note: { type: String },
        IsCustomer_Delete: { type: Boolean, default: false },
        IsAdmin_Delete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", OrderSchema);