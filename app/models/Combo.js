const mongoose = require('mongoose');

const ComboSchema = new mongoose.Schema(
  {
    Name: { type: String, required: true },
    Saled: { type: Number, default: 0 },
    Id_Products: { type: Array, require : true },
    Ordinal: { type: Number }, 
    Image: { type: String, required: true },
    Is_Show: { type: Boolean, default: true },
    Views: { type: Number, default: 0 },
    Rating: { type: Number, default: 0 },
    Is_Hot: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('combo', ComboSchema);
