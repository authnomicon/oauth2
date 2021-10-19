/* global describe, it */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../com/authorize/http/response/code');


describe('http/authorize/response/code', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://i.authnomicon.org/oauth2/authorization/http/ResponseType');
    expect(factory['@type']).to.equal('code');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('creating grant', function() {
    var container = new Object();
    container.components = sinon.stub()
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
    var acs = new Object();
    acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
    
    var codeSpy = sinon.stub();
    
    var factory = $require('../../../../com/authorize/http/response/code',
      { 'oauth2orize': { grant: { code: codeSpy } } });
    
    var grant;
    before(function(done) {
      var promise = factory(container, acs);
      promise.then(function(g) {
        grant = g;
        done();
      });
    });
    
    it('should create grant', function() {
      expect(codeSpy.callCount).to.equal(1);
      expect(codeSpy.args[0][0]).to.deep.equal({ modes: {} });
      expect(codeSpy.args[0][1]).to.be.a('function');
    });
    
    describe('issue', function() {
      var code;
      
      before(function(done) {
        var client = {
          id: 's6BhdRkqt3',
          name: 'Example Client',
          redirectURIs: [ 'https://client.example.com/cb' ]
        };
        var user = {
          id: '248289761001',
          displayName: 'Jane Doe'
        };
        var ares = {
          allow: true,
          scope: [ 'profile', 'email' ]
        }
        var areq = {
          type: 'code',
          clientID: 's6BhdRkqt3',
          redirectURI: 'https://client.example.com/cb',
          state: 'xyz'
        }
        
        var issue = codeSpy.args[0][1];
        issue(client, 'https://client.example.com/cb', user, ares, areq, {}, function(err, c) {
          if (err) { return done(err); }
          code = c;
          done();
        });
      });
      
      it('should issue authorization code', function() {
        expect(acs.issue.callCount).to.equal(1);
        expect(acs.issue.args[0][0]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client',
            redirectURIs: [ 'https://client.example.com/cb' ]
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
      });
      
      it('should yield authorization code', function() {
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
    }); // issue
    
  }); // creating grant
  
  // TODO: createing grant with response modes
  
});
