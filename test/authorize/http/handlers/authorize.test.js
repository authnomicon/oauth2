/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/authorize/http/handlers/authorize');
var utils = require('../../../utils');


describe('authorize/http/handlers/authorize', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    function ceremony(stack) {
      var stack = Array.prototype.slice.call(arguments, 0), options;
      if (typeof stack[stack.length - 1] == 'object' && !Array.isArray(stack[stack.length - 1])) {
        options = stack.pop();
      }
      options = options || {};
      
      return function(req, res, next) {
        utils.dispatch(stack)(null, req, res, next);
      };
    }
    
    function authorization(validate, immediate) {
      
      return function(req, res, next) {
        validate(req.query.client_id, req.query.redirect_uri, function(err, client, redirectURI) {
          if (err) { return next(err); }
          req.oauth2 = {
            client: client,
            redirectURI: redirectURI
          };
          
          immediate(req.oauth2, function(err, allow) {
            if (err) { return next(err); }
            if (allow) { return res.redirect(req.oauth2.redirectURI); }
            return next();
          })
        })
      };
    }
    
    function processRequest(req, res, next) {
      res.redirect('/consent')
    };
    
    function authenticate(mechanisms) {
      return function(req, res, next) {
        req.authInfo = { mechanisms: mechanisms };
        next();
      };
    }
    
    
    describe('processing request', function() {
      var clients = new Object();
      clients.find = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      });
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.query = {
              client_id: 's6BhdRkqt3',
              redirect_uri: 'https://client.example.com/cb'
            };
          })
          .res(function(res) {
            response = res;
          })
          .end(function() {
            done()
          })
          .dispatch();
      });
      
      it('should authenticate', function() {
        expect(request.authInfo).to.deep.equal({
          mechanisms: ['session', 'anonymous']
        });
      });
      
      it('should query directory', function() {
        expect(clients.find).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should initialize transaction', function() {
        expect(request.oauth2.client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ]
        });
        expect(request.oauth2.redirectURI).to.deep.equal('https://client.example.com/cb');
      });
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/consent');
      });
    }); // processing request
    
  }); // handler
  
});
