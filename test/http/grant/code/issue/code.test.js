/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../../app/http/grant/code/issue/code');


describe('http/grant/code/issue/code', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    //expect(factory['@implements']).to.equal('http://schema.modulate.io/js/aaa/oauth2/issueCodeFunc');
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('issue', function() {
    var tokens = {
      encode: function(){}
    };
    
    var client = {
      id: 's6BhdRkqt3',
      name: 'Example Client'
    };
    var user = {
      id: '1',
      displayName: 'John Doe'
    };
    
    
    describe('issuing an authorization code', function() {
      var code;
      
      before(function() {
        sinon.stub(tokens, 'encode').yields(null, 'SplxlOBeZQQYbYS6WxSbIA');
      });
      
      after(function() {
        tokens.encode.restore();
      });
      
      before(function(done) {
        var ares = {
          allow: true,
          permissions: [ {
            resource: {
              id: '112210f47de98100',
              identifier: 'https://api.example.com/',
              name: 'Example API'
            },
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ]
        }
        
        var issue = factory(tokens);
        issue(client, 'https://client.example.com/cb', user, ares, {}, {}, function(err, c) {
          if (err) { return done(err); }
          code = c;
          done();
        });
      });
      
      it('should encode token', function() {
        expect(tokens.encode.callCount).to.equal(1);
        expect(tokens.encode.args[0][0]).to.equal('urn:ietf:params:oauth:token-type:jwt');
        expect(tokens.encode.args[0][1]).to.deep.equal({
          user: {
            id: '1',
            displayName: 'John Doe'
          },
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          },
          permissions: [ {
            resource: {
              id: '112210f47de98100',
              identifier: 'https://api.example.com/',
              name: 'Example API'
            },
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ],
          redirectURI: 'https://client.example.com/cb'
        });
      });
      
      it('should yield authorization code', function() {
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
    }); // issuing an authorization code
    
  }); // issue
  
});
