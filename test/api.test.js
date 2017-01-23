"use strict";

process.env.NODE_ENV = 'test';
const db_loc = 'data-test';


//Clean out the databases from the last run.
const fs = require('fs');
let files = fs.readdirSync(db_loc)
for (let i in files){
    console.log("clearing "+files[i])
    fs.unlinkSync('data-test/'+files[i]);
}

//Set up databases
var nedb = require('nedb')
var db_polls = new nedb({filename: db_loc+'/polls.json', autoload:true})
var db_users = new nedb({filename: db_loc+'/users.json', autoload:true})


//Set Up Chai
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

//include the app under test
const server = require('../src/api')(db_polls, db_users);


//Our example poll
var examplePoll = {
    title:"Test Poll 1",
    author: "mocha",
    options: ["small", "medium", "large"]
}


describe('Polls-Api', () => {
    
 /*
  * Test the /GET route
  */
  describe('GET /polls', () => {
      it('it should GET all the polls', (done) => {
        chai.request(server)
            .get('/polls')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
      });
  });
  describe('POST /poll', () => {
      
      //we want the id of the poll we inserted to get it later.
      let insertedId;
      
      it('Should accept a post request', (done) => {
          chai.request(server)
            .post('/poll')
            .send(examplePoll)
            .end((err, res) => {
                res.should.have.status(201)
                insertedId = res.body._id;
                done()
            })
      })
      
      
      it('There should be a poll in the database now', (done) => {
        chai.request(server)
            .get('/polls')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                
                done();
            });
      });
      
      it("should be the same poll we inserted", (done) => {
          chai.request(server)
            .get('/poll/'+insertedId)
            .end((err, res) => {
                res.should.have.status(200)
                res.body._id.should.be.eql(insertedId)
                res.body.title.should.be.eql(examplePoll.title)
                res.body.author.should.be.eql(examplePoll.author)
                res.body.options.should.be.eql(examplePoll.options)
                done();
            });
      });
  });

});
