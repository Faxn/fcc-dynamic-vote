module.exports = function (db_polls, db_users) {
    
var express = require('express')
var app = express()

//Set up templating View engine
var hbs = require('hbs')
app.set('view engine', 'html');
app.set('views', __dirname + '/views/');
app.engine('html', require('hbs').__express);
hbs.registerPartials(__dirname + '/views/' );

//Attach body parsing middleware
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res, next){
    db_polls.find({}, function(err, polls){
        res.render('index', {polls, baseUrl:req.baseUrl});
    })
    
})

app.get('/new-poll', function(req, res, next){
    res.render('new-poll', {baseUrl:req.baseUrl})
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
        
        res.append('Refresh', "0; " + req.baseUrl + "poll/" + insertedPoll.title);
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
            var ctx = poll[0];
            ctx.baseUrl = req.baseUrl
            res.render('poll', ctx)
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
    
return app;

}
