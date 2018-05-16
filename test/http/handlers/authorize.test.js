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
    manager.use('oauth2/authorize', {
      prompt:  [
        function(req, res, next) {
          res.render('consent');
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
    function processTransaction() {};
    function completeTransaction() {};
    
    function authenticate(schemes) {
      return function(req, res, next) {
        req.authInfo = { schemes: schemes };
        next();
      };
    }
    
    describe('default behavior', function() {
      var request, response, view, h;
      
      before(function() {
        sinon.spy(server, 'authorization');
      });
      
      after(function() {
        server.authorization.restore();
      });
      
      before(function(done) {
        var handler = factory(validateClient, processTransaction, completeTransaction, server, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.session = {};
          })
          .res(function(res) {
            response = res;
            res.locals = {};
          })
          .render(function(res, v) {
            h = Object.keys(request.session.state)[0];
            view = v;
            done();
          })
          .dispatch();
      });
      
      it('should add authorization middleware to stack', function() {
        expect(server.authorization.callCount).to.equal(1);
        expect(server.authorization).to.be.calledWithExactly(validateClient, processTransaction, completeTransaction);
      });
      
      it('should set authentication info', function() {
        expect(request.authInfo).to.deep.equal({
          schemes: ['session', 'anonymous']
        });
      });
      
      it('should set state', function() {
        expect(request.state).to.deep.equal({
          name: 'oauth2/authorize'
        });
        expect(request.state.isComplete()).to.equal(false);
      });
      
      it('should set session', function() {
        var state = {};
        state[h] = {
          name: 'oauth2/authorize'
        };
        
        expect(request.session).to.deep.equal({
          state: state
        });
      });
      
      it('should set locals', function() {
        expect(response.locals).to.deep.equal({
          state: h
        });
      });
      
      it('should render', function() {
        expect(response.statusCode).to.equal(200);
        expect(view).to.equal('consent');
      });
    }); // default behavior
    
  }); // handler
  
});
