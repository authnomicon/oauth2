/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../../com/authorize/http/response/token/issue');


describe('http/authorize/response/token/issue', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var func = factory();
    
    it('should return function', function() {
      expect(func).to.be.a('function');
    });
  });
  
  describe('issueCb', function() {
    var client = {
      id: 's6BhdRkqt3',
      name: 'Example Client',
      authenticationSchemes: [ { type: 'bearer' } ]
    }
    var user = {
      id: '1',
      displayName: 'John Doe'
    };
    
    var directory = {
      get: function(){}
    };
    var schemes = {
      negotiate: function(){}
    };
    var tokens = {
      encode: function(){},
      negotiate: function(){}
    };
    
    describe('issuing something', function() {
      var accessToken, params;
      
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: 'https://api.example.com/',
          name: 'Example API',
          authenticationSchemes: [ { type: 'bearer' } ],
          tokenTypes: [ {
            type: 'urn:ietf:params:oauth:token-type:access_token'
          } ]
        });
        
        sinon.stub(schemes, 'negotiate').returns({
          type: 'bearer'
        });
        
        sinon.stub(tokens, 'negotiate').returns({
          type: 'urn:ietf:params:oauth:token-type:access_token'
        });
        
        sinon.stub(tokens, 'encode').yields(null, '2YotnFZFEjr1zCsicMWpAA');
      });
      
      after(function() {
        tokens.encode.restore();
        tokens.negotiate.restore();
        directory.get.restore();
      });
      
      before(function(done) {
        var ares = {
          allow: true,
          access: [ {
            resource: 'https://api.example.com/',
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ]
        }
        
        var issueCb = factory(directory, schemes, tokens);
        issueCb(client, user, ares, {}, {}, function(e, a, p) {
          if (e) { return done(e); }
          accessToken = a;
          params = p;
          done();
        });
      });
      
      it('should call Directory#get', function() {
        expect(directory.get).to.have.been.calledOnce;
        expect(directory.get).to.have.been.calledWith('https://api.example.com/');
      });
      
      it('should call schemes.negotiate', function() {
        expect(schemes.negotiate).to.have.been.calledOnce;
        expect(schemes.negotiate).to.have.been.calledWith([{ type: "bearer" }], [{ type: "bearer" }]);
      });
      
      it('should call tokens.negotiate', function() {
        expect(tokens.negotiate).to.have.been.calledOnce;
        expect(tokens.negotiate).to.have.been.calledWith([ {
          type: 'urn:ietf:params:oauth:token-type:access_token'
        } ]);
      });
      
      it('should call tokens.encode', function() {
        expect(tokens.encode).to.have.been.calledOnce;
        var call = tokens.encode.getCall(0);
        expect(call.args[0]).to.equal('urn:ietf:params:oauth:token-type:access_token');

        var claims = call.args[1];
        var expiresAt = claims.expiresAt;
        delete claims.expiresAt;
        
        expect(call.args[1]).to.deep.equal({
          subject: '1',
          authorizedParty: 's6BhdRkqt3',
          audience: 'https://api.example.com/',
          scope: [ 'read:foo', 'write:foo', 'read:bar' ]
        });
        expect(expiresAt).to.be.an.instanceOf(Date);
        
        var expectedExpiresAt = new Date();
        expectedExpiresAt.setHours(expectedExpiresAt.getHours() + 2);
        expect(expiresAt).to.be.closeToDate(expectedExpiresAt, 2, 'seconds');

        expect(call.args[2]).to.deep.equal({
          peer: {
            id: 'https://api.example.com/',
            name: 'Example API',
            authenticationSchemes: [ { type: 'bearer' } ],
            tokenTypes: [ {
              type: 'urn:ietf:params:oauth:token-type:access_token',
            } ]
          }
        });
      });
      
      it('should yield an access token', function() {
        expect(accessToken).to.equal('2YotnFZFEjr1zCsicMWpAA');
      });
      
      it('should yield parameters', function() {
        expect(params).to.deep.equal({
          token_type: 'bearer'
        });
      });
    }); // issuing something
    
  }); // issueCb
  
});
