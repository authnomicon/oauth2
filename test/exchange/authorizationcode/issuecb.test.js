/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../xom/exchange/authorizationcode/issuecb');


describe('handlers/exchange/issuecb', function() {
  
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
      name: 'Example Client'
    }
    
    var acs = {
      get: function(){}
    };
    var directory = {
      get: function(){}
    };
    
    describe.skip('issuing something', function() {
      var accessToken, refreshToken, params;
    
      before(function() {
        sinon.stub(acs, 'get').yields(null, {
          user: '1',
          client: 's6BhdRkqt3'
        });
        
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'https://www.example.com/return'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
        acs.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(acs, directory);
        validateFuncCb(client, 'SplxlOBeZQQYbYS6WxSbIA', 'https://client.example.com/cb', function(e, c, r) {
          if (e) { return done(e); }
          client = c;
          redirectURI = r;
          done()
        });
      });
      
      it('should call Directory#get', function() {
        expect(directory.get).to.have.been.calledWith('1');
      });
    
      it('should yield client', function() {
        expect(client).to.deep.equal({
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'https://www.example.com/return'
          ]
        });
      });
      
      it('should yield redirectURI', function() {
        expect(redirectURI).to.equal('https://www.example.com/return');
      });
    }); // validating a valid client request
    
  }); // issueCb
  
});
