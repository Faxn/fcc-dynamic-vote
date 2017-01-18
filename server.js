'use strict';

var express = require('express')
var app = express()


//Set up databases
var nedb = require('nedb')
var db_polls = new nedb({filename: 'data/polls.json', autoload:true})
var db_users = new nedb({filename: 'data/users.json', autoload:true})


var multiPage = require('./apps/multiPage/app.js')(db_polls, db_users)

app.use("/multiPage", multiPage);


var port;
port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('App listening on port: '+port)
})
