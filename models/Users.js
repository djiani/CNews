var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UsersSchema = new Schema({
  name: {
    type: String,
    required:true,
  },
  email: {
    type: String,
    required:true,
  },
  password: {
    type: String,
    required:true,
  },
  notes:[
    {
      type: Schema.Types.ObjectId,
      ref: "Notes"
    }
  ],
  articles:[
    {
      type: Schema.Types.ObjectId,
      ref: "Article"
    }
  ]
});

// This creates our model from the above schema, using mongoose's model method
var Users = mongoose.model("Users", UsersSchema);

// Export the Note model
module.exports = Users;