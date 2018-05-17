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
  
  /*
  describe('issue', function() {
    var client = {
      id: 's6BhdRkqt3',
      name: 'Example Client'
    };
    var user = {
      id: '1',
      displayName: 'John Doe'
    };
    
    var translate;
    var Tokens = {
      seal: function(){}
    };
    
    
    describe('issuing an authorization code', function() {
      var code;
      
      before(function() {
        translate = sinon.stub().yields(null, { sub: '1', cid: 's6BhdRkqt3' });
        sinon.stub(Tokens, 'seal').yields(null, 'SplxlOBeZQQYbYS6WxSbIA');
      });
      
      after(function() {
        Tokens.seal.restore();
      });
      
      before(function(done) {
        var ares = {
          allow: true,
          permissions: [ {
            resource: 'https://api.example.com/',
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ]
        }
        
        var issueCb = factory(translate, Tokens);
        issueCb(client, 'https://client.example.com/cb', user, ares, {}, {}, function(e, c) {
          if (e) { return done(e); }
          code = c;
          done();
        });
      });
      
      it('should translate context into claims', function() {
        expect(translate).to.have.been.calledOnce;
        var call = translate.getCall(0);
        expect(call.args[0]).to.deep.equal({
          user: {
            id: '1',
            displayName: 'John Doe'
          },
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          },
          permissions: [ {
            resource: 'https://api.example.com/',
            scope: [ 'read:foo', 'write:foo', 'read:bar' ]
          } ],
          redirectURI: 'https://client.example.com/cb'
        });
      });
      
      it('should seal claims into token', function() {
        expect(Tokens.seal).to.have.been.calledOnce;
        var call = Tokens.seal.getCall(0);
        expect(call.args[0]).to.equal('application/jwt');
        expect(call.args[1]).to.deep.equal({
          sub: '1',
          cid: 's6BhdRkqt3'
        });
      });
      
      it('should yield authorization code', function() {
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
    }); // issuing an authorization code
    
  }); // issue
  */
  
});
