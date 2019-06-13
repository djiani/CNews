var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: String,
  link: String,
  description: String,
  img: String,
  notes:[
    {
      type: Schema.Types.ObjectId,
      ref: "Notes"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Note model
module.exports = Article;
