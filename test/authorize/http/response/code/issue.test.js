/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../../app/authorize/http/response/code/issue');


describe('authorize/http/response/code/issue', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    //expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('issue', function() {
    var codes = {
      encode: function(){}
    };
    
    var client = {
      id: 's6BhdRkqt3',
      name: 'Example Client'
    };
    var user = {
      id: '248289761001',
      displayName: 'Jane Doe'
    };
    
    describe('issuing an authorization code', function() {
      var code;
      
      before(function() {
        sinon.stub(codes, 'encode').yields(null, 'SplxlOBeZQQYbYS6WxSbIA');
      });
      
      after(function() {
        codes.encode.restore();
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
        
        var issue = factory(codes);
        issue(client, 'https://client.example.com/cb', user, ares, {}, {}, function(err, c) {
          if (err) { return done(err); }
          code = c;
          done();
        });
      });
      
      it('should encode authorization code', function() {
        expect(codes.encode.callCount).to.equal(1);
        expect(codes.encode.args[0][0]).to.equal('urn:ietf:params:oauth:token-type:jwt');
        expect(codes.encode.args[0][1]).to.deep.equal({
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
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
        expect(codes.encode.args[0][2]).to.deep.equal([{
          id: 'AS1AC',
          identifier: 'http://localhost/authorization_code',
          secret: 'some-secret-shared-with-oauth-authorization-server'
        }]);
      });
      
      it('should yield authorization code', function() {
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
    }); // issuing an authorization code
    
  }); // issue
  
});
