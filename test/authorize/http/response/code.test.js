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
    container.components.withArgs('http://i.authnomicon.org/oauth2/authorization/http/ResponseMode').returns([]);
    var acs = new Object();
    acs.issue = sinon.stub().yieldsAsync(null, 'SplxlOBeZQQYbYS6WxSbIA');
    
    var codeSpy = sinon.stub();
    var factory = $require('../../../../com/authorize/http/response/code', {
      'oauth2orize': {
        grant: { code: codeSpy }
      }
    });
    
    var issue;
    
    before(function(done) {
      factory(acs, null, container)
        .then(function(type) {
          issue = codeSpy.getCall(0).args[1];
          done();
        })
        .catch(done);
    });
    
    it('should issue authorization code with redirect URI', function(done) {
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
        scope: [ 'profile', 'email' ]
      }
      var areq = {
        type: 'code',
        clientID: 's6BhdRkqt3',
        redirectURI: 'https://client.example.com/cb',
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
          grant: {
            allow: true,
            scope: [ 'profile', 'email' ]
          }
        });
        
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
        
        done();
      });
    }); // issue
    
  }); // creating grant
  
  // TODO: createing grant with response modes
  
});
