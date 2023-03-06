/* global describe, it */

var expect = require('chai').expect;
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../../../../com/authorize/http/response/types/token');


describe('authorize/http/response/types/token', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('module:oauth2orize.RequestProcessor');
    expect(factory['@type']).to.equal('token');
  });
  
  // TODO: review this
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
  
  it('should create response type without response modes', function(done) {
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    
    var tokenSpy = sinon.stub();
    var factory = $require('../../../../../com/authorize/http/response/types/token', {
      'oauth2orize': {
        grant: { token: tokenSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(tokenSpy).to.be.calledOnce;
        expect(tokenSpy).to.be.calledWith({ modes: {} });
        done();
      })
      .catch(done);
  }); // should create response type without response modes
  
  it('should create response type with response modes', function(done) {
    var mode1 = function(){};
    var mode1Component = new Object();
    mode1Component.create = sinon.stub().resolves(mode1);
    mode1Component.a = { '@mode': 'fragment' };
    
    var mode2 = function(){};
    var mode2Component = new Object();
    mode2Component.create = sinon.stub().resolves(mode2);
    mode2Component.a = { '@mode': 'form_post' };
    
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([
      mode1Component,
      mode2Component
    ]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    
    var tokenSpy = sinon.stub();
    var factory = $require('../../../../../com/authorize/http/response/types/token', {
      'oauth2orize': {
        grant: { token: tokenSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(tokenSpy).to.be.calledOnce;
        expect(tokenSpy).to.be.calledWith({
          modes: {
            fragment: mode1,
            form_post: mode2
          }
        });
        done();
      })
      .catch(done);
  }); // should create response type with response modes
  
  it('should not create response type with query response mode', function(done) {
    var mode1 = function(){};
    var mode1Component = new Object();
    mode1Component.create = sinon.stub().resolves(mode1);
    mode1Component.a = { '@mode': 'query' };
    
    var mode2 = function(){};
    var mode2Component = new Object();
    mode2Component.create = sinon.stub().resolves(mode2);
    mode2Component.a = { '@mode': 'fragment' };
    
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([
      mode1Component,
      mode2Component
    ]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    
    var tokenSpy = sinon.stub();
    var factory = $require('../../../../../com/authorize/http/response/types/token', {
      'oauth2orize': {
        grant: { token: tokenSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(tokenSpy).to.be.calledOnce;
        expect(tokenSpy).to.be.calledWith({
          modes: {
            fragment: mode2
          }
        });
        done();
      })
      .catch(done);
  }); // should not create response type with query response mode
  
  describe('default behavior', function() {
    var ats = new Object();
    
    var issue;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:oauth2orize.Responder').returns([]);
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      var tokenSpy = sinon.stub();
      var factory = $require('../../../../../com/authorize/http/response/types/token', {
        'oauth2orize': {
          grant: { token: tokenSpy }
        }
      });
      
      factory(ats, logger, container)
        .then(function(processor) {
          expect(tokenSpy).to.be.calledOnceWith({
            modes: {}
          });
          
          issue = tokenSpy.getCall(0).args[1];
          done();
        })
        .catch(done);
    });
    
    it('should issue access token', function(done) {
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
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
        state: 'xyz'
      }
      
      issue(client, user, ares, areq, {}, function(err, token) {
        if (err) { return done(err); }
        
        expect(ats.issue).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
        });
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
        done();
      });
    }); // should issue access token
    
    it('should issue access token with scope', function(done) {
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
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      }
      
      issue(client, user, ares, areq, {}, function(err, token) {
        if (err) { return done(err); }
        
        expect(ats.issue).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
        done();
      });
    }); // should issue access token with scope
    
    // TODO: review this
    it('should issue access token with issuer', function(done) {
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
      
      issue(client, user, ares, areq, {}, function(err, token) {
        if (err) { return done(err); }
        
        expect(ats.issue.callCount).to.equal(1);
        expect(ats.issue.getCall(0).args[0]).to.deep.equal({
          issuer: 'https://server.example.com',
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ]
        });
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
        done();
      });
    }); // should issue access token with issuer
    
    it('should issue access token with authentication context', function(done) {
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
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      }
      
      issue(client, user, ares, areq, {}, function(err, token) {
        if (err) { return done(err); }
        
        expect(ats.issue).to.be.calledOnceWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example'
          },
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
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
        done();
      });
    }); // should issue access token with authentication context
  
  }); // default behavior
  
});
