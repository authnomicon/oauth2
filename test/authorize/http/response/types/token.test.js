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
  
  it('should create processor without responders', function(done) {
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([]);
    
    var tokenSpy = sinon.stub();
    var factory = $require('../../../../../com/authorize/http/response/types/token', {
      'oauth2orize': {
        grant: { token: tokenSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(tokenSpy).to.be.calledOnceWith({
          modes: {}
        });
        done();
      })
      .catch(done);
  }); // should create processor without responders
  
  it('should create processor with responders', function(done) {
    var fragmentResponder = function(){};
    var fragmentResponderComponent = new Object();
    fragmentResponderComponent.create = sinon.stub().resolves(fragmentResponder);
    fragmentResponderComponent.a = { '@mode': 'fragment' };
    var formPostResponder = function(){};
    var formPostResponderComponent = new Object();
    formPostResponderComponent.create = sinon.stub().resolves(formPostResponder);
    formPostResponderComponent.a = { '@mode': 'form_post' };
    
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([
      fragmentResponderComponent,
      formPostResponderComponent
    ]);
    
    var tokenSpy = sinon.stub();
    var factory = $require('../../../../../com/authorize/http/response/types/token', {
      'oauth2orize': {
        grant: { token: tokenSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(tokenSpy).to.be.calledOnceWith({
          modes: {
            fragment: fragmentResponder,
            form_post: formPostResponder
          }
        });
        done();
      })
      .catch(done);
  }); // should create processor with responders
  
  it('should create processor with responders but excluding query responder', function(done) {
    var queryResponder = function(){};
    var queryResponderComponent = new Object();
    queryResponderComponent.create = sinon.stub().resolves(queryResponder);
    queryResponderComponent.a = { '@mode': 'query' };
    var fragmentResponder = function(){};
    var fragmentResponderComponent = new Object();
    fragmentResponderComponent.create = sinon.stub().resolves(fragmentResponder);
    fragmentResponderComponent.a = { '@mode': 'fragment' };
    
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('module:oauth2orize.Responder').returns([
      queryResponderComponent,
      fragmentResponderComponent
    ]);
    
    var tokenSpy = sinon.stub();
    var factory = $require('../../../../../com/authorize/http/response/types/token', {
      'oauth2orize': {
        grant: { token: tokenSpy }
      }
    });
    
    factory(null, logger, container)
      .then(function(type) {
        expect(tokenSpy).to.be.calledOnceWith({
          modes: {
            fragment: fragmentResponder
          }
        });
        done();
      })
      .catch(done);
  }); // should create processor with responders but excluding query responder
  
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
      };
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
        state: 'xyz'
      };
      
      issue(client, user, ares, areq, {}, function(err, token) {
        if (err) { return done(err); }
        
        expect(ats.issue).to.be.calledOnceWith({
          allow: true,
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
      };
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      };
      
      issue(client, user, ares, areq, {}, function(err, token) {
        if (err) { return done(err); }
        
        expect(ats.issue).to.be.calledOnceWith({
          allow: true,
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
      };
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.org/cb',
        state: 'af0ifjsldkj'
      };
      
      issue(client, user, ares, areq, {}, function(err, token) {
        if (err) { return done(err); }
        
        expect(ats.issue).to.be.calledOnceWith({
          allow: true,
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
  
  describe('with failing access token service', function() {
    var ats = new Object();
    
    var issue;
    
    beforeEach(function(done) {
      var container = new Object();
      container.components = sinon.stub()
      container.components.withArgs('module:oauth2orize.Responder').returns([]);
      container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
      ats.issue = sinon.stub().yieldsAsync(new Error('something went wrong'));
      
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
      
      issue(client, user, ares, areq, {}, function(err, token) {
        expect(err).to.be.an.instanceof(Error);
        expect(err.message).to.equal('something went wrong');
        expect(token).to.be.undefined;
        done();
      });
    }); // should yield error
    
  }); // with failing access token service
  
});
