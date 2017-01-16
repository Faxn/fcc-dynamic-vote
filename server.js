'use strict';

var express = require('express')
var app = express()
var nedb = require('nedb')
var bodyParser = require('body-parser')


//app.set('view engine', 'hbs');
var hbs = require('hbs')
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);
hbs.registerPartials(process.cwd() + '/views/' );


var db_polls = new nedb({filename: 'data/polls.json', autoload:true})
var db_users = new nedb({filename: 'data/users.json', autoload:true})

//Attach body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function (req, res, next){
    db_polls.find({}, function(err, polls){
        res.render('index', {polls});
    })
    
})

app.get('/new-poll', function(req, res, next){
    res.render('new-poll')
})

app.post('/new-poll', function(req, res, next){
    var newPoll = req.body;
    var options = newPoll.options.split(/\s*\n\s*/);
    newPoll.options = {}
    for(var i in options){
        if(options[i]){
            newPoll.options[options[i]] = {option:options[i], votes:0}
        }
    }
    db_polls.insert(newPoll, function(err, insertedPoll){
        res.json({newPoll, err, insertedPoll});
    })
    
})

app.get('/poll/:id', function(req, res, next){
    db_polls.find({title:req.params.id}, function(err, poll){
        if(err){
            res.setStatus(500)
            res.json(err)            
        } else if (poll.length == 0){
            res.sendStatus(404)
        } else {
            res.render('poll', poll[0])
        }
    })  
});

app.post('/poll/:id', function(req, res, next){
    db_polls.find({title:req.params.id}, function(err, poll){
        if(err){
            res.status(500)
            res.json(err)            
        } else if (poll.length == 0){
            res.sendStatus(404)
        } else {
            poll = poll[0]
            poll.options[req.body.option].votes++
            db_polls.update({_id:poll._id}, poll, {}, function(err){
                if(err){
                    res.status(500)
                    res.json(err)
                } else {
                    res.append('Refresh', "0; " + req.originalUrl);
                    res.status(200)
                    res.send()
                }
            })
        }
    })
})


var port;
port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('App listening on port: '+port)
})
