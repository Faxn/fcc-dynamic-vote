"use strict";

process.env.NODE_ENV = 'test';
process.env.DB_LOC = 'data-test';


//Clean out the databases from the last run.
const fs = require('fs');
let files = fs.readdirSync('data-test')
for (let i in files){
    console.log("clearing "+files[i])
    fs.unlinkSync('data-test/'+files[i]);
}


//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Polls-Api', () => {
    
 /*
  * Test the /GET route
  */
  describe('GET /polls', () => {
      it('it should GET all the polls', (done) => {
        chai.request(server)
            .get('/api/polls')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
      });
  });
  describe('POST /poll', () => {
      it('Should accept a post request', (done) => {
          chai.request(server)
            .post('/api/poll')
            .field('title', 'Test Poll 1')
            .field('author', 'mocha')
            .field('options', 'small\nmedium\nlarge')
            .end((err, res) => {
                res.should.have.status(201)
                done()
            })
      })
      
      it('There should be a poll in the database now', (done) => {
        chai.request(server)
            .get('/api/polls')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
      });
  });

});
