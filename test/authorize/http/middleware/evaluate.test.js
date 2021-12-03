/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/middleware/evaluate');
var Request = require('../../../../lib/request');
var Response = require('../../../../lib/response');


describe('authorize/http/middleware/evaluate', function() {
  
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
    
    describe.skip('permitting access', function() {
      var listener = sinon.spy(function(req, res) {
        res.permit();
      });
      
      var request, response;
      
      before(function() {
        sinon.spy(server, '_respond');
      });
      
      /*
      after(function() {
        server._respond.restore();
      });
      */
      
      before(function(done) {
        var prompts = new Object();
        
        var handler = factory(prompts, listener, server);
        
        chai.express.use([ handler ])
          .request(function(req, res) {
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
            
            response = res;
          })
          .finish(function() {
            done();
          })
          .listen();
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
    
    it('permitting access with scope', function(done) {
      var listener = sinon.spy(function(req, res) {
        res.permit([ 'profile', 'email' ]);
      });
      
      var request, response;
      
      var prompts = new Object();
      
      var handler = factory(prompts, listener, server);
      
      chai.express.use([ handler ])
        .request(function(req, res) {
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
          req.oauth2.req = {};
          
          response = res;
        })
        .finish(function() {
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
          
          expect(request.state.complete).to.have.been.called;
          
          done();
        })
        .listen();
      
      /*
      it.skip('should respond', function() {
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
            scope: [ 'profile', 'email' ]
          },
        }, response);
      });
      */
    }); // permitting access with scope
    
    it('prompting for login', function(done) {
      var listener = sinon.spy(function(req, res) {
        res.prompt('login');
      });
      
      var prompts = new Object();
      prompts.dispatch = sinon.spy(function(name, req, res, next) {
        res.redirect('/login');
      });
      
      var request, response;
      
      
      var handler = factory(prompts, listener, server);
      
      chai.express.use([ handler ])
        .request(function(req, res) {
          request = req;
          req.state = {};
          req.state.complete = sinon.spy();
          req.oauth2 = {};
          req.oauth2.client = {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          };
          req.oauth2.req = {};
          
          response = res;
        })
        .finish(function() {
          expect(listener).to.have.been.calledOnce;
          expect(listener.firstCall.args[0]).to.be.an.instanceOf(Request);
          expect(listener.firstCall.args[0].client).to.deep.equal({
            id: 's6BhdRkqt3',
            name: 'Example Client'
          });
          expect(listener.firstCall.args[0].user).to.be.undefined;
          expect(listener.firstCall.args[1]).to.be.an.instanceOf(Response);
          
          expect(request.state.complete).to.not.have.been.called;
          
          expect(prompts.dispatch).to.have.been.calledOnceWith('login');
          //expect(prompt).to.have.been.calledOnceWith(request, response);
          
          expect(response.statusCode).to.equal(302);
          expect(response.getHeader('Location')).to.equal('/login');
          
          done();
        })
        .listen();
    }); // prompting for login
    
  });
  
});
