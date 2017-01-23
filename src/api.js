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
    var newPoll = req.body;
    
    //prevent overwriting an existing poll
    delete newPoll._id
    
    //If the choices were passed as a string seperate them
    if(typeof(newPoll.options) == "string"){
        var options = newPoll.options.split(/\s*\n\s*/);
        newPoll.options = []
        for(var i in options){
            if(options[i]){
                newPoll.options.push({option:options[i], votes:0, voters:[]})
            }
        }
    }
    
    db_polls.insert(newPoll, function(err, insertedPoll){
        res.status(201);
        res.json({newPoll, err, insertedPoll});
        
    })
})

app.patch("/poll/:id", function(req, res, next){
    
})






return app;
}
