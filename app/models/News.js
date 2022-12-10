const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    
    image: { type: String, require: true },
    Title: { type: String, require: true },
    Desc : {type : String, require : true},
    Is_Hot : {type : Boolean ,  default : false},
    Content: { type: String, required: true }, 
    Create_By: {  type: mongoose.Schema.Types.ObjectId, ref: 'login'  },
    Is_Show: { type: Boolean, default: true },
    Views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('news', NewsSchema);
