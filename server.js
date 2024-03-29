const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const MongoClient = require("mongodb").MongoClient;
const { request } = require("express");
require('dotenv').config();
const PORT = 3000;
const MONGO_DB_CONNECTION = process.env.MONGODB_KEY;

app.set("view engine", "ejs");
app.use(express.static('public'));
MongoClient.connect(MONGO_DB_CONNECTION, {useUnifiedTopology: true})
    .then(client => {
        console.log('Connection to database established...')
        const db = client.db("motivatorMaker");
        const quoteCollection = db.collection("motivate");
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json())
        app.get("/", (req,res)=>{
            db.collection("motivate").find().toArray()
            .then(data=> {
                res.render("index.ejs", {quotes: data});
            })
            .catch (err=> {
                res.status(400).send("<h1>400: Page Not Found</h1>")
                console.log(`400 Error: ${err}`)
            })
            // res.sendFile(`${__dirname}/index.html`)
        });
        app.post("/motivate", (req,res)=>{
            let quote = req.body;
            quoteCollection.insertOne(quote)
            .then(data=> {
                console.log(`Data: ${data}`)
                res.redirect("/");
            })
            .catch(err=> console.log(`POST Error: ${err}`))
        });
        app.put("/update", (req,res)=>{
            quoteCollection.findOneAndUpdate(
                { quoteBox: req.body.oldQuote },
                {
                    $set: {
                      quoteBox: req.body.newQuote,
                    }
                  },
                  {
                      upsert: true
                  }
              )
                .then(result => {
                    console.log(result)
                    res.redirect("/")
                })
                .catch(error => console.error(error))
        })
        app.delete("/delete", (req,res)=>{
            quoteCollection.deleteOne(
               {quoteBox: req.body.quote}
            )
            .then(result=> {
                res.json(`Deleted ${req.body.quote}`)
            })
            .catch(err=> console.log(`Error with delete on Server-side: ${err}`))
        })
        app.listen(process.env.PORT || PORT, ()=>{
            console.log(`Listening on port: ${PORT}`);
        });
    })
    .catch(err=> console.log(`Error: ${err}`));






