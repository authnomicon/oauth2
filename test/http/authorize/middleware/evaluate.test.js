/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/authorize/middleware/evaluate');
var Request = require('../../../../lib/request');
var Response = require('../../../../lib/response');


describe('http/authorize/middleware/evaluate', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('handler', function() {
    
    var server = {
      _respond: function(txn, res, cb) {
        res.end();
      }
    };
    
    describe('permitting access', function() {
      var listener = sinon.spy(function(req, res) {
        res.permit();
      });
      
      var request, response;
      
      before(function() {
        sinon.spy(server, '_respond');
      });
      
      after(function() {
        server._respond.restore();
      });
      
      before(function(done) {
        var prompts = new Object();
        
        var handler = factory(prompts, listener, server);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.state = {};
            req.state.complete = sinon.spy();
            req.oauth2 = {};
            req.oauth2.client = {
              id: 's6BhdRkqt3',
              name: 'Example Client'
            };
            req.oauth2.user = {
              id: '248289761001',
              displayName: 'Jane Doe'
            };
          })
          .res(function(res) {
            response = res;
          })
          .end(function() {
            done();
          })
          .dispatch();
      });
      
      it('should call listener', function() {
        expect(listener).to.have.been.calledOnce;
        expect(listener.firstCall.args[0]).to.be.an.instanceOf(Request);
        expect(listener.firstCall.args[0].client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client'
        });
        expect(listener.firstCall.args[0].user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
        expect(listener.firstCall.args[1]).to.be.an.instanceOf(Response);
      });
      
      it('should complete state', function() {
        expect(request.state.complete).to.have.been.called;
      });
      
      it('should respond', function() {
        expect(server._respond).to.have.been.calledOnce;
        expect(server._respond).to.have.been.calledWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          res: {
            allow: true,
            scope: undefined
          },
        }, response);
      });
    }); // permitting access
    
    describe.skip('permitting access with scope', function() {
      var request, response
        , azrequest;
      
      before(function() {
        sinon.spy(server, '_respond');
      });
      
      after(function() {
        server._respond.restore();
      });
      
      before(function(done) {
        function authorizationHandler(req, res) {
          azrequest = req;
          res.permit([ 'profile', 'email' ]);
        }
        
        var handler = factory(authorizationHandler, server);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.state = {};
            req.state.complete = sinon.spy();
            req.oauth2 = {};
            req.oauth2.client = {
              id: 's6BhdRkqt3'
            };
            req.oauth2.user = {
              id: '248289761001',
              displayName: 'Jane Doe'
            };
          })
          .res(function(res) {
            response = res;
          })
          .end(function() {
            done();
          })
          .dispatch();
      });
      
      it('should initialize authorization request', function() {
        expect(azrequest.client).to.deep.equal({
          id: 's6BhdRkqt3'
        });
        expect(azrequest.user).to.deep.equal({
          id: '248289761001',
          displayName: 'Jane Doe'
        });
      });
      
      it('should complete state', function() {
        expect(request.state.complete).to.have.been.called;
      });
      
      it('should respond', function() {
        expect(server._respond).to.have.been.calledOnce;
        expect(server._respond).to.have.been.calledWith({
          client: {
            id: 's6BhdRkqt3'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          res: {
            allow: true,
            scope: [ 'profile', 'email' ]
          },
        }, response);
        
        expect(response.statusCode).to.equal(200);
      });
    }); // permitting access with scope
    
    describe.skip('prompting for login', function() {
      var request, response
        , azrequest;
      
      before(function() {
        sinon.spy(server, '_respond');
      });
      
      after(function() {
        server._respond.restore();
      });
      
      before(function(done) {
        function authorizationHandler(req, res) {
          azrequest = req;
          res.prompt('login');
        }
        
        var handler = factory(authorizationHandler, server);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.state = {};
            req.state.complete = sinon.spy();
            req.oauth2 = {};
            req.oauth2.client = {
              id: 's6BhdRkqt3'
            };
          })
          .res(function(res) {
            response = res;
          })
          .end(function() {
            done();
          })
          .dispatch();
      });
      
      it('should initialize authorization request', function() {
        expect(azrequest.client).to.deep.equal({
          id: 's6BhdRkqt3'
        });
        expect(azrequest.user).to.be.undefined;
      });
      
      it('should not complete state', function() {
        expect(request.state.complete).to.not.have.been.called;
      });
      
      it('should redirect', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/login');
      });
    }); // prompting for login
    
  });
  
});
