/* global describe, it */

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/handlers/authorize');
var oauth2orize = require('oauth2orize');


describe('authorize/http/handlers/authorize', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  
  function evaluate(req, res, next) {
    res.redirect('/consent')
  };
  
  var server = {
    authorization: function(validate, immediate) {
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
    },
    
    authorizationError: function() {
      return function(err, req, res, next) {
        next(err);
      };
    }
  };
  
  function authenticate() {
    return function(req, res, next) {
      next();
    };
  }
  
  function state() {
    return function(req, res, next) {
      next();
    };
  }
  
  var logger = {
    emergency: function(){},
    alert: function(){},
    critical: function(){},
    error: function(){},
    warning: function(){},
    notice: function(){},
    info: function(){},
    debug: function(){}
  };
  
  it('should create handler', function(done) {
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
    
    var authorizationErrorSpy = sinon.spy(server, 'authorizationError');
    var authorizationSpy = sinon.spy(server, 'authorization');
    var authenticateSpy = sinon.spy(authenticate);
    var stateSpy = sinon.spy(state);
    
    factory(evaluate, null, server, { authenticate: authenticateSpy }, stateSpy, logger, container)
      .then(function(handler) {
        expect(stateSpy).to.be.calledOnce;
        expect(stateSpy).to.be.calledWithExactly({ external: true });
        //expect(stateSpy).to.be.calledAfter(parseCookiesSpy);
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly([ 'session', 'anonymous' ], { multi: true });
        expect(authenticateSpy).to.be.calledAfter(stateSpy);
        expect(authorizationSpy).to.be.calledOnce;
        expect(authorizationSpy).to.be.calledAfter(authenticateSpy);
        expect(authorizationErrorSpy).to.be.calledOnce;
        expect(authorizationErrorSpy).to.be.calledAfter(authorizationSpy);
        done();
      })
      .catch(done);
  });
  
  describe('handler', function() {
    
    it('should evaluate request', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com/cb'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                redirectURIs: [ 'https://client.example.com/cb' ]
              });
              expect(this.req.oauth2.redirectURI).to.deep.equal('https://client.example.com/cb');
              expect(this.req.oauth2.webOrigin).to.be.undefined;
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request
    
    it('should evaluate request from client with multiple redirect URIs', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb', 'https://client.example.com/cb2' ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com/cb2'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                redirectURIs: [ 'https://client.example.com/cb', 'https://client.example.com/cb2' ]
              });
              expect(this.req.oauth2.redirectURI).to.deep.equal('https://client.example.com/cb2');
              expect(this.req.oauth2.webOrigin).to.be.undefined;
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with multiple redirect URIs
    
    it('should evaluate request from client with single redirect URI that omits redirect URI parameter', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                redirectURIs: [ 'https://client.example.com/cb' ]
              });
              expect(this.req.oauth2.redirectURI).to.deep.equal('https://client.example.com/cb');
              expect(this.req.oauth2.webOrigin).to.be.undefined;
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with single redirect URI that omits redirect URI parameter
    
    it('should reject request from unregistered client', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com/cb'
              };
            })
            .next(function(err, req, res) {
              expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
              expect(err.message).to.equal('Unauthorized client');
              expect(err.code).to.equal('unauthorized_client');
              expect(err.status).to.equal(403);
          
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              done();
            })
            .listen();
        })
        .catch(done);
    }); // should reject request from unregistered client
    
    it('should reject request from client with no registered redirect URIs', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com/cb'
              };
            })
            .next(function(err, req, res) {
              expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
              expect(err.message).to.equal('Client has no registered redirect URIs');
              expect(err.code).to.equal('unauthorized_client');
              expect(err.status).to.equal(403);
          
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              done();
            })
            .listen();
        })
        .catch(done);
    }); // should reject request from client with no registered redirect URIs
    
    it('should reject request from client with no registered redirect URIs as indicated by empty array', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: []
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com/cb'
              };
            })
            .next(function(err, req, res) {
              expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
              expect(err.message).to.equal('Client has no registered redirect URIs');
              expect(err.code).to.equal('unauthorized_client');
              expect(err.status).to.equal(403);
          
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              done();
            })
            .listen();
        })
        .catch(done);
    }); // should reject request from client with no registered redirect URIs as indicated by empty array
    
    it('should reject request from client using unregistered redirect URI', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [
          'https://client.example.com/cb',
          'https://client.example.com/cb2'
        ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.net/cb'
              };
            })
            .next(function(err, req, res) {
              expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
              expect(err.message).to.equal('Client not permitted to use redirect URI');
              expect(err.code).to.equal('unauthorized_client');
              expect(err.status).to.equal(403);
          
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              done();
            })
            .listen()
        })
        .catch(done);
    }); // should reject request from client using unregistered redirect URI
    
    it('should reject request from client with multiple redirect URIs that omits redirect URI parameter', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [
          'https://client.example.com/cb',
          'https://client.example.com/cb2'
        ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3'
              };
            })
            .next(function(err, req, res) {
              expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
              expect(err.message).to.equal('Missing required parameter: redirect_uri');
              expect(err.code).to.equal('invalid_request');
              expect(err.status).to.equal(400);
          
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              done();
            })
            .listen()
        })
        .catch(done);
    }); // should reject request from client with multiple redirect URIs that omits redirect URI parameter
    
    it('should error when error is encountered while querying directory', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3'
              };
            })
            .next(function(err, req, res) {
              expect(err).to.be.an.instanceOf(Error);
              expect(err.message).to.equal('something went wrong');
              done();
            })
            .listen()
        })
        .catch(done);
    }); // should error when error is encountered while querying directory
    
    it('should evaluate request from client using redirect URI that is a registered web origin', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com' ],
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                redirectURIs: [ 'https://client.example.com' ],
                webOrigins: [ 'https://client.example.com' ]
              });
              expect(this.req.oauth2.redirectURI).to.equal('https://client.example.com');
              expect(this.req.oauth2.webOrigin).to.equal('https://client.example.com');
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client using redirect URI that is a registered web origin
    
    it('should evaluate request from client using redirect URI that is not a registered web origin', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [
          'https://client.example.com',
          'https://client.example.io'
        ],
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.io'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                redirectURIs: [
                  'https://client.example.com',
                  'https://client.example.io'
                ],
                webOrigins: [ 'https://client.example.com' ]
              });
              expect(this.req.oauth2.redirectURI).to.equal('https://client.example.io');
              expect(this.req.oauth2.webOrigin).to.be.undefined;
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client using redirect URI that is not a registered web origin
    
    it('should evaluate request from client that uses a redirect URI scheme', function(done) {
      var scheme = {
        verify: function(client, redirectURI) {
          expect(client).to.deep.equal({
            id: 's6BhdRkqt3',
            name: 'My Example Client',
            redirectURIs: [ 'https://client.example.com/cb' ],
            webOrigins: [ 'https://client.example.com' ]
          });
          expect(redirectURI).to.equal('storagerelay://https/client.example.com?id=auth304970');
          
          return [ redirectURI, 'https://client.example.com' ]
        }
      };
      var schemeComponent = new Object();
      schemeComponent.create = sinon.stub().resolves(scheme);
      schemeComponent.a = { '@scheme': 'storagerelay' };
      
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([ schemeComponent ]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ],
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'storagerelay://https/client.example.com?id=auth304970'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                redirectURIs: [ 'https://client.example.com/cb' ],
                webOrigins: [ 'https://client.example.com' ]
              });
              expect(this.req.oauth2.redirectURI).to.equal('storagerelay://https/client.example.com?id=auth304970');
              expect(this.req.oauth2.webOrigin).to.equal('https://client.example.com');
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client that uses a redirect URI scheme
    
    it('should reject request from client that uses an unverified redirect URI scheme', function(done) {
      var scheme = {
        verify: function(client, redirectURI) {
          return false;
        }
      };
      var schemeComponent = new Object();
      schemeComponent.create = sinon.stub().resolves(scheme);
      schemeComponent.a = { '@scheme': 'storagerelay' };
      
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/RedirectURIScheme').returns([ schemeComponent ]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ],
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(evaluate, clients, server, { authenticate: authenticate }, state, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'storagerelay://https/client.example.com?id=auth304970'
              };
            })
            .next(function(err, req, res) {
              expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
              expect(err.message).to.equal('Client not permitted to use redirect URI');
              expect(err.code).to.equal('unauthorized_client');
              expect(err.status).to.equal(403);
          
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              done();
            })
            .listen();
        })
        .catch(done);
    }); // should reject request from client that uses an unverified redirect URI scheme
    
  }); // handler
  
});
