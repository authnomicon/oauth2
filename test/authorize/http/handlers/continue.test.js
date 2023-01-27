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
  
  
  function evaluate(req, res, next) {
    res.redirect('/consent')
  };
  
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
  
  function authenticate() {
    return function(req, res, next) {
      next();
    };
  }
  
  it('should create handler', function() {
    var authenticateSpy = sinon.spy(authenticate);
    
    var handler = factory(evaluate, server, { authenticate: authenticateSpy }, undefined);
    
    //expect(stateSpy).to.be.calledOnce;
    //expect(stateSpy).to.be.calledWithExactly();
    //expect(stateSpy).to.be.calledAfter(parseCookiesSpy);
    expect(authenticateSpy).to.be.calledOnce;
    expect(authenticateSpy).to.be.calledWithExactly([ 'session' ], { multi: true });
    //expect(authenticateSpy).to.be.calledAfter(stateSpy);
  });
  
  describe('handler', function() {
    
    it('should evaluate request', function(done) {
      var handler = factory(evaluate, server, { authenticate: authenticate }, undefined);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.connection = {};
        })
        .finish(function() {
          expect(this.statusCode).to.equal(302);
          expect(this.getHeader('Location')).to.equal('/consent');
          done()
        })
        .listen();
    }); // should evaluate request
    
  }); // handler
  
});
