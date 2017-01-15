express = require('express')
app = express()
nedb = require('nedb')
bodyParser = require('body-parser')


//app.set('view engine', 'hbs');
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);


db_polls = new nedb({filename: 'data/polls.json', autoload:true})
db_users = new nedb({filename: 'data/users.json', autoload:true})

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
    newPoll = req.body;
    options = newPoll.options.split(/\s*\n\s*/);
    newPoll.options = {}
    for(i in options){
        newPoll.options[options[i]] = {option:options[i], votes:0}
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
            console.log(poll)
            console.log(req.body)
            poll.options[req.body.option].votes++
            db_polls.update({_id:poll._id}, poll, {}, function(err){
                res.status(200)
                res.json({err})
            })
        }
    })
})


var port;
port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('Example app listening on port: '+port)
})
