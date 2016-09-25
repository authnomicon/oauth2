/* global describe, it */

var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../../../xom/handlers/authorize/validaterequestcb');


describe('handlers/authorize/validaterequestcb', function() {
  
  it('should export factory function', function() {
    expect(factory).to.be.a('function');
  });
  
  describe('factory', function() {
    var directory = new Object();
    var func = factory(directory);
    
    it('should return function', function() {
      expect(func).to.be.a('function');
    });
  });
  
  describe('validateRequestCb', function() {
    var directory = {
      get: function(){}
    };
    
    describe('someting', function() {
      var client, redirectURI;
    
      before(function() {
        sinon.stub(directory, 'get').yields(null, {
          id: '1',
          name: 'Example Client',
          redirectURIs: [
            'http://localhost:3000/return'
          ]
        });
      });
    
      after(function() {
        directory.get.restore();
      });
    
      before(function(done) {
        var validateFuncCb = factory(directory);
        validateFuncCb('1', 'https://www.example.com/return', function(e, c, r) {
          if (e) { return done(err); }
          client = c;
          redirectURI = redirectURI;
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
            'http://localhost:3000/return'
          ]
        });
      });
    })
    
    
  });
  
});
