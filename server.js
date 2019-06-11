var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
//var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
//mongoose.connect("mongodb://localhost/cnewsDB", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.cnet.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    
    const results = [];
    const latestStories = $(".latestScrollItems").find("h3").each((i, elt)=>{
        let result = {}
        result.title = $(elt).children("a").text()
        result.link = $(elt).children("a").attr("href");
        result.des = $(elt).siblings("p").children("a").text();
        result.img = $(elt).parent().siblings("figure").find("img").attr("src");
        results.push(result);
    })
    console.log(results);

  
  });
});

// // Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//   // TODO: Finish the route so it grabs all of the articles
//   db.Article.find()
//   .then(function(dbResults){
//     res.json(dbResults);
//   }).catch(function(err){
//     res.status(500).json({error: err.message});
//   })
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // TODO
//   // ====
//   // Finish the route so it finds one article using the req.params.id,
//   // and run the populate method with "note",
//   // then responds with the article with the note included
//   db.Article.findOne({_id: req.params.id})
//   .populate("note")
//   .then(function(dbResults){
//     res.json(dbResults);
//   }).catch(function(err){
//     res.status(500).json({error: err.message});
//   })
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // TODO
//   // ====
//   // save the new note that gets posted to the Notes collection
//   // then find an article from the req.params.id
//   // and update it's "note" property with the _id of the new note
//   db.Note.create(req.body)
//   .then(function(dbNote){
//    return db.Article.findOneAndUpdate({_id:req.params.id}, { $set: { note: dbNote._id } }, {new: true} )
    
//   }).then(function(dbArticle){
//     res.json(dbArticle);
//   })
  

// });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
