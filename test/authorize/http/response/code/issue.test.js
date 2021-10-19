/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../../../com/authorize/http/response/code/issue');


describe('http/authorize/response/code/issue', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    //expect(factory['@implements']).to.be.undefined;
    expect(factory['@singleton']).to.be.undefined;
  });
  
  describe('issue', function() {
    var codes = {
      issue: function(){}
    };
    
    var client = {
      id: 's6BhdRkqt3',
      name: 'Example Client'
    };
    var user = {
      id: '248289761001',
      displayName: 'Jane Doe'
    };
    
    describe('an authorization code', function() {
      var code;
      
      before(function() {
        sinon.stub(codes, 'issue').yields(null, 'SplxlOBeZQQYbYS6WxSbIA');
      });
      
      after(function() {
        codes.issue.restore();
      });
      
      before(function(done) {
        var ares = {
          allow: true,
          scope: undefined
        }
        
        var issue = factory(codes);
        issue(client, 'https://client.example.com/cb', user, ares, {}, {}, function(err, c) {
          if (err) { return done(err); }
          code = c;
          done();
        });
      });
      
      /*
      it('should encode context', function() {
        expect(codes.issue.callCount).to.equal(1);
        expect(codes.issue.args[0][0]).to.equal('urn:ietf:params:oauth:token-type:jwt');
        expect(codes.issue.args[0][1]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          }
        });
        expect(codes.encode.args[0][2]).to.deep.equal([{
          id: 'AS1AC',
          identifier: 'http://localhost/authorization_code',
          secret: 'some-secret-shared-with-oauth-authorization-server'
        }]);
      });
      */
      
      it('should yield authorization code', function() {
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
    }); // an authorization code
    
    describe('an authorization code with scope', function() {
      var code;
      
      before(function() {
        sinon.stub(codes, 'issue').yields(null, 'SplxlOBeZQQYbYS6WxSbIA');
      });
      
      after(function() {
        codes.issue.restore();
      });
      
      before(function(done) {
        var ares = {
          allow: true,
          scope: [ 'profile', 'email' ]
        }
        
        var issue = factory(codes);
        issue(client, 'https://client.example.com/cb', user, ares, {}, {}, function(err, c) {
          if (err) { return done(err); }
          code = c;
          done();
        });
      });
      
      /*
      it('should encode authorization code', function() {
        expect(codes.issue.callCount).to.equal(1);
        expect(codes.issue.args[0][0]).to.equal('urn:ietf:params:oauth:token-type:jwt');
        expect(codes.issue.args[0][1]).to.deep.equal({
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          user: {
            id: '248289761001',
            displayName: 'Jane Doe'
          },
          scope: [ 'profile', 'email' ]
        });
        expect(codes.issue.args[0][2]).to.deep.equal([{
          id: 'AS1AC',
          identifier: 'http://localhost/authorization_code',
          secret: 'some-secret-shared-with-oauth-authorization-server'
        }]);
      });
      */
      
      it('should yield authorization code', function() {
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
    }); // an authorization code with scope
    
  }); // issue
  
});
