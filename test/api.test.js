"use strict";

process.env.NODE_ENV = 'test';
process.env.DB_LOC = 'data-test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Polls', () => {
    beforeEach((done) => { //Before each test we empty the database
        //Book.remove({}, (err) => { 
        //   done();         
        //});     
        done();
    });
 /*
  * Test the /GET route
  */
  describe('/GET polls', () => {
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

});
