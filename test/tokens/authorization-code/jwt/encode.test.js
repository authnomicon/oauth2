/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/tokens/authorization-code/jwt/encode');


describe('tokens/authorization-code/jwt/encode', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('encode', function() {
    
    describe('an authorization code', function() {
      var claims;
      
      before(function(done) {
        var msg = {
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
              identifier: 'https://api.example.com/'
            },
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ]
        }
        
        var encode = factory();
        encode(msg, function(err, c) {
          if (err) { return done(err); }
          claims = c;
          done();
        });
      });
      
      it('should encode', function() {
        expect(claims).to.deep.equal({
          sub: '1',
          client_id: 's6BhdRkqt3',
          permissions: [ {
            resource_id: '112210f47de98100',
            scope: 'read:foo write:foo read:bar'
          } ]
        });
      });
    }); // an authorization code
    
  }); // encode
  
});
