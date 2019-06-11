var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NewsSchema = new Schema({
  title: String,
  link: String,
  description: String,
  img: String,
  note:{
    type: Schema.Types.ObjectId,
    ref: "Notes"
  }
});

// This creates our model from the above schema, using mongoose's model method
var News = mongoose.model("News", NewsSchema);

// Export the Note model
module.exports = News;
