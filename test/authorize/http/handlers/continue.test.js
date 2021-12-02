/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/handlers/continue');


describe('authorize/http/handlers/continue', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    var server = {
      resume: function(immediate) {
      
        return function(req, res, next) {
          immediate(req.oauth2, function(err, allow) {
            if (err) { return next(err); }
            if (allow) { return res.redirect(req.oauth2.redirectURI); }
            return next();
          })
        };
      }
    };
    
    function processRequest(req, res, next) {
      res.redirect('/consent')
    };
    
    
    describe('processing request', function() {
      function authenticate(idp, options) {
        return function(req, res, next) {
          req.user = { id: '248289761001', displayName: 'Jane Doe' };
          next();
        };
      }
      
      function state() {
        return function(req, res, next) {
          next();
        };
      }
      
      function session() {
        return function(req, res, next) {
          next();
        };
      }
      
      function parseCookies() {
        return function(req, res, next) {
          next();
        };
      }
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      var sessionSpy = sinon.spy(session);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(processRequest, server, authenticateSpy, stateSpy, sessionSpy, parseCookies);
        
        chai.express.use(handler)
          .request(function(req, res) {
            request = req;
            response = res;
          })
          .finish(function() {
            done()
          })
          .listen();
      });
      
      it('should setup middleware', function() {
        expect(stateSpy).to.be.calledOnceWith();
        expect(authenticateSpy).to.be.calledOnceWith([ 'session' ]);
      });
      
      it('should prompt for consent', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/consent');
      });
    }); // processing request
    
  }); // handler
  
});
