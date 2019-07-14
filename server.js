'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const bodyParser = require('body-parser')
var cors = require('cors');
const { URL } = require('url');
const dns = require('dns');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
console.log(process.env.MONGO_URI)
// mongoose.connect(process.env.MONGO_URI, { useMongoClient: true });

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.post("/api/shorturl/new",function(req,res){
  const longUrl = new URL(req.body.url);

  dns.lookup(longUrl.hostname,function(err,address, family){
    if (err){
      console.log(err)
      res.json({"error":"invalid URL"});
    }else{
      res.json({"fj":req.body.url})
    }
  })
  
})

app.get("api/shorturl/:new_url",function(req,res){
  
})


app.listen(port, function () {
  console.log('Node.js listening ...');
});