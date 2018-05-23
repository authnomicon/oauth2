/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../app/tokens/authorization-code/jwt/decode');


describe('tokens/authorization-code/jwt/decode', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('decode', function() {
    
    describe('an authorization code', function() {
      var message;
      
      before(function(done) {
        var claims = {
          sub: '1',
          client_id: 's6BhdRkqt3',
          permissions: [ {
            resource_id: '112210f47de98100',
            scope: 'read:foo write:foo read:bar'
          } ]
        }
        
        var decode = factory();
        decode(claims, function(err, m) {
          if (err) { return done(err); }
          message = m;
          done();
        });
      });
      
      it('should decode', function() {
        expect(message).to.deep.equal({
          user: { id: '1' },
          client: { id: 's6BhdRkqt3' },
          permissions: [ {
            resource: { id: '112210f47de98100' },
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ]
        });
      });
    }); // an authorization code
    
  });  // decode
  
});
