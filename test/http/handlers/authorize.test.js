/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../app/http/handlers/authorize');
var flowstate = require('flowstate');


describe('http/handlers/authorize', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    var manager = new flowstate.Manager();
    manager.use('/oauth2/authorize', {
      prompt:  [
        function(req, res, next) {
          res.xprompt('consent');
        }
      ]
    })
    
    function ceremony(name) {
      return manager.flow.apply(manager, arguments);
    }
    
    var server = {
      authorization: function(){
        return function(req, res, next) {
          next();
        };
      }
    }
    function validateClient() {};
    
    function continueHandler(req, res, next) {
      res.redirect('/loginx')
      //next();
      
      //next();
    };
    
    function authenticate(schemes) {
      return function(req, res, next) {
        req.authInfo = { schemes: schemes };
        next();
      };
    }
    
    var OAuth2 = {
      authorize: function(areq, ares) {
        ares.prompt('login')
      }
    }
    
    
    describe('default behavior', function() {
      var request, response;
      
      before(function() {
        sinon.spy(server, 'authorization');
      });
      
      after(function() {
        server.authorization.restore();
      });
      
      before(function(done) {
        var handler = factory(continueHandler, OAuth2, validateClient, server, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.url = '/oauth2/authorize';
            
            
            req.oauth2 = {
              client: { id: 1}
            }
            req.session = {};
          })
          .res(function(res) {
            response = res;
            res.xprompt = function(prompt) {
              this.end();
            }
          })
          .end(function(res) {
            done();
          })
          .dispatch();
      });
      
      it('should add authorization middleware to stack', function() {
        expect(server.authorization.callCount).to.equal(1);
        //expect(server.authorization).to.be.calledWithExactly(validateClient);
      });
      
      it('should set authentication info', function() {
        expect(request.authInfo).to.deep.equal({
          schemes: ['session', 'anonymous']
        });
      });
      
      it('should set state', function() {
        expect(request.state).to.deep.equal({
          name: '/oauth2/authorize',
          returnTo: '/oauth2/authorize/continue'
        });
        expect(request.state.isComplete()).to.equal(false);
      });
      
      it('should end', function() {
        expect(response.statusCode).to.equal(302);
        // TODO: test case for location header and session data
        
        //expect(response.headers['location']).to.equal('foo');
      });
    }); // default behavior
    
  }); // handler
  
});
