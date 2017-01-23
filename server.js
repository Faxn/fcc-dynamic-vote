'use strict';

var express = require('express')
var app = express()


//Set up databases
var nedb = require('nedb')
var db_loc = process.env.DB_LOC || 'data';
var db_polls = new nedb({filename: db_loc+'/polls.json', autoload:true})
var db_users = new nedb({filename: db_loc+'/users.json', autoload:true})


var multiPage = require('./src/multiPage/app.js')(db_polls, db_users)
app.use("/multiPage", multiPage);


var api = require('./src/api.js')(db_polls, db_users)
app.use("/api", api)

var port;
port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('App listening on port: '+port)
})


module.exports = app; //Required for testing
