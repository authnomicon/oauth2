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
          .next(function(err) {
            done(err);
          })
          .dispatch();
      });
      
      it('should update authentication context', function() {
        expect(request.state.authN).to.deep.equal({
          methods: [ 'password' ]
        });
      });
    }); // yielding from password login
    
    describe('yielding from OTP multi-factor login', function() {
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
              },
              authN: {
                methods: [ 'password' ]
              }
            };
            req.authInfo = { method: 'otp' };
          })
          .next(function(err) {
            done(err);
          })
          .dispatch();
      });
      
      it('should update authentication context', function() {
        expect(request.state.authN).to.deep.equal({
          methods: [ 'password', 'otp' ]
        });
      });
    }); // yielding from OTP multi-factor login
    
    describe('login error handling', function() {
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
            req.yieldState = {
              failureCount: 1
            };
            req.authInfo = { method: 'password' };
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch(new Error('login failure'));
      });
      
      it('should error', function() {
        //expect(error).to.be.an.instanceOf(Error);
        //expect(error.message).to.equal('login failure');
      });
      
      it('should update authentication context', function() {
        expect(request.state.authN).to.deep.equal({
          methods: [
            "password"
          ],
          //failureCount: 1
        });
      });
    }); // login error handling
    
    describe('multi-factor login error handling', function() {
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
              },
              authN: {
                failureCount: 1
              }
            };
            req.yieldState = {
              failureCount: 3
            };
            req.authInfo = { method: 'otp' };
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch(new Error('login failure'));
      });
      
      it('should error', function() {
        //expect(error).to.be.an.instanceOf(Error);
        //expect(error.message).to.equal('login failure');
      });
      
      it('should update authentication context', function() {
        expect(request.state.authN).to.deep.equal({
          methods: [
            "otp"
          ],
          failureCount: 1,
          //failureCount: 4
        });
      });
    }); // multi-factor login error handling
    
    describe('error handling', function() {
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
            req.yieldState = {};
            req.authInfo = { method: 'password' };
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch(new Error('login failure'));
      });
      
      it('should error', function() {
        //expect(error).to.be.an.instanceOf(Error);
        //expect(error.message).to.equal('login failure');
      });
      
      it('should update authentication context', function() {
        expect(request.state.authN).to.deep.equal({
          methods: [
            "password"
          ],
          //failureCount: 0
        });
      });
    }); // error handling
    
  }); // handler
  
});
