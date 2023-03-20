/* global describe, it */

var chai = require('chai');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/handlers/authorize');
var oauth2orize = require('oauth2orize');


describe('authorize/http/handlers/authorize', function() {
  
  var service = function(req, cb) {
    return cb(null, req.prompt('consent'));
  }
  var dispatcher = new Object();
  dispatcher.dispatch = function(prompt, req, res, next) {
    res.redirect('/' + prompt);
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
        
          immediate(req.oauth2, function(err, allow, info) {
            if (err) { return next(err); }
            if (allow) {
              req.oauth2.res = info || {};
              req.oauth2.res.allow = true;
              return res.redirect(req.oauth2.redirectURI);
            }
            req.oauth2.info = info;
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
  
  // TODO: Review this and above
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
  
  // TODO: Review this
  it('should create handler', function(done) {
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
    
    var authorizationErrorSpy = sinon.spy(server, 'authorizationError');
    var authorizationSpy = sinon.spy(server, 'authorization');
    var authenticateSpy = sinon.spy(authenticate);
    
    // TODO: Add state store
    factory(undefined, undefined, null, server, { authenticate: authenticateSpy }, undefined, logger, container)
      .then(function(handler) {
        //expect(stateSpy).to.be.calledOnce;
        //expect(stateSpy).to.be.calledWithExactly({ external: true });
        //expect(stateSpy).to.be.calledAfter(parseCookiesSpy);
        expect(authenticateSpy).to.be.calledOnce;
        expect(authenticateSpy).to.be.calledWithExactly([ 'session', 'anonymous' ], { multi: true });
        expect(authorizationSpy).to.be.calledOnce;
        expect(authorizationSpy).to.be.calledAfter(authenticateSpy);
        expect(authorizationErrorSpy).to.be.calledOnce;
        expect(authorizationErrorSpy).to.be.calledAfter(authorizationSpy);
        done();
      })
      .catch(done);
  });
  
  describe('with authorization service that prompts user', function() {
    
    it('should evaluate request from client with single redirect URI', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
              expect(this.req.params).to.deep.equal({});
              
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with single redirect URI
    
    it('should evaluate request from client with multiple redirect URIs', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb', 'https://client.example.com/cb2' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
              expect(this.req.params).to.deep.equal({});
          
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
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
              expect(this.req.params).to.deep.equal({});
          
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
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null);
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: []
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb', 'https://client.example.com/cb2' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb', 'https://client.example.com/cb2' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
    
    it('should evaluate request from client with single web origin', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com',
                response_mode: 'web_message'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                webOrigins: [ 'https://client.example.com' ]
              });
              expect(this.req.oauth2.redirectURI).to.be.undefined;
              expect(this.req.oauth2.webOrigin).to.equal('https://client.example.com');
              expect(this.req.params).to.deep.equal({});
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with single web origin
    
    it('should evaluate request from client with multiple web origins', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com', 'https://client2.example.com' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client2.example.com',
                response_mode: 'web_message'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                webOrigins: [ 'https://client.example.com', 'https://client2.example.com' ]
              });
              expect(this.req.oauth2.redirectURI).to.be.undefined;
              expect(this.req.oauth2.webOrigin).to.equal('https://client2.example.com');
              expect(this.req.params).to.deep.equal({});
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with multiple web origins
    
    it('should evaluate request from client with single web origin that omits redirect URI parameter', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
              req.query = {
                client_id: 's6BhdRkqt3',
                response_mode: 'web_message'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                webOrigins: [ 'https://client.example.com' ]
              });
              expect(this.req.oauth2.redirectURI).to.be.undefined;
              expect(this.req.oauth2.webOrigin).to.equal('https://client.example.com');
              expect(this.req.params).to.deep.equal({});
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with single web origin that omits redirect URI parameter
    
    it('should evaluate request from client with redirect URI that is a redirect URI but is not a web origin', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com' ],
        webOrigins: [ 'https://client.example.test' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com',
                response_mode: 'web_message'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                redirectURIs: [ 'https://client.example.com' ],
                webOrigins: [ 'https://client.example.test' ]
              });
              expect(this.req.oauth2.redirectURI).to.equal('https://client.example.com');
              expect(this.req.oauth2.webOrigin).to.be.undefined;
              expect(this.req.params).to.deep.equal({});
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with redirect URI that is a redirect URI but is not a web origin
    
    it('should evaluate request from client with redirect URI is not a redirect URI but is a web origin', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ],
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com',
                response_mode: 'web_message'
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
              expect(this.req.oauth2.redirectURI).to.be.undefined;
              expect(this.req.oauth2.webOrigin).to.equal('https://client.example.com');
              expect(this.req.params).to.deep.equal({});
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with redirect URI is not a redirect URI but is a web origin
    
    it('should evaluate request from client with redirect URI that is both a redirect URI and a web origin', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com' ],
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'https://client.example.com',
                response_mode: 'web_message'
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
              expect(this.req.params).to.deep.equal({});
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with redirect URI that is both a redirect URI and a web origin
    
    it('should error when when querying client directory fails', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
    }); // should error when when querying client directory fails
    
    it('should evaluate request from client that uses a redirect URI scheme', function(done) {
      var scheme = sinon.spy(function(redirectURI) {
        return 'https://client.example.com';
      });
      var schemeComponent = new Object();
      schemeComponent.create = sinon.stub().resolves(scheme);
      schemeComponent.a = { '@scheme': 'storagerelay' };
      
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([ schemeComponent ]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ],
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'storagerelay://https/client.example.com?id=auth304970'
              };
            })
            .finish(function() {
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(scheme).to.have.been.calledOnceWith('storagerelay://https/client.example.com?id=auth304970');
              expect(this.req.oauth2.client).to.deep.equal({
                id: 's6BhdRkqt3',
                name: 'My Example Client',
                redirectURIs: [ 'https://client.example.com/cb' ],
                webOrigins: [ 'https://client.example.com' ]
              });
              expect(this.req.oauth2.redirectURI).to.be.undefined;
              expect(this.req.oauth2.webOrigin).to.equal('https://client.example.com');
              expect(this.req.params).to.deep.equal({});
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('/consent');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client that uses a redirect URI scheme
    
    it('should reject request from client that uses a redirect URI scheme that resolves to an unregistered redirect URI', function(done) {
      var scheme = sinon.spy(function(redirectURI) {
        return 'https://client.example.test';
      });
      var schemeComponent = new Object();
      schemeComponent.create = sinon.stub().resolves(scheme);
      schemeComponent.a = { '@scheme': 'storagerelay' };
      
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([ schemeComponent ]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ],
        webOrigins: [ 'https://client.example.com' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
              req.query = {
                client_id: 's6BhdRkqt3',
                redirect_uri: 'storagerelay://https/client.example.test?id=auth304970'
              };
            })
            .next(function(err, req, res) {
              expect(err).to.be.an.instanceOf(oauth2orize.AuthorizationError);
              expect(err.message).to.equal('Client not permitted to use redirect URI');
              expect(err.code).to.equal('unauthorized_client');
              expect(err.status).to.equal(403);
          
              expect(clients.read).to.have.been.calledOnceWith('s6BhdRkqt3');
              expect(scheme).to.have.been.calledOnceWith('storagerelay://https/client.example.test?id=auth304970');
              done();
            })
            .listen();
        })
        .catch(done);
    }); // should reject request from client that uses a redirect URI scheme that resolves to an unregistered redirect URI
    
  }); // with authorization service that prompts user
  
  describe('with authorization service that responds immediately with scope', function() {
    var service = function(req, cb) {
      return cb(null, req.permit([ 'openid', 'profile', 'email' ]));
    }
    
    it('should respond to client', function(done) {
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.resolveRedirectURISchemeFn').returns([]);
      
      var clients = new Object();
      clients.read = sinon.stub().yieldsAsync(null, {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      });
      
      factory(dispatcher, service, clients, server, { authenticate: authenticate }, undefined, logger, container)
        .then(function(handler) {
          chai.express.use(handler)
            .request(function(req, res) {
              req.connection = {};
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
              expect(this.req.oauth2.res).to.deep.equal({
                allow: true,
                issuer: 'http://localhost:8085',
                scope: [ 'openid', 'profile', 'email' ]
              });
          
              expect(this.statusCode).to.equal(302);
              expect(this.getHeader('Location')).to.equal('https://client.example.com/cb');
              done()
            })
            .listen();
        })
        .catch(done);
    }); // should evaluate request from client with single redirect URI
    
  }); // with authorization service that responds immediately with scope
  
});
