/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../../app/http/ceremony/authorize/yield/login');


describe('http/ceremony/authorize/yield/login', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    describe('yielding from password login', function() {
      var request, response, error;
      
      before(function(done) {
        var handler = factory();
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            
            req.state = {
              name: 'oauth2/authorize',
              client: 's6BhdRkqt3',
              redirectURI: 'https://client.example.com/cb',
              request: {
                clientID: 's6BhdRkqt3',
                redirectURI: 'https://client.example.com/cb',
                type: 'code',
                scope: [ 'openid', 'profile', 'email' ]
              }
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
          methods: [ 'password' ]
        });
      });
    }); // default behavior
    
  }); // handler
  
});
