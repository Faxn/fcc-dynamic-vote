express = require('express')
app = express()
nedb = require('nedb')
bodyParser = require('body-parser')

app.set('view engine', 'hbs');

db_polls = new nedb({filename: 'data/polls', autoload:true})
db_users = new nedb({filename: 'data/users', autoload:true})

//Attach body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Mockup data. Delete eventualy
polls = [
    { name:'who was the murderer'},
    { name:'best character'}
]

poll = {
    options : [
                {option:'Mr pink', votes: 1},
                {option:'The sun', votes: 6},
                {option:'Bartlby', votes: 20}
              ],
    voters : []
}


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
    newPoll.options = newPoll.options.split('\n');
    db_polls.insert(newPoll, function(err, insertedPoll){
        res.json({newPoll, err, insertedPoll});
    })
    
})

app.get('/poll/:id', function(req, res, next){
    db_polls.find({title:req.params.id}, function(err, poll){
        if(!err){
            console.log(poll)
            res.render('poll', poll[0])
        } else {
            res.json(err)            
        }
    })  
});


var port;
port = process.env.PORT || 8080
app.listen(port, function () {
  console.log('Example app listening on port: '+port)
})
