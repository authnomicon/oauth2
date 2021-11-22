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
      client: {
        id: 's6BhdRkqt3'
      },
      redirectURI: 'https://client.example.com/cb',
      user: {
        id: '248289761001'
      }
    });
    var ats = new Object();
    ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
    
    
    var codeSpy = sinon.stub();
    var issue = function(){};
    
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
    
    var acs = new Object();
    acs.verify = sinon.stub().yieldsAsync(null, {
      client: {
        id: 's6BhdRkqt3',
        name: 'Example Client'
      },
      redirectURI: 'https://client.example.com/cb',
      user: {
        id: '248289761001',
        displayName: 'Jane Doe'
      },
      grant: {
        allow: true,
        scope: [ 'profile', 'email' ]
      }
    });
    var ats = new Object();
    ats.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
    
    it('should do something', function(done) {
      var token;
      
      
      var codeSpy = sinon.stub();
      var issue = function(){};
    
      var factory = $require('../../../../com/token/http/grant/code',
        { 'oauth2orize': { exchange: { code: codeSpy } } });
      
      var client = {
        id: 's6BhdRkqt3',
        name: 'Example Client',
        redirectURIs: [ 'https://client.example.com/cb' ]
      };
      
      
      factory(ats, acs, logger, container)
        .then(function(exchange) {
          var issue = codeSpy.args[0][0];
          issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.com/cb', {}, {}, function(err, t) {
            if (err) { return done(err); }
            token = t;
        
            expect(acs.verify.callCount).to.equal(1);
            expect(acs.verify.args[0][0]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        
            expect(ats.issue.callCount).to.equal(1);
            expect(ats.issue.args[0][0]).to.deep.equal({
              client: {
                id: 's6BhdRkqt3',
                name: 'Example Client',
                redirectURIs: [ 'https://client.example.com/cb' ]
              },
              user: {
                id: '248289761001',
                displayName: 'Jane Doe'
              }
            });
        
            expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
        
            done();
          });
        })
        .catch(done);
    }); // issue
    
  }); // creating exchange
  
});
