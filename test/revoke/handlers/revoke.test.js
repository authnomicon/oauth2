/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../com/revoke/handlers/revoke');


describe('revoke/handlers/revoke', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    it.only('should do something', function(done) {
      var handler = factory();
      
      chai.express.use(handler)
        .request(function(req) {
          req.body = {
            token: '45ghiukldjahdnhzdauz'
          };
        })
        .finish(function() {
          expect(this.statusCode).to.equal(200);
          expect(this.body).to.be.undefined;
          done()
        })
        .listen();
      
    }); // should do something
    
  }); // handler
  
});
