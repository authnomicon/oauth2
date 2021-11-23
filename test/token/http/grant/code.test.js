/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/token/http/grant/code');


describe('http/token/grant/code', function() {
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/token/http/AuthorizationGrantExchange');
    expect(factory['@type']).to.equal('authorization_code');
  });
  
  it('should create exchange without response parameters', function(done) {
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('http://i.authnomicon.org/oauth2/token/http/ResponseParameters').returns([]);
    var logger = {
      error: function(){},
      warning: function(){},
      notice: function(){},
      info: function(){}
    };
    var acs = new Object();
    acs.verify = sinon.stub().yieldsAsync(null, {
      client: { id: 's6BhdRkqt3' },
      redirectURI: 'https://client.example.org/cb',
      user: { id: '248289761001' }
    });
    var ats = new Object();
    ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
    
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../com/token/http/grant/code', {
      'oauth2orize': {
        exchange: { code: codeSpy }
      }
    });
    
    factory(ats, acs, logger, container)
      .then(function(exchange) {
        expect(codeSpy).to.be.calledOnce;
        done();
      })
      .catch(done);
  });

  describe('issue', function() {
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('http://i.authnomicon.org/oauth2/token/http/ResponseParameters').returns([]);
    var logger = {
      error: function(){},
      warning: function(){},
      notice: function(){},
      info: function(){}
    };
    
    
    it('should issue access token with scope', function(done) {
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': { exchange: { code: codeSpy } }
      });
      
      var acs = new Object();
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.org/cb',
        user: { id: '248289761001' },
        scope: [ 'profile', 'email' ]
      });
      var ats = new Object();
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          
          var client = {
            id: 's6BhdRkqt3',
            name: 'Example Client',
            redirectURIs: [ 'https://client.example.org/cb' ]
          };
          
          var issue = codeSpy.getCall(0).args[0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.org/cb', {}, {}, function(err, token) {
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
                name: 'Example Client',
                redirectURIs: [ 'https://client.example.org/cb' ]
              },
              scope: [ 'profile', 'email' ]
            });
            expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
            done();
          });
        })
        .catch(done);
    }); // should issue access token with scope
    
    it('should not issue access token when authorization code not issued to client', function(done) {
      var codeSpy = sinon.stub();
      var factory = $require('../../../../com/token/http/grant/code', {
        'oauth2orize': { exchange: { code: codeSpy } }
      });
      
      var acs = new Object();
      acs.verify = sinon.stub().yieldsAsync(null, {
        client: { id: 's6BhdRkqt3' },
        redirectURI: 'https://client.example.org/cb',
        user: { id: '248289761001' },
        scope: [ 'profile', 'email' ]
      });
      var ats = new Object();
      ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          
          var client = {
            id: 'XXXXXXXX',
            name: 'Example Client',
            redirectURIs: [ 'https://client.example.org/cb' ]
          };
          
          var issue = codeSpy.getCall(0).args[0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.org/cb', {}, {}, function(err, token) {
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
    
  }); // creating exchange
  
});
