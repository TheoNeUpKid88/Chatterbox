/* ============================================================================
 |   Author: Ramon J Yniguez AkA TheoNeUpKID
 |   Purpose: Setup Chat Message Controller & connet to DB and insert data
 |   Technolog: MongoDB (Nodejs ~ Mongoosejs)
 |   URL: https://docs.mongodb.com/manual/
=========================================================================== */ 

"use strict"
const config = require('./config/config'),
      mongoose = require('mongoose'),
      MongoClient = mongoose;
 
//==| Mongo (mongosejs) Connection & DB Collection \\
 MongoClient.connect(config.database_url +  config.database);
 var dbo = MongoClient.connection;

// Add Message to DB
  module.exports.AddMessages = (req, res, next)=>{

    // Validate request
    if(!req.body.text) {
      return res.status(400).send({
          message: "Message content could not be sent"
      });
    }
    let data = {text: req.body.text, from: req.body.from, date: Date.now};
    dbo.collection(config.database_collection).insertOne(data, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      dbo.close();
    }); 
  }

/*** START NOTE **: 
  | "callback" function required due to logging into DB is done asynchronously.
  |  If connection is closed "dbo.close()", attempting to reconnect would result underdfined err 
  |  or abrupt application behavior
  ** NOTE END ***/

// GET MOST recent message added to DB
  module.exports.getrecentMessages = (req, res, next) =>{ 
    dbo.collection(config.database_collection).findOne({}, function(err, result) {
      if (err) {throw err};      
      res.json(result)
      dbo.close();    
    });
  }
// GET ALL Messageas
  module.exports.getAllMessages = (req, res, next) =>{
    dbo.collection(config.database_collection).find({}).toArray(function(err, result) {
      if (err) {throw err};      
      res.json(result)
      dbo.close();    
    });
  }