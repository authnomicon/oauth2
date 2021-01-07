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
        validate(req.query.client_id, req.query.redirect_uri, function(err, client, redirectURI, webOrigin) {
          if (err) { return next(err); }
          req.oauth2 = {
            client: client,
            redirectURI: redirectURI,
            webOrigin: webOrigin
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
    
    
    describe('processing a valid authorization request', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      });
      
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
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticateSpy, stateSpy);
        
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
      
      it('should setup middleware', function() {
        expect(stateSpy).to.be.calledOnceWith({ external: true, continue: '/oauth2/authorize/continue' });
        expect(authenticateSpy).to.be.calledOnceWith([ 'session', 'anonymous' ]);
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should initialize transaction', function() {
        expect(request.oauth2.client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ]
        });
        expect(request.oauth2.redirectURI).to.deep.equal('https://client.example.com/cb');
        expect(request.oauth2.webOrigin).to.be.undefined;
      });
      
      it('should prompt for consent', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/consent');
      });
    }); // processing a valid authorization request
    
    describe('processing a valid authorization request where multiple redirect URIs are registered', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'Example Client',
        redirectURIs: [ 'https://client.example.com/cb', 'https://client.example.com/cb2' ]
      });
      
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
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticateSpy, stateSpy);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.query = {
              client_id: 's6BhdRkqt3',
              redirect_uri: 'https://client.example.com/cb2'
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
      
      it('should setup middleware', function() {
        expect(stateSpy).to.be.calledOnceWith({ external: true, continue: '/oauth2/authorize/continue' });
        expect(authenticateSpy).to.be.calledOnceWith([ 'session', 'anonymous' ]);
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should initialize transaction', function() {
        expect(request.oauth2.client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [ 'https://client.example.com/cb', 'https://client.example.com/cb2' ]
        });
        expect(request.oauth2.redirectURI).to.deep.equal('https://client.example.com/cb2');
        expect(request.oauth2.webOrigin).to.be.undefined;
      });
      
      it('should prompt for consent', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/consent');
      });
    }); // processing a valid authorization request where multiple redirect URIs are registered
    
    describe('processing a valid authorization request where redirect URI is ommitted and only one is registered', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      });
      
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
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      
      
      var request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticateSpy, stateSpy);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.query = {
              client_id: 's6BhdRkqt3'
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
      
      it('should setup middleware', function() {
        expect(stateSpy).to.be.calledOnceWith({ external: true, continue: '/oauth2/authorize/continue' });
        expect(authenticateSpy).to.be.calledOnceWith([ 'session', 'anonymous' ]);
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should initialize transaction', function() {
        expect(request.oauth2.client).to.deep.equal({
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ]
        });
        expect(request.oauth2.redirectURI).to.deep.equal('https://client.example.com/cb');
        expect(request.oauth2.webOrigin).to.be.undefined;
      });
      
      it('should prompt for consent', function() {
        expect(response.statusCode).to.equal(302);
        expect(response.getHeader('Location')).to.equal('/consent');
      });
    }); // processing a valid authorization request where redirect URI is ommitted and only one is registered
    
    describe('processing an invalid authorization request sent by unknown client', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
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
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      
      
      var error, request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticateSpy, stateSpy);
        
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
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
      
      it('should setup middleware', function() {
        expect(stateSpy).to.be.calledOnceWith({ external: true, continue: '/oauth2/authorize/continue' });
        expect(authenticateSpy).to.be.calledOnceWith([ 'session', 'anonymous' ]);
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should not initialize transaction', function() {
        expect(request.oauth2).to.be.undefined;
      });
      
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Unauthorized client');
        expect(error.code).to.equal('unauthorized_client');
        expect(error.status).to.equal(403);
      });
    }); // processing an invalid authorization request sent by unknown client
    
    describe('processing an invalid authorization request sent by client with no registered redirect URIs', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'Example Client'
      });
      
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
      
      var authenticateSpy = sinon.spy(authenticate);
      var stateSpy = sinon.spy(state);
      
      
      var error, request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticateSpy, stateSpy);
        
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
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
      
      it('should setup middleware', function() {
        expect(stateSpy).to.be.calledOnceWith({ external: true, continue: '/oauth2/authorize/continue' });
        expect(authenticateSpy).to.be.calledOnceWith([ 'session', 'anonymous' ]);
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should not initialize transaction', function() {
        expect(request.oauth2).to.be.undefined;
      });
      
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Client has no registered redirect URIs');
        expect(error.code).to.equal('unauthorized_client');
        expect(error.status).to.equal(403);
      });
    }); // processing an invalid authorization request sent by client with no registered redirect URIs
    
    describe('processing an invalid authorization request sent by client with empty array of redirect URIs', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'Example Client',
        redirectURIs: []
      });
      
      
      var error, request, response;
      
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
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
      
      it('should authenticate', function() {
        expect(request.authInfo).to.deep.equal({
          mechanisms: ['session', 'anonymous']
        });
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should not initialize transaction', function() {
        expect(request.oauth2).to.be.undefined;
      });
      
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Client has no registered redirect URIs');
        expect(error.code).to.equal('unauthorized_client');
        expect(error.status).to.equal(403);
      });
    }); // processing an invalid authorization request sent by client with empty array of redirect URIs
    
    describe('processing an invalid authorization request using unregistered redirect URI', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'Example Client',
        redirectURIs: [
          'https://client.example.com/cb',
          'https://client.example.com/cb2'
        ]
      });
      
      
      var error, request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.query = {
              client_id: 's6BhdRkqt3',
              redirect_uri: 'https://client.example.org/cb'
            };
          })
          .res(function(res) {
            response = res;
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
      
      it('should authenticate', function() {
        expect(request.authInfo).to.deep.equal({
          mechanisms: ['session', 'anonymous']
        });
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should not initialize transaction', function() {
        expect(request.oauth2).to.be.undefined;
      });
      
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Client not permitted to use redirect URI');
        expect(error.code).to.equal('unauthorized_client');
        expect(error.status).to.equal(403);
      });
    }); // processing an invalid authorization request using unregistered redirect URI
    
    describe('processing an invalid authorization request omitting redirect URI', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'Example Client',
        redirectURIs: [
          'https://client.example.com/cb',
          'https://client.example.com/cb2'
        ]
      });
      
      
      var error, request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.query = {
              client_id: 's6BhdRkqt3'
            };
          })
          .res(function(res) {
            response = res;
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
      
      it('should authenticate', function() {
        expect(request.authInfo).to.deep.equal({
          mechanisms: ['session', 'anonymous']
        });
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should not initialize transaction', function() {
        expect(request.oauth2).to.be.undefined;
      });
      
      it('should error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('Missing required parameter: redirect_uri');
        expect(error.code).to.equal('invalid_request');
        expect(error.status).to.equal(400);
      });
    }); // processing an invalid authorization request omitting redirect URI
    
    describe('encountering error while querying directory', function() {
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      
      var error, request, response;
      
      before(function(done) {
        var handler = factory(processRequest, clients, { authorization: authorization }, authenticate, ceremony);
        
        chai.express.handler(handler)
          .req(function(req) {
            request = req;
            req.query = {
              client_id: 's6BhdRkqt3'
            };
          })
          .res(function(res) {
            response = res;
          })
          .next(function(err) {
            error = err;
            done();
          })
          .dispatch();
      });
      
      it('should authenticate', function() {
        expect(request.authInfo).to.deep.equal({
          mechanisms: ['session', 'anonymous']
        });
      });
      
      it('should query directory', function() {
        expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
      });
      
      it('should not initialize transaction', function() {
        expect(request.oauth2).to.be.undefined;
      });
      
      it('should yield error', function() {
        expect(error).to.be.an.instanceOf(Error);
        expect(error.message).to.equal('something went wrong');
      });
    }); // processing an invalid authorization request omitting redirect URI
    
  }); // handler
  
});
