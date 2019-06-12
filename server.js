const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 8080;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/cnewsDB", { useNewUrlParser: true });

// Routes

// A GET route for scraping the cnet website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.cnet.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    
    const DataSeed = [];
     $(".latestScrollItems").find("h3").each((i, elt)=>{
        let news = {}
        news.title = $(elt).children("a").text()
        news.link = $(elt).children("a").attr("href");
        news.description = $(elt).siblings("p").children("a").text();
        news.img = $(elt).parent().siblings("figure").find("img").attr("src");
        
        if(news) DataSeed.push(news);

    })
    if(DataSeed){
        db.Article.create(DataSeed)
        .then( dbArticles =>{
            res.json(dbArticles);
        }).catch(err =>{
            res.status(500).json({error: err.message});
        })
    }
    

  
  });
});

// Route for getting all articles from the db
app.get("/articles", function(req, res) {
  db.Article.find()
  .populate("notes")
  .then(function(dbArticles){
    res.json(dbArticles);
  }).catch(function(err){
    res.status(500).json({error: err.message});
  })
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id})
  .populate("notes")
  .then(function(dbResults){
    res.json(dbResults);
  }).catch(function(err){
    res.status(500).json({error: err.message});
  })
});

app.post("/saveArticle", function(req, res){
  console.log("req.body", req.body.saveArt);
  //5cffd5b3beb9e90fd021559d {_id:{$in:req.body.saveArt}}
  db.Article.find({_id:{$in:req.body.saveArt}})
  .populate("notes")
  .then(function(dbArticles){
    res.json(dbArticles);
  }).catch(function(err){
    res.status(500).json({error: err.message});
  })
})



app.get("/notes", function(req, res) {
  db.Notes.find()
  .then(function(dbNotes){
    res.json(dbNotes);
  }).catch(function(err){
    res.status(500).json({error: err.message});
  })
});


app.post("/notes/comments/:id", function(req, res){
  db.Notes.create(req.body)
  .then(function(dbNote){
    return db.Article.findOneAndUpdate({_id:req.params.id}, { $push: { notes: dbNote._id } }, {new: true} ).populate("Notes")
  }).then(function(dbArticle){
        res.json(dbArticle);
    })
})

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
