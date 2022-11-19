const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    Id_Writer: { type: mongoose.Schema.Types.ObjectId, ref: 'login' },
    image: { type: String, require: true },
    Title: { type: String, require: true },
    Desc : {type : String, require : true},
    Ordinal: { type: Number, unique: true },
    Is_Hot : {type : Boolean ,  default : false},
    Content: { type: String, required: true },
    Create_By: { type: String, required: true },
    Is_Show: { type: Boolean, default: true },
    Views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('news', NewsSchema);
