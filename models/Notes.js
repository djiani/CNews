var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
  comment: {
    type: String,
    required:true,
  },
  author: String,
  postDate: {
      type:Date,
      default:Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Notes = mongoose.model("Notes", NotesSchema);

// Export the Note model
module.exports = Notes;
