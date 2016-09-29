/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../xom/response/code/issuecb');


describe('response/code/issuecb', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  it('should be annotated', function() {
    expect(factory['@implements']).to.equal('http://schema.modulate.io/js/aaa/oauth2/issueCodeFunc');
    expect(factory['@singleton']).to.be.undefined;
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
      name: 'Example Client'
    };
    var user = {
      id: '1',
      displayName: 'John Doe'
    };
    
    var acs = {
      set: function(){}
    };
    
    describe('issuing something', function() {
      var code;
      
      before(function() {
        sinon.stub(acs, 'set').yields(null, 'SplxlOBeZQQYbYS6WxSbIA');
      });
      
      after(function() {
        acs.set.restore();
      });
      
      before(function(done) {
        var issueCb = factory(acs);
        issueCb(client, 'https://client.example.com/cb', user, {}, {}, {}, function(e, c) {
          if (e) { return done(e); }
          code = c;
          done();
        });
      });
      
      it('should call AuthorizationCodeStore#set', function() {
        expect(acs.set).to.have.been.calledOnce;
        expect(acs.set).to.have.been.calledWith({
          client: {
            id: 's6BhdRkqt3',
            name: 'Example Client'
          },
          redirectURI: 'https://client.example.com/cb',
          user: {
            id: '1',
            displayName: 'John Doe'
          }
        });
      });
      
      it('should yield authorization code', function() {
        expect(code).to.equal('SplxlOBeZQQYbYS6WxSbIA');
      });
    });
    
  });
  
});
