module.exports = function(db_polls, db_users){
    
//Set up express  
var express = require('express')
var app = express()

//Attach body parsing middleware
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/polls", function(req, res, next){
    db_polls.find({}, {title: 1}, function(err, docs){
        if(!err){
            res.json(docs)
        } else {
            res.setStatus(500)
            res.json(err)
        }
    })
})

app.get(["/poll", "/poll/:id"], function(req, res, next){
    var query = {}
    query._id = req.params.id || req.query.id;
    db_polls.findOne(query, function(err, poll){
        if(!err){
            res.json(poll);
        } else {
            res.status(500)
            res.json(err)
        }
    })
})

app.post('/poll', function(req, res, next){
    var newPoll = {};
    
    //
    if(req.body.title == undefined){
        throw new Error("'title' Not Provided")
    }
    newPoll.title = req.body.title;
    
    
    if(req.body.author == undefined){
        throw new Error("'author' Not Provided")
    }
    newPoll.author = req.body.author;
    
    //If the choices were passed as a string seperate them
    if(typeof(req.body.options) == "string"){
        var options = req.body.options.split(/\s*\n\s*/);
        newPoll.options = []
        for(var i in options){
            if(options[i]){
                newPoll.options.push({option:options[i], votes:0, voters:[]})
            }
        }
    }else if (typeof(req.body.options) == "array") {
        newPoll.options = req.body.options
    } else {
        throw new Error("No valid options provided for poll")
    }
    
    db_polls.insert(newPoll, function(err, insertedPoll){
        res.status(201);
        res.json(insertedPoll);
        
    })
})

app.patch("/poll/:id", function(req, res, next){
    
})






return app;
}
