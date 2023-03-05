/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../../com/authorize/http/response/types/code');


describe('authorize/http/response/types/code', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:oauth2orize.RequestProcessor');
    expect(factory['@type']).to.equal('code');
  });
  
  
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
  
  it('should create processor with responders', function(done) {
    var queryResponder = function(){};
    var queryResponderComponent = new Object();
    queryResponderComponent.create = sinon.stub().resolves(queryResponder);
    queryResponderComponent.a = { '@mode': 'query' };
    var formPostResponder = function(){};
    var formPostResponderComponent = new Object();
    formPostResponderComponent.create = sinon.stub().resolves(formPostResponder);
    formPostResponderComponent.a = { '@mode': 'form_post' };
    
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([
      queryResponderComponent,
      formPostResponderComponent
    ]);
    container.components.withArgs('module:oauth2orize.responseParametersFn').returns([]);
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../../com/authorize/http/response/types/code', {
      'oauth2orize': {
        grant: { code: codeSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(processor) {
        expect(codeSpy).to.be.calledOnce;
        expect(codeSpy).to.be.calledWith({
          modes: {
            query: queryResponder,
            form_post: formPostResponder
          }
        });
        done();
      })
      .catch(done);
  }); // should create processor with responders
  
  describe('default behavior', function() {
    var acs = new Object();
    
    var issue;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:oauth2orize.Responder').returns([]);
      container.components.withArgs('module:oauth2orize.responseParametersFn').returns([]);
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../../com/authorize/http/response/types/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
      
      factory(acs, logger, container)
        .then(function(processor) {
          expect(codeSpy).to.be.calledOnceWith({
            modes: {}
          });
          
          issue = codeSpy.getCall(0).args[1];
          done();
        })
        .catch(done);
    });
    
    it('should issue authorization code', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true
      };
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
        state: 'xyz'
      };
      
      issue(client, 'https://client.example.com/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code
    
    it('should issue authorization code with scope', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true,
        scope: [ 'openid', 'profile', 'email' ]
      };
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      };
      
      issue(client, 'https://client.example.org/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
          redirectURI: 'https://client.example.org/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code with scope
    
    // TODO: review this
    it('should issue authorization code with issuer', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true,
        issuer: 'https://server.example.com',
        scope: [ 'openid', 'profile', 'email' ]
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      }
      
      issue(client, 'https://client.example.org/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue.callCount).to.equal(1);
        expect(acs.issue.getCall(0).args[0]).to.deep.equal({
          issuer: 'https://server.example.com',
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
          redirectURI: 'https://client.example.org/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code with issuer
    
    it('should issue authorization code with authentication context', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true,
        scope: [ 'openid', 'profile', 'email' ],
        authContext: {
          sessionID: 'YU7uoYRVAxF34TuoAodVfw-1eA13rhqW',
          credentials: [
            { type: 'password', timestamp: new Date('2011-07-21T20:42:49.000Z') }
          ]
        }
      };
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      };
      
      issue(client, 'https://client.example.org/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
          redirectURI: 'https://client.example.org/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ],
          authContext: {
            sessionID: 'YU7uoYRVAxF34TuoAodVfw-1eA13rhqW',
            credentials: [
              { type: 'password', timestamp: new Date('2011-07-21T20:42:49.000Z') }
            ]
          }
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code with authentication context
    
  }); // default behavior
  
  describe('with failing authorization code service', function() {
    var acs = new Object();
    
    var issue;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:oauth2orize.Responder').returns([]);
      container.components.withArgs('module:oauth2orize.responseParametersFn').returns([]);
      acs.issue = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../../com/authorize/http/response/types/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
      
      factory(acs, logger, container)
        .then(function(processor) {
          expect(codeSpy).to.be.calledOnceWith({
            modes: {}
          });
          
          issue = codeSpy.getCall(0).args[1];
          done();
        })
        .catch(done);
    });
    
    it('should yield error', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
      };
      var user = {
        id: '248289761001',
        displayName: 'Jane Doe'
      };
      var ares = {
        allow: true
      };
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
        state: 'xyz'
      };
      
      issue(client, 'https://client.example.com/cb', user, ares, areq, {}, function(err, code) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal('something went wrong');
        expect(code).to.be.undefined;
        done();
      });
    }); // should yield error
  
  }); // with failing authorization code service
  
  describe('without response parameter extensions', function() {
    var acs = new Object();
    
    var extend;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:oauth2orize.Responder').returns([]);
      container.components.withArgs('module:oauth2orize.responseParametersFn').returns([]);
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../../com/authorize/http/response/types/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
      
      factory(acs, logger, container)
        .then(function(processor) {
          expect(codeSpy).to.be.calledOnceWith({
            modes: {}
          });
          
          extend = codeSpy.getCall(0).args[2];
          done();
        })
        .catch(done);
    });
    
    it('should not extend response', function(done) {
      var txn = {
        client: {
          id: 's6BhdRkqt3',
          name: 'My Example Client'
        },
        redirectURI: 'https://client.example.com/cb',
        req: {
          type: 'code',
          clientID: 's6BhdRkqt3',
          redirectURI: 'https://client.example.com/cb',
          state: 'xyz'
        },
        user: {
          id: '248289761001',
          displayName: 'Jane Doe'
        },
        res: {
          allow: true
        }
      };
      
      extend(txn, function(err, params) {
        if (err) { return done(err); }
        expect(params).to.deep.equal({});
        done();
      });
    }); // should yield error
    
  }); // without parameter extensions
  
  describe('with one response parameter extension', function() {
    var acs = new Object();
    var fn1 = sinon.stub().yieldsAsync(null, { session_state: 'c2a7f7f4842520527248dc8cfcfa2a70d786b47b1dc26f29dc1fa7f4069736f3.knrj4ZDIWFQpWAu-pLTTKg' });
    
    var extend;
    
    beforeEach(function(done) {
      var fn1Component = new Object();
      fn1Component.create = sinon.stub().resolves(fn1);
      
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:oauth2orize.Responder').returns([]);
      container.components.withArgs('module:oauth2orize.responseParametersFn').returns([ fn1Component ]);
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../../com/authorize/http/response/types/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
      
      factory(acs, logger, container)
        .then(function(processor) {
          expect(codeSpy).to.be.calledOnceWith({
            modes: {}
          });
          
          extend = codeSpy.getCall(0).args[2];
          done();
        })
        .catch(done);
    });
    
    it('should extend response', function(done) {
      var txn = {
        client: {
          id: 's6BhdRkqt3',
          name: 'My Example Client'
        },
        redirectURI: 'https://client.example.com/cb',
        req: {
          type: 'code',
          clientID: 's6BhdRkqt3',
          redirectURI: 'https://client.example.com/cb',
          state: 'xyz'
        },
        user: {
          id: '248289761001',
          displayName: 'Jane Doe'
        },
        res: {
          allow: true
        }
      };
      
      extend(txn, function(err, params) {
        if (err) { return done(err); }
        
        expect(fn1).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          req: {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com/cb',
            state: 'xyz'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          res: {
            allow: true
          }
        });
        expect(params).to.deep.equal({
          session_state: 'c2a7f7f4842520527248dc8cfcfa2a70d786b47b1dc26f29dc1fa7f4069736f3.knrj4ZDIWFQpWAu-pLTTKg'
        });
        done();
      });
    }); // should extend response
    
  }); // with one response parameter extension
  
  describe('with two response parameter extensions', function() {
    var acs = new Object();
    var fn1 = sinon.stub().yieldsAsync(null, { cow: 'moo' });
    var fn2 = sinon.stub().yieldsAsync(null, { ping: 'oink' });
    
    var extend;
    
    beforeEach(function(done) {
      var fn1Component = new Object();
      fn1Component.create = sinon.stub().resolves(fn1);
      var fn2Component = new Object();
      fn2Component.create = sinon.stub().resolves(fn2);
      
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:oauth2orize.Responder').returns([]);
      container.components.withArgs('module:oauth2orize.responseParametersFn').returns([ fn1Component, fn2Component ]);
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../../com/authorize/http/response/types/code', {
        'oauth2orize': {
          grant: { code: codeSpy }
        }
      });
      
      factory(acs, logger, container)
        .then(function(processor) {
          expect(codeSpy).to.be.calledOnceWith({
            modes: {}
          });
          
          extend = codeSpy.getCall(0).args[2];
          done();
        })
        .catch(done);
    });
    
    it('should extend response', function(done) {
      var txn = {
        client: {
          id: 's6BhdRkqt3',
          name: 'My Example Client'
        },
        redirectURI: 'https://client.example.com/cb',
        req: {
          type: 'code',
          clientID: 's6BhdRkqt3',
          redirectURI: 'https://client.example.com/cb',
          state: 'xyz'
        },
        user: {
          id: '248289761001',
          displayName: 'Jane Doe'
        },
        res: {
          allow: true
        }
      };
      
      extend(txn, function(err, params) {
        if (err) { return done(err); }
        
        expect(fn1).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          req: {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com/cb',
            state: 'xyz'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          res: {
            allow: true
          }
        });
        expect(fn2).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          req: {
            type: 'code',
            clientID: 's6BhdRkqt3',
            redirectURI: 'https://client.example.com/cb',
            state: 'xyz'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          res: {
            allow: true
          }
        });
        expect(params).to.deep.equal({
          cow: 'moo',
          ping: 'oink'
        });
        done();
      });
    }); // should extend response
    
  }); // with two response parameter extensions
  
});
