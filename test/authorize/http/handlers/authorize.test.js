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
    
    var server = {
      authorization: function(validate, immediate) {
        return function(req, res, next) {
          validate('s6BhdRkqt3', function(err, client) {
            if (err) { return next(err); }
            req.client = client;
            
            immediate({}, function(err, allow) {
              if (err) { return next(err); }
              if (allow !== false) {
                return next(new Error('should not allow transaction'));
              }
              return next();
            })
          })
        };
      }
    };
    
    function processRequest(req, res, next) {
      res.redirect('/consent')
    };
    
    function validateClient(clientID, cb) {
      process.nextTick(function() {
        cb(null, { id: clientID });
      });
    };
    
    function authenticate(schemes) {
      return function(req, res, next) {
        req.authInfo = { schemes: schemes };
        next();
      };
    }
    
    
    describe('processing request', function() {
      var request, response;
      
      before(function(done) {
        var handler = factory(processRequest, validateClient, server, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.session = {};
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
          schemes: ['session', 'anonymous']
        });
      });
      
      it('should validate client', function() {
        expect(request.client).to.deep.equal({
          id: 's6BhdRkqt3'
        });
      });
      
      it('should respond', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/consent');
      });
    }); // processing request
    
  }); // handler
  
});
