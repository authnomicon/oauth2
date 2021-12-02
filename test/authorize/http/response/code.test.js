/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/response/code');


describe('http/authorize/response/code', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/ResponseType');
    expect(factory['@type']).to.equal('code');
  });
  
  it('should create response type without response modes', function(done) {
    var container = new Object();
    container.components = sinon.stub();
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
    var acs = new Object();
    acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../com/authorize/http/response/code', {
      'oauth2orize': {
        grant: { code: codeSpy }
      }
    });
    
    factory(acs, undefined, container)
      .then(function(type) {
        expect(codeSpy).to.be.calledOnce;
        expect(codeSpy).to.be.calledWith({ modes: {} });
        done();
      })
      .catch(done);
  }); // should create response type without response modes
  
  
  describe('issue', function() {
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters').returns([]);
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
    var acs = new Object();
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../com/authorize/http/response/code', {
      'oauth2orize': {
        grant: { code: codeSpy }
      }
    });
    
    var issue;
    
    beforeEach(function(done) {
      acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
      
      factory(acs, null, container)
        .then(function(type) {
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
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
        state: 'xyz'
      }
      
      issue(client, 'https://client.example.com/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue.callCount).to.equal(1);
        expect(acs.issue.getCall(0).args[0]).to.deep.equal({
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
        name: 'My Example Client'
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
      
      issue(client, 'https://client.example.org/cb', user, ares, areq, {}, function(err, code) {
        if (err) { return done(err); }
        
        expect(acs.issue.callCount).to.equal(1);
        expect(acs.issue.getCall(0).args[0]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
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
    
    it('should issue authorization code with issuer', function(done) {
      var client = {
        id: 's6BhdRkqt3',
        name: 'My Example Client'
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
            name: 'My Example Client'
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
        name: 'My Example Client'
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
          methods: [
            { method: 'password', timestamp: new Date('2011-07-21T20:42:49.000Z') }
          ]
        }
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
          client: {
            id: 's6BhdRkqt3',
            name: 'My Example Client'
          },
          redirectURI: 'https://client.example.org/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'openid', 'profile', 'email' ],
          authContext: {
            sessionID: 'YU7uoYRVAxF34TuoAodVfw-1eA13rhqW',
            methods: [
              { method: 'password', timestamp: new Date('2011-07-21T20:42:49.000Z') }
            ]
          }
        });
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        done();
      });
    }); // should issue authorization code with authentication context
    
  }); // issue
  
  // TODO: createing grant with response modes
  
});
