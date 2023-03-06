/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/token/http/grant/code');
var oauth2orize = require('oauth2orize');


describe('token/http/grant/code', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:oauth2orize.tokenRequestHandler');
    expect(factory['@type']).to.equal('authorization_code');
    expect(factory['@singleton']).to.be.undefined;
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
  
  it('should create handler without response parameter extensions', function(done) {
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('module:@authnomicon/oauth2.tokenResponseParametersFn').returns([]);
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../com/token/http/grant/code', {
      'oauth2orize': {
        exchange: { code: codeSpy }
      }
    });
    
    factory(null, null, logger, container)
      .then(function(handler) {
        expect(codeSpy).to.be.calledOnce;
        done();
      })
      .catch(done);
  }); // should create handler without response parameter extensions


  describe('default behavior', function() {
    var acs = new Object();
    var ats = new Object();
    
    var issue;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:@authnomicon/oauth2.tokenResponseParametersFn').returns([]);
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.com/cb',
        user: { id: '248289761001' }
      });
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': {
          exchange: { code: codeSpy }
        }
      });
      
      factory(ats, acs, logger, container)
        .then(function(handler) {
          expect(codeSpy).to.be.calledOnce;
          
          issue = codeSpy.getCall(0).args[0];
          done();
        })
        .catch(done);
    });
    
    it('should issue access token', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      };
      
      issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.com/cb', {}, {}, function(err, token) {
        if (err) { return done(err); }
    
        expect(acs.verify).to.be.calledOnceWith('SplxlOBeZQQYbYS6WxSbIA');
        expect(ats.issue).to.be.calledOnceWith({
          user: {
            id: '248289761001'
          },
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client',
            redirectURIs: [ 'https://client.example.com/cb' ]
          }
        });
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
        done();
      });
    }); // should issue access token
    
  }); // default behavior
  
  describe('with authorization code service that encodes scope', function() {
    var acs = new Object();
    var ats = new Object();
    
    var issue;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:@authnomicon/oauth2.tokenResponseParametersFn').returns([]);
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.org/cb',
        user: { id: '248289761001' },
        scope: [ 'openid', 'profile', 'email' ]
      });
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': {
          exchange: { code: codeSpy }
        }
      });
      
      factory(ats, acs, logger, container)
        .then(function(handler) {
          expect(codeSpy).to.be.calledOnce;
          
          issue = codeSpy.getCall(0).args[0];
          done();
        })
        .catch(done);
    });
    
    it('should issue access token', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example',
        redirectURIs: [ 'https://client.example.org/cb' ]
      };
      
      issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.org/cb', {}, {}, function(err, token) {
        if (err) { return done(err); }
    
        expect(acs.verify).to.be.calledOnceWith('SplxlOBeZQQYbYS6WxSbIA');
        expect(ats.issue).to.be.calledOnceWith({
          user: {
            id: '248289761001'
          },
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
        done();
      });
    }); // should issue access token
    
  }); // with authorization code service that encodes scope
  
  describe('with authorization code service that encodes authentication context', function() {
    var acs = new Object();
    var ats = new Object();
    
    var issue;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:@authnomicon/oauth2.tokenResponseParametersFn').returns([]);
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.org/cb',
        user: { id: '248289761001' },
        scope: [ 'openid', 'profile', 'email' ],
        authContext: {
          sessionID: 'YU7uoYRVAxF34TuoAodVfw-1eA13rhqW',
          credentials: [
            { type: 'password', timestamp: new Date('2011-07-21T20:42:49.000Z') }
          ]
        }
      });
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': {
          exchange: { code: codeSpy }
        }
      });
      
      factory(ats, acs, logger, container)
        .then(function(handler) {
          expect(codeSpy).to.be.calledOnce;
          
          issue = codeSpy.getCall(0).args[0];
          done();
        })
        .catch(done);
    });
    
    it('should issue access token', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example',
        redirectURIs: [ 'https://client.example.org/cb' ]
      };
      
      issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.org/cb', {}, {}, function(err, token) {
        if (err) { return done(err); }
    
        expect(acs.verify).to.be.calledOnceWith('SplxlOBeZQQYbYS6WxSbIA');
        expect(ats.issue).to.be.calledOnceWith({
          user: {
            id: '248289761001'
          },
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          },
          scope: [ 'openid', 'profile', 'email' ],
          authContext: {
            sessionID: 'YU7uoYRVAxF34TuoAodVfw-1eA13rhqW',
            credentials: [
              { type: 'password', timestamp: new Date('2011-07-21T20:42:49.000Z') }
            ]
          }
        });
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
        done();
      });
    }); // should issue access token
    
  }); // with authorization code service that encodes authentication context

  describe('default behavior x', function() {
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('module:@authnomicon/oauth2.tokenResponseParametersFn').returns([]);
    
    // TODO: review this
    it('should issue access token with issuer', function(done) {
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': { exchange: { code: codeSpy } }
      });
      
      var acs = new Object();
      acs.verify = sinon.stub().yieldsAsync(null, {
        issuer: 'https://server.example.com',
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.org/cb',
        user: { id: '248289761001' },
        scope: [ 'openid', 'profile', 'email' ]
      });
      var ats = new Object();
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          var client = {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          };
          
          var issue = codeSpy.getCall(0).args[0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.org/cb', {}, {}, function(err, token) {
            if (err) { return done(err); }
        
            expect(acs.verify).to.be.calledOnce;
            expect(acs.verify.getCall(0).args[0]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
            expect(ats.issue).to.be.calledOnce;
            expect(ats.issue.getCall(0).args[0]).to.deep.equal({
              issuer: 'https://server.example.com',
              user: {
                id: '248289761001'
              },
              client: {
                id: 's6BhdRkqt3',
                name: 'My Example',
                redirectURIs: [ 'https://client.example.org/cb' ]
              },
              scope: [ 'openid', 'profile', 'email' ]
            });
            expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
            done();
          });
        })
        .catch(done);
    }); // should issue access token with issuer
    
    it('should not issue access token when authorization code not issued to client', function(done) {
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': { exchange: { code: codeSpy } }
      });
      
      var acs = new Object();
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.com/cb',
        user: { id: '248289761001' }
      });
      var ats = new Object();
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          var client = {
            id: 'XXXXXXXX',
            name: 'My Example Client',
            redirectURIs: [ 'https://client.example.com/cb' ]
          };
          
          var issue = codeSpy.getCall(0).args[0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.com/cb', {}, {}, function(err, token) {
            if (err) { return done(err); }
        
            expect(acs.verify).to.be.calledOnce;
            expect(acs.verify.getCall(0).args[0]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
            expect(ats.issue).to.not.be.called;
            expect(token).to.be.false;
            done();
          });
        })
        .catch(done);
    }); // should not issue access token when authorization code not issued to client
    
    it('should not issue access token when redirect URI is not identical to initial authorization request', function(done) {
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': { exchange: { code: codeSpy } }
      });
      
      var acs = new Object();
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.com/cb',
        user: { id: '248289761001' }
      });
      var ats = new Object();
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          var client = {
            id: 's6BhdRkqt3',
            name: 'My Example Client',
            redirectURIs: [ 'https://client.example.com/cb' ]
          };
          
          var issue = codeSpy.getCall(0).args[0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.com/callback', {}, {}, function(err, token) {
            expect(err).to.be.an.instanceOf(oauth2orize.TokenError);
            expect(err.message).to.equal('Mismatched redirect URI');
        
            expect(acs.verify).to.be.calledOnce;
            expect(acs.verify.getCall(0).args[0]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
            expect(ats.issue).to.not.be.called;
            done();
          });
        })
        .catch(done);
    }); // should not issue access token when redirect URI is not identical to initial authorization request
    
  }); // issue
  
  describe('extensions', function() {
    
    it('should accept message and yield parameters', function(done) {
      var ext1 = function(msg, cb) {
        expect(msg).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          },
          user: {
            id: '248289761001'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        
        return cb(null, { id_token: 'eyJhbGci' });
      };
      var ext1Component = new Object();
      ext1Component.create = sinon.stub().resolves(ext1);
      
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.tokenResponseParametersFn').returns([
        ext1Component
      ]);
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': { exchange: { code: codeSpy } }
      });
      
      var acs = new Object();
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.org/cb',
        user: { id: '248289761001' },
        scope: [ 'openid', 'profile', 'email' ]
      });
      var ats = new Object();
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          var client = {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          };
          
          var issue = codeSpy.getCall(0).args[0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.org/cb', {}, {}, function(err, token, refreshToken, params) {
            if (err) { return done(err); }
        
            expect(acs.verify).to.be.calledOnce;
            expect(acs.verify.getCall(0).args[0]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
            expect(ats.issue).to.be.calledOnce;
            expect(ats.issue.getCall(0).args[0]).to.deep.equal({
              user: {
                id: '248289761001'
              },
              client: {
                id: 's6BhdRkqt3',
                name: 'My Example',
                redirectURIs: [ 'https://client.example.org/cb' ]
              },
              scope: [ 'openid', 'profile', 'email' ]
            });
            expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
            expect(refreshToken).to.be.null;
            expect(params).to.deep.equal({ id_token: 'eyJhbGci' });
            done();
          });
        })
        .catch(done);
    }); // should accept message and yield parameters
    
    it('should accept message and bind and yield parameters', function(done) {
      var ext1 = function(msg, bind, cb) {
        expect(msg).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          },
          user: {
            id: '248289761001'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(bind).to.deep.equal({
          accessToken: '2YotnFZFEjr1zCsicMWpAA'
        });
        
        return cb(null, { id_token: 'eyJhbGci' });
      };
      var ext1Component = new Object();
      ext1Component.create = sinon.stub().resolves(ext1);
      
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.tokenResponseParametersFn').returns([
        ext1Component
      ]);
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': { exchange: { code: codeSpy } }
      });
      
      var acs = new Object();
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.org/cb',
        user: { id: '248289761001' },
        scope: [ 'openid', 'profile', 'email' ]
      });
      var ats = new Object();
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          var client = {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          };
          
          var issue = codeSpy.getCall(0).args[0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.org/cb', {}, {}, function(err, token, refreshToken, params) {
            if (err) { return done(err); }
        
            expect(acs.verify).to.be.calledOnce;
            expect(acs.verify.getCall(0).args[0]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
            expect(ats.issue).to.be.calledOnce;
            expect(ats.issue.getCall(0).args[0]).to.deep.equal({
              user: {
                id: '248289761001'
              },
              client: {
                id: 's6BhdRkqt3',
                name: 'My Example',
                redirectURIs: [ 'https://client.example.org/cb' ]
              },
              scope: [ 'openid', 'profile', 'email' ]
            });
            expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
            expect(refreshToken).to.be.null;
            expect(params).to.deep.equal({ id_token: 'eyJhbGci' });
            done();
          });
        })
        .catch(done);
    }); // should accept message and bind and yield parameters
    
    it('should accept message, bind, and grantType and yield parameters', function(done) {
      var ext1 = function(msg, bind, grantType, cb) {
        expect(msg).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          },
          user: {
            id: '248289761001'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(bind).to.deep.equal({
          accessToken: '2YotnFZFEjr1zCsicMWpAA'
        });
        expect(grantType).to.equal('authorization_code');
        
        return cb(null, { id_token: 'eyJhbGci' });
      };
      var ext1Component = new Object();
      ext1Component.create = sinon.stub().resolves(ext1);
      
      var container = new Object();
      container.components = sinon.stub();
      container.components.withArgs('module:@authnomicon/oauth2.tokenResponseParametersFn').returns([
        ext1Component
      ]);
      
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': { exchange: { code: codeSpy } }
      });
      
      var acs = new Object();
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.org/cb',
        user: { id: '248289761001' },
        scope: [ 'openid', 'profile', 'email' ]
      });
      var ats = new Object();
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          var client = {
            id: 's6BhdRkqt3',
            name: 'My Example',
            redirectURIs: [ 'https://client.example.org/cb' ]
          };
          
          var issue = codeSpy.getCall(0).args[0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.org/cb', {}, {}, function(err, token, refreshToken, params) {
            if (err) { return done(err); }
        
            expect(acs.verify).to.be.calledOnce;
            expect(acs.verify.getCall(0).args[0]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
            expect(ats.issue).to.be.calledOnce;
            expect(ats.issue.getCall(0).args[0]).to.deep.equal({
              user: {
                id: '248289761001'
              },
              client: {
                id: 's6BhdRkqt3',
                name: 'My Example',
                redirectURIs: [ 'https://client.example.org/cb' ]
              },
              scope: [ 'openid', 'profile', 'email' ]
            });
            expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
            expect(refreshToken).to.be.null;
            expect(params).to.deep.equal({ id_token: 'eyJhbGci' });
            done();
          });
        })
        .catch(done);
    }); // should accept message, bind, and grantType and yield parameters
    
  }); // extensions
  
});
