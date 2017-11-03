/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../../app/http/workflow/authorize/transition/login');


describe('http/workflow/authorize/transition/login', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('handler', function() {
    
    describe.only('transitioning from password login', function() {
      var request, response, error;
      
      before(function(done) {
        var handler = factory();
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            
            req.state = {
              name: 'oauth2-authorize',
              client: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              req: {
                clientID: 's6BhdRkqt3',
                redirectURI: 'https://client.example.com/cb',
                type: 'code',
                scope: [ 'openid', 'profile', 'email' ]
              },
              handle: 'af0ifjsldkj'
            };
            req.authInfo = { method: 'password' };
          })
          .next(function(res) {
            done();
          })
          .dispatch();
      });
      
      it('should update authentication contenxt', function() {
        expect(request.state.authN).to.deep.equal({
          verified: [ {
            method: 'password'
          } ]
        });
      });
      
    }); // default behavior
    
  }); // handler
  
});
