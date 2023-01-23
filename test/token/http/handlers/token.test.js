/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/token/http/handlers/token');


describe('token/http/handlers/token', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    var container = {
      create: function(){}
    }
    var logger = {
      notice: function(){}
    }
    
    var server = {
      token: function(){
        return function(req, res, next) {
          res.end();
        };
      },
      errorHandler: function(){
        return function(err, req, res, next) {
          next(err);
        };
      }
    }
    
    function authenticate(schemes) {
      return function(req, res, next) {
        req.authInfo = { schemes: schemes };
        next();
      };
    }
    
    function errorLogging() {
      return function(err, req, res, next) {
        next(err);
      };
    }
    
    
    describe('default behavior', function() {
      var request, response;
      
      before(function() {
        sinon.stub(container, 'create').returns(Promise.reject(new Error('component not found')));
      });
      
      /*
      after(function() {
        container.create.restore();
      });
      */
      
      before(function(done) {
        var promise = factory(container, server, authenticate, errorLogging, logger);
        promise.then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              request = req;
              response = res;
            })
            .finish(function() {
              done();
            })
            .next(function(err) {
              console.log('next')
              console.log(err)
            })
            .listen();
        });
      });
      
      it('should authenticate', function() {
        expect(request.authInfo).to.deep.equal({
          schemes: [
            'oauth2-client-authentication/client_secret_basic',
            'oauth2-client-authentication/client_secret_post',
            'oauth2-client-authentication/none'
          ]
        });
      });
      
      it('should end', function() {
        expect(response.statusCode).to.equal(200);
      });
    }); // default behavior
    
  }); // handler
  
});
