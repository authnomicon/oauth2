/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/http/token/grant/code');


describe('http/token/grant/code', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/token/http/AuthorizationGrantExchange');
    expect(factory['@type']).to.equal('authorization_code');
    expect(factory['@singleton']).to.be.undefined;
  });

  describe('creating exchange', function() {
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
    var sts = new Object();
    sts.issue = sinon.stub().yieldsAsync(null, '2YotnFZFEjr1zCsicMWpAA');
    
    var codeSpy = sinon.stub();
    var issue = function(){};
    
    var factory = $require('../../../../app/http/token/grant/code',
      { 'oauth2orize': { exchange: { code: codeSpy } } });
    var exchange = factory(sts, acs);
    
    it('should create exchange', function() {
      expect(codeSpy.callCount).to.equal(1);
      expect(codeSpy.args[0][0]).to.be.a('function');
    });
    
    describe('issue', function() {
      var token;
      
      before(function(done) {
        var client = {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ]
        };
        
        var issue = codeSpy.args[0][0];
        issue(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.com/cb', {}, {}, function(err, t) {
          if (err) { return done(err); }
          token = t;
          done();
        });
      });
      
      it('should verify authorization code', function() {
        expect(acs.verify.callCount).to.equal(1);
        expect(acs.verify.args[0][0]).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
      
      it('should issue access token', function() {
        expect(sts.issue.callCount).to.equal(1);
        expect(sts.issue.args[0][0]).to.deep.equal({
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
      });
      
      it('should yield access token', function() {
        expect(token).to.equal('2YotnFZFEjr1zCsicMWpAA');
      });
    }); // issue
    
  }); // creating exchange
  
});
